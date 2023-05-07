from flask import Blueprint, request, current_app, jsonify, json
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

from ..services.get_aws import SasAws
from ..utils import response

resource_api = Blueprint('resource_api', __name__)
sas_aws = SasAws()

# Create a base class for declarative ORM models
Base = declarative_base()

# Define the resource class
class Resource(Base):
    __tablename__ = 'metadata'

    id = Column("id", Integer, primary_key=True)
    title = Column("title", String)
    s3_url = Column("s3_url", String)
    author = Column("author", String)
    category = Column("category", String)
    timestamp = Column("timestamp", Integer)

    def __init__(self, id, title, s3_url, author, category, timestamp):
        self.id = id
        self.title = title
        self.s3_url = s3_url
        self.author = author
        self.category = category
        self.timestamp = timestamp

# GET
@resource_api.route('/resources/<id>')
def resources_get_by_id(id):
    resp = sas_aws.rds.query(Resource).filter(Resource.id == id).first()
    current_app.logger.info(f"[GET] response: {resp}")
        # resource is not in metadata table
    if not resp:
        return response.error_json_response(id)
    # valid resource
    return jsonify(resp)      

# POST
@resource_api.route('/resources/<id>')
def resources_post_by_id(id):
    data = request.data.decode("utf-8")
    received_json_data = json.loads(data)
    current_app.logger.info(f"[POST] received data: {received_json_data}")

    for rec in received_json_data:
        resource_obj = {
            "id": rec["id"],
            "title": rec["title"],
            "s3_url": rec["s3_url"],
            "author": rec["author"],
            "category": rec["category"],
            "timestamp": rec["timestamp"]
        }
        sas_aws.rds.add(resource_obj)
        sas_aws.rds.commit()

    return response.ok_json_response()

# PUT
@resource_api.route('/resources/<id>')
def resources_put_by_id(id):
    data = request.data.decode("utf-8")
    received_json_data = json.loads(data)
    current_app.logger.info("[PUT] received data: ", received_json_data)

    # Get the resource
    resource = sas_aws.rds.query(Resource).filter(Resource.id == id).first()

    resource.title = received_json_data['name']
    resource.s3_url = received_json_data['s3_url']
    resource.author = received_json_data['author']
    resource.category = received_json_data['category']
    resource.timestamp = received_json_data['timestamp']
    sas_aws.rds.commit()

    return received_json_data

# DELETE
@resource_api.route('/resources/<id>')
def resources_delete_by_id(id):
    resource = sas_aws.rds.query(Resource).filter(Resource.id == id).first()

    if not resource:
        return response.error_json_response(id)
    
    sas_aws.rds.delete(resource)
    sas_aws.rds.commit()
    return response.ok_json_response

@resource_api.route('/resources/<category>')
def resources_get_by_category(category):
    resp = sas_aws.rds.query(Resource).filter(Resource.category == category).all()
    current_app.logger.info(f"[GET] response: {resp}")
    # resource is not in metadata table
    if len(resp) == 0:
        return response.error_json_response(category)
    # valid resources
    resources = []
    for rec in resp:
        obj = {"id": rec.id, "title": rec.title, "s3_url": rec.s3_url, "author": rec.author, "category": rec.category, "timestamp": rec.timestamp}
        resources.append(obj)
    return jsonify(resources) 

@resource_api.route('/resources/<author>')
def resources_get_by_author(author):
    resp = sas_aws.rds.query(Resource).filter(Resource.category == author).all()
    current_app.logger.info(f"[GET] response: {resp}")
    # resource is not in metadata table
    if len(resp) == 0:
        return response.error_json_response(author)
    # valid resources
    resources = []
    for rec in resp:
        obj = {"id": rec.id, "title": rec.title, "s3_url": rec.s3_url, "author": rec.author, "category": rec.category, "timestamp": rec.timestamp}
        resources.append(obj)
    return jsonify(resources)