import os
from flask import Blueprint, request, current_app, jsonify, json
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import yaml
import uuid
from datetime import datetime
from enum import Enum

from ..services.get_aws import SasAws
from ..utils import response
from ..utils import conversion

resource_api = Blueprint('resource_api', __name__)
sas_aws = SasAws()
RESOURCE_BUCKET = "sas-public"
METADATA_BUCKET = "sas-metadata"

# Create a base class for declarative ORM models
Base = declarative_base()

# Enum class for category
class Category(Enum):
    MENSTRUATION = "menstruation"
    SEXUAL_HEALTH = "sexual health"
    MATERNAL_HEALTH = "maternal health"
    REPRODUCTIVE_HEALTH = "reproductive health"
    NUTRITION = "nutrition"
    EXERCISE = "exercise"
    GROWING_UP = "growing up"
    MENTAL_HEALTH = "mental health"

# GET
@resource_api.route('/resources/metadata')
def resources_get_metadata():
    try:
        resp = sas_aws.s3.get_object(Bucket=METADATA_BUCKET, Key="resourceMaps.json")
        json_raw = resp["Body"].read().decode("utf-8")
        json_data = json.loads(json_raw)
        return jsonify(json_data)
    except Exception as e:
        print(e)
        return response.error_json_response(e)

# GET
@resource_api.route('/resources/content')
def resources_get_by_id():
    try:
        result: dict[str, str | None] = []
        resp = sas_aws.s3.list_objects_v2(Bucket=RESOURCE_BUCKET, Prefix="resources/markdowns_current")
        for obj in resp["Contents"]:
            object_key, object_size, object_last_modified = obj["Key"], obj["Size"], obj["LastModified"]
            path_parts: list[str] = object_key.split("/")

            # account for structure of intro files at top of each topic (similar logic can be applied to any file at the topic level)
            # example of non-intro path: resources/markdowns_current/menstruation/menstrual_health_hygiene/en_frequency_of_changing_your_period_product.md
            # example of intro path: resources/markdowns_current/menstruation/en_intro.md
            file_name: str = path_parts[-1]
            is_intro_file: bool = "en_intro" in file_name or "kn_intro" in file_name or "hi_intro" in file_name
            section_name: str | None = path_parts[-2] if not is_intro_file else None
            topic_name: str = path_parts[-3 if not is_intro_file else -2]
            
            result.append({
                "resource_url": sas_aws.S3_BUCKET + object_key,
                "resource_last_modified": object_last_modified,
                "resource_topic": topic_name,
                "resource_section": section_name,
                "resource_filename": file_name,
                "resource_language": file_name.split("_")[0]
            })
        return jsonify(result)
    except Exception as e:
        return response.error_json_response(e)

"""
# Define the resource class
class Resource(Base):
    __tablename__ = 'metadata'

    id = Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column("title", String)
    s3_url = Column("s3_url", String)
    author = Column("author", String)
    category = Column("category", String)
    timestamp = Column("timestamp", Integer)

    def __init__(self, title, s3_url, author, category, timestamp):
        self.title = title
        self.s3_url = s3_url
        self.author = author
        self.category = category
        self.timestamp = timestamp

    def as_dict(self): 
        return {
            'id': str(self.id),
            'title': self.title,
            's3_url': self.s3_url,
            'author': self.author,
            'category': self.category,
            'timestamp': self.timestamp
        }

# Create table in database
Base.metadata.create_all(sas_aws.engine)

# GET
@resource_api.route('/resources/<id>')
def resources_get_by_id(id):
    try: 
        resp = sas_aws.rds.query(Resource).filter(Resource.id == id).first()
        current_app.logger.info(f"[GET] response: {resp}")
            # resource is not in metadata table
        if not resp:
            return response.error_json_response(id)
        # valid resource
        return jsonify(resp.as_dict())  
    except Exception as e:
        return response.error_json_response(e)

# POST
@resource_api.route('/resources', methods=['POST'])
def resources_post():
    try: 
        data = request.data.decode("utf-8")
        received_json_data = json.loads(data)
        current_app.logger.info(f"[POST] received data: {received_json_data}")

        resource_obj = Resource(
            received_json_data["title"],
            received_json_data["s3_url"],
            received_json_data["author"],
            received_json_data["category"],
            conversion.convert_dateStr_epoch(f"{datetime.now().year}-{datetime.now().month}-{datetime.now().day}")
        )
        sas_aws.rds.add(resource_obj)
        sas_aws.rds.commit()

        return received_json_data
    except Exception as e:
        return response.error_json_response(e)

# PUT
@resource_api.route('/resources/<id>', methods=['PUT'])
def resources_put_by_id(id):
    try: 
        data = request.data.decode("utf-8")
        received_json_data = json.loads(data)
        current_app.logger.info("[PUT] received data: ", received_json_data)

        # Get the resource
        resource = sas_aws.rds.query(Resource).filter(Resource.id == id).first()

        resource.title = received_json_data['title']
        resource.s3_url = received_json_data['s3_url']
        resource.author = received_json_data['author']
        resource.category = received_json_data['category']
        resource.timestamp = received_json_data['timestamp']
        sas_aws.rds.commit()

        return received_json_data
    except Exception as e:
        return response.error_json_response(e)

# DELETE
@resource_api.route('/resources/<id>', methods=['DELETE'])
def resources_delete_by_id(id):
    try: 
        resource = sas_aws.rds.query(Resource).filter(Resource.id == id).first()
        current_app.logger.info(f"[DELETE] response: {resource}")

        if not resource:
            return response.error_json_response(id)
        
        sas_aws.rds.delete(resource)
        sas_aws.rds.commit()
        return jsonify(resource.as_dict())
    except Exception as e:
        return response.error_json_response(e)

@resource_api.route('/resources/category/<category>')
def resources_get_by_category(category):
    try:
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))

        offset = (page - 1) * per_page

        # Get the resources by category and order by timestamp
        query = sas_aws.rds.query(Resource).filter(Resource.category == category).order_by(Resource.timestamp.desc())

        # From the resources get the resources in the specified page
        pagination = query.limit(per_page).offset(offset).all()

        current_app.logger.info(f"[GET] response: {pagination}")
        # resource is not in metadata table
        if len(pagination) == 0:
            return response.error_json_response(category)
        # valid resources
        resources = []
        for rec in pagination:
            obj = rec.as_dict()
            resources.append(obj)

        return jsonify(resources) 
    except Exception as e:
        return response.error_json_response(e)

@resource_api.route('/resources/author/<author>')
def resources_get_by_author(author):
    try: 
        resp = sas_aws.rds.query(Resource).filter(Resource.author == author).all()
        current_app.logger.info(f"[GET] response: {resp}")
        # resource is not in metadata table
        if len(resp) == 0:
            return response.error_json_response(author)
        # valid resources
        resources = []
        for rec in resp:
            obj = rec.as_dict()
            resources.append(obj)
        return jsonify(resources)
    except Exception as e:
        return response.error_json_response(e)
"""