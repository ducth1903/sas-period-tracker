import boto3
import os
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

class SasAws:
    def __init__(self):
        # AWS DynamoDB
        self.dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
        self.userTable = self.dynamodb.Table("SasPeriodTrackerUserTable")
        self.periodTable = self.dynamodb.Table("SasPeriodTrackerPeriodTable")

        # AWS S3
        self.s3 = boto3.client("s3", region_name="us-east-1")
        self.S3_BUCKET = "s3-sas-period-tracker"
        # S3_PROFILE_IMAGE_PATH = 'https://sas-period-tracker.s3.amazonaws.com/profile-images/'

        # AWS RDS
        db_user = os.getenv("AWS_RDS_RESOURCE_USER")
        db_password = os.getenv("AWS_RDS_RESOURCE_PASSWORD")
        db_host = os.getenv("AWS_RDS_RESOURCE_HOST")
        db_port = os.getenv("AWS_RDS_RESOURCE_PORT")
        db_name = os.getenv("AWS_RDS_RESOURCE_NAME")

        # create the URL string
        url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

        # create the SQLAlchemy engine
        engine = create_engine(url)

        # Create a Session class
        Session = sessionmaker(bind=engine)
        # Create the actual session
        self.rds = Session()

