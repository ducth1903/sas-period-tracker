from django.http.response import JsonResponse
import firebase_admin
from firebase_admin import auth, credentials
import json
import boto3
from boto3.dynamodb.conditions import Key
import os
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

# Mobile app does not need CSRF. CSRF only needs for Web
from django.views.decorators.csrf import csrf_exempt
# from Crypto.Cipher import AES

firebaseConfig = {
    "apiKey":               os.environ.get("FIREBASE_API_KEY"),
    "authDomain":           os.environ.get("FIREBASE_AUTH_DOMAIN"),
    "databaseURL":          "",
    "projectId":            os.environ.get("FIREBASE_PROJECT_ID"),
    "storageBucket":        os.environ.get("FIREBASE_STORAGE_BUCKET"),
    "messagingSenderId":    os.environ.get("FIREBASE_MESSAGING_SENDER_ID"),
}
cred = credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))
if not firebase_admin._apps:
    # To avoid initializing more than once
    firebase_admin.initialize_app(cred)

# AWS DynamoDB
dynamodb    = boto3.resource('dynamodb', region_name='us-east-1')
userTable   = dynamodb.Table('SasPeriodTrackerUserTable')
periodTable = dynamodb.Table('SasPeriodTrackerPeriodTable')

# AWS S3
s3          = boto3.client('s3', region_name='us-east-1')
S3_BUCKET   = 's3-sas-period-tracker'
# S3_PROFILE_IMAGE_PATH = 'https://sas-period-tracker.s3.amazonaws.com/profile-images/'

# Period page to fetch for GET method
NUM_MONTHS_TO_FETCH = 1

@csrf_exempt
def user(request, userId=None):
    if request.method == 'GET':
        resp = userTable.get_item(Key={'userId': userId})
        print('[user][GET] response =', resp)
        if 'Item' in resp or resp['HTTPStatusCode']==200:
            # valid user
            # return JsonResponse({
            #     "userId"    : resp['Item']["userId"],
            #     "email"     : resp['Item']["email"],
            #     "firstName" : resp['Item']["firstName"],
            #     "lastName"  : resp['Item']["lastName"],
            #     "dob"       : resp['Item']["dob"],
            #     ""
            # }, safe=False)
            return JsonResponse(resp['Item'], safe=False)
        else:
            # user is not in User table
            return __error_json_response(userId)
        
    elif request.method == 'POST':
        # cipher = AES.new('secret key 123', AES.MODE_EAX, nonce=nonce)
        # plaintext = cipher.decrypt(ciphertext)
        # print(f.decrypt(received_json_data['encryptedPassword']))

        data = request.body.decode('utf-8') 
        received_json_data = json.loads(data)
        print('[user][POST] received_json_data = ', received_json_data)
        # email       = request.POST.get('email')
    
        try:
            # creating a user with the given email and password
            # user = firebase_auth.create_user_with_email_and_password(email, passs)
            # uid = user['localId']

            # user_obj = {
            #     "userId"    : uid,
            #     "email"     : email,
            #     "name"      : name,
            #     "DoB"       : dob
            # }
            user_obj = received_json_data
            # If successfully registered with Firebase, add user and id into DynamoDB User table
            userTable.put_item(Item=user_obj)

            return JsonResponse(user_obj["userId"], safe=False)

        except Exception as e:
            return __error_json_response(e)

    elif request.method == 'PUT':
        data = request.body.decode('utf-8') 
        received_json_data = json.loads(data)
        print('[user][PUT] received_json_data = ', received_json_data)

        data2update = dict()
        for k,v in received_json_data.items():
            data2update[k] = {'Value': v}
        try:
            userTable.update_item(
                Key={'userId': userId},
                AttributeUpdates=data2update
            )
            return __ok_json_response()
        except Exception as e:
            return __error_json_response(e)

    elif request.method == 'DELETE':
        # Remove user from all sources:
        # - User table
        # - Period table
        # - S3 profile-images bucket
        # - Firebase: user
        # 
        try:
            userTable.delete_item( Key={'userId': userId} )
            # periodTable.delete_item( Key={'userId': userId} )
            s3.delete_object(
                Bucket=S3_BUCKET,
                Key=f'profile-images/{userId}.jpg'
            )
            auth.delete_user(uid=userId)
            return __ok_json_response()
        except Exception as e:
            return __error_json_response(e)

