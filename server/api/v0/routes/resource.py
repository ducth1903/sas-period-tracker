from flask import Blueprint, request, current_app, jsonify, json
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

from ..services.get_aws import SasAws
from ..utils import response

load_dotenv()

resource_api = Blueprint('resource_api', __name__)
sas_aws = SasAws()

db_user = os.getenv("AWS_RDS_RESOURCE_USER")
db_password = os.getenv("AWS_RDS_RESOURCE_PASSWORD")
db_host = os.getenv("AWS_RDS_RESOURCE_HOST")
db_port = os.getenv("AWS_RDS_RESOURCE_PORT")
db_name = os.getenv("AWS_RDS_RESOURCE_NAME")

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

# create the URL string
url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

# create the SQLAlchemy engine
engine = create_engine(url)

# Create a Session class
Session = sessionmaker(bind=engine)
# Create the actual session
session = Session()

@resource_api.route('/resources/<id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def resources_get_by_id(id):
    if request.method == "GET":
        resp = session.query(Resource).filter(Resource.id == id).first()
        current_app.logger.info(f"[GET] response: {resp}")
         # resource is not in metadata table
        if not resp:
            return response.error_json_response(id)
        # valid resource
        return jsonify(resp)      
        
    elif request.method == "POST":
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
            session.add(resource_obj)
            session.commit()

        return response.ok_json_response()
    
    elif request.method == "PUT":
        data = request.data.decode("utf-8")
        received_json_data = json.loads(data)
        current_app.logger.info("[PUT] received data: ", received_json_data)

        # Get the resource
        resource = session.query(Resource).filter(Resource.id == id).first()

        resource.title = received_json_data['name']
        resource.s3_url = received_json_data['s3_url']
        resource.author = received_json_data['author']
        resource.category = received_json_data['category']
        resource.timestamp = received_json_data['timestamp']
        session.commit()

        return received_json_data
    
    elif request.method == "DELETE":
        resource = session.query(Resource).filter(Resource.id == id).first()
        
        if not resource:
            return response.error_json_response(id)
        
        session.delete(resource)
        session.commit()
        return response.ok_json_response