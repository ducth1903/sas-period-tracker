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

# create the URL string
url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

# create the SQLAlchemy engine
engine = create_engine(url)

# Create a Session class
Session = sessionmaker(bind=engine)
# Create the actual session
session = Session()