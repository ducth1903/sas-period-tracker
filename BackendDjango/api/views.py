from django.http.response import JsonResponse
import firebase_admin
from firebase_admin import auth, credentials
import json
import boto3
import os
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

@csrf_exempt
def getUser(request, userId=None):
    if request.method == 'GET':
        resp = userTable.get_item(Key={'userId': userId})
        print('[getUser][GET] response =', resp)
        if 'Item' in resp:
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
            return __error_json_response()
        
    elif request.method == 'POST':
        # cipher = AES.new('secret key 123', AES.MODE_EAX, nonce=nonce)
        # plaintext = cipher.decrypt(ciphertext)
        # print(f.decrypt(received_json_data['encryptedPassword']))

        data = request.body.decode('utf-8') 
        received_json_data = json.loads(data)
        print('[getUser][POST] received_json_data = ', received_json_data)
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
            print('Error: ', e)
            return __error_json_response(e)

    elif request.method == 'PUT':
        data = request.body.decode('utf-8') 
        received_json_data = json.loads(data)
        print('[getUser][PUT] received_json_data = ', received_json_data)

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
            print('Error: ', e)
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
            print('Error: ', e)
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

def __ok_json_response():
    return JsonResponse({
        'status_code': 200
    })

def __error_json_response(e=''):
    return JsonResponse({
        'status_code': 404,
        'error': f'Resource not found - {e}'
    })
