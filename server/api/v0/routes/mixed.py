from flask import Blueprint, request
from ..services.get_aws import SasAws
from ..utils import response

mixed_api = Blueprint('mixed_api', __name__)
sas_aws = SasAws()

@mixed_api.route("/imagepresigned/<imageId>")
def imagePresignedUrl(imageId):
    """
    Get Pre-signed URL to view (GET method) / upload (POST method) image to S3
    """
    if request.method == "GET":
        # print('[imagePresignedUrl] GET: ', imageId)
        url = sas_aws.s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": sas_aws.S3_BUCKET, "Key": f"profile-images/{imageId}"},
            ExpiresIn=3600,
        )
        if url is not None:
            return {"presignedUrl": url}

    elif request.method == "POST":
        url = sas_aws.s3.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": sas_aws.S3_BUCKET,
                "Key": f"profile-images/{imageId}",
                "ContentType": "image/jpeg",
            },
            ExpiresIn=3600,
        )
        # print('[imagePresignedUrl POST] ', url)
        if url is not None:
            return {"presignedUrl": url}

    return response.error_json_response()