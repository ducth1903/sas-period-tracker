import boto3
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

class SasAws:
    # AWS DynamoDB
    dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
    userTable = dynamodb.Table("SasPeriodTrackerUserTable")
    periodTable = dynamodb.Table("SasPeriodTrackerPeriodTable")

    # AWS S3
    s3 = boto3.client("s3", region_name="us-east-2")
    S3_BUCKET = os.environ.get("AWS_S3_BUCKET")
    # S3_PROFILE_IMAGE_PATH = 'https://sas-period-tracker.s3.amazonaws.com/profile-images/'

    # AWS RDS
    db_user = os.environ.get("AWS_RDS_RESOURCE_USER")
    db_password = os.environ.get("AWS_RDS_RESOURCE_PASSWORD")
    db_host = os.environ.get("AWS_RDS_RESOURCE_HOST")
    db_port = os.environ.get("AWS_RDS_RESOURCE_PORT")
    db_name = os.environ.get("AWS_RDS_RESOURCE_NAME")

    # create the URL string
    url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

    # # create the SQLAlchemy engine
    # engine = create_engine(url)

    # # Create a Session class
    # Session = sessionmaker(bind=engine)
    # # Create the actual session
    # rds = Session()

