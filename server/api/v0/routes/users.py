import json
from flask import Blueprint, request, url_for, current_app
from dotenv import load_dotenv

from ..services.get_aws import SasAws
from ..services.get_firebase import SasFirebase
from ..utils import response, conversion

users_api = Blueprint('users_api', __name__)
sas_aws = SasAws()
sas_firebase = SasFirebase()

load_dotenv()

@users_api.get('/users/<userid>')
def users_get(userid):
    resp = sas_aws.userTable.get_item(Key={"userId": userid})
    current_app.logger.info(f"[GET] response: {resp}")
    if response.is_valid_response(resp):
        # valid user
        return resp.get("Item", response.ok_json_response())
    else:
        # user is not in User table
        return response.error_json_response(userid)

@users_api.post('/users/<userid>')
def users_post():
    # cipher = AES.new('secret key 123', AES.MODE_EAX, nonce=nonce)
    # plaintext = cipher.decrypt(ciphertext)
    # print(f.decrypt(received_json_data['encryptedPassword']))

    data = request.data.decode("utf-8")
    user_obj = json.loads(data)
    current_app.logger.info("[POST] received data: ", user_obj)
    try:
        sas_aws.userTable.put_item(Item=user_obj)
        return user_obj["userId"]
    except Exception as e:
        return response.error_json_response(e)

@users_api.put('/users/<userid>')
def users_put(userid):
    data = request.data.decode("utf-8")
    received_json_data = json.loads(data)
    current_app.logger.info("[PUT] received data: ", received_json_data)

    data2update = dict()
    for k, v in received_json_data.items():
        data2update[k] = {"Value": v}
    try:
        sas_aws.userTable.update_item(Key={"userId": userid}, AttributeUpdates=data2update)
        return response.ok_json_response()
    except Exception as e:
        return response.error_json_response(e)

@users_api.delete('/users/<userid>')
def users_delete(userid):
    # Remove user from all sources:
    # - User table
    # - Period table
    # - S3 profile-images bucket
    # - Firebase: user
    #
    all_history = url_for('periods', userid=userid, returnRaw=True)
    dateToDelete = [x["dateStr"] for x in all_history]
    try:
        sas_aws.userTable.delete_item(Key={"userId": userid})
        # Must delete with a composite primary key (both the partition key and the sort key)
        for d in dateToDelete:
            sas_aws.periodTable.delete_item(
                Key={"userId": userid, "timestamp": conversion.convert_dateStr_epoch(d)}
            )
        sas_aws.s3.delete_object(Bucket=sas_aws.S3_BUCKET, Key=f"profile-images/{userid}.jpg")
        sas_firebase.auth.delete_user(uid=userid)
        return response.ok_json_response()
    except Exception as e:
        return response.error_json_response(e)