@csrf_exempt
def period(request, userId=None, inDateStr=None):
    if request.method == 'GET':
        try:
            # resp = periodTable.get_item(Key={'userId': userId, 'timestamp': '2021-07-20T00:00:00.000Z'})
            # start_date = '2021-07-01T00:00:00.000Z'
            # end_date = '2021-07-31T00:00:00.000Z'
            # startEpoch = __convert_dateStr_epoch(start_date)
            # endEpoch   = __convert_dateStr_epoch(end_date)

            inEpoch = __convert_dateStr_epoch(inDateStr)
            startEpoch = inEpoch - NUM_MONTHS_TO_FETCH * (30*24*3600)
            endEpoch   = inEpoch + NUM_MONTHS_TO_FETCH * (30*24*3600)

            resp = periodTable.query(
                KeyConditionExpression=Key('userId').eq(userId) & \
                    Key('timestamp').between(startEpoch, endEpoch)
            )
            # print('[period][GET]', resp)
            if __is_resp_valid(resp):
                return JsonResponse(resp['Items'], safe=False)
        except Exception as e:
            return __error_json_response(e)

    elif request.method == 'POST':
        data = request.body.decode('utf-8') 
        received_json_data = json.loads(data)
        print('[period][POST] received_json_data = ', received_json_data)

        for rec in received_json_data:
            # i.e. rec['date'] = '2021-07-20T00:00:00.000Z'
            # 'T' is jusut a literal to separate the date from the time
            # 'Z' means 'zero hour offset', a.k.a. 'Zulu time' (UTC) 
            period_obj = {
                'userId': userId,
                'timestamp': __convert_dateStr_epoch(rec['date']),
                'dateStr': rec['date'],
                'symptoms': rec['symptomIds']
            }
            print(period_obj)
            periodTable.put_item(Item=period_obj)

        return __ok_json_response()

    elif request.method == 'DELETE':
        try:
            inDateEpoch = __convert_dateStr_epoch(inDateStr)
            periodTable.delete_item( Key={'userId': userId, 'timestamp': inDateEpoch} )
            return __ok_json_response()
        except Exception as e:
            return __error_json_response(e)

@csrf_exempt
def imagePresignedUrl(request, imageId):
    '''
    Get Pre-signed URL to view (GET method) / upload (POST method) image to S3
    '''
    if request.method == 'GET':
        # print('[imagePresignedUrl] GET: ', imageId)
        url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': S3_BUCKET, 'Key': f'profile-images/{imageId}'},
            ExpiresIn=3600
        )
        if url is not None:
            return JsonResponse({'presignedUrl': url}, safe=False)
            
    elif request.method == 'POST':
        url = s3.generate_presigned_url(
            ClientMethod='put_object',
            Params={
                'Bucket': S3_BUCKET, 
                'Key': f'profile-images/{imageId}', 
                'ContentType': 'image/jpeg'
            },
            ExpiresIn=3600
        )
        # print('[imagePresignedUrl POST] ', url)
        if url is not None:
            return JsonResponse({'presignedUrl': url}, safe=False)

    return __error_json_response()

def __convert_dateStr_epoch(dateStr):
    # return int( datetime.strptime(dateStr.split('T')[0], '%Y-%m-%d').timestamp() )
    return int( datetime.strptime(dateStr.strip(), '%Y-%m-%d').timestamp() )

def __is_resp_valid(resp):
    return True if resp['ResponseMetadata']['HTTPStatusCode']==200 else False

def __ok_json_response():
    return JsonResponse({
        'status_code': 200
    })

def __error_json_response(e=''):
    return JsonResponse({
        'status_code': 404,
        'error': f'Resource not found - {e}'
    })
