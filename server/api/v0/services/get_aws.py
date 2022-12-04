import boto3
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
