# from django.http import HttpResponse
from django.http.response import JsonResponse
# from rest_framework.parsers import JSONParser
# from rest_framework import status
import pyrebase
import json
# from django.contrib.auth.models import User
# from BackendDjango.api.serializers import UserSerializer
import boto3

# Mobile app does not need CSRF. CSRF only needs for Web
from django.views.decorators.csrf import csrf_exempt
from Crypto.Cipher import AES

# firebaseConfig = {
#     "apiKey":               "AIzaSyAzCQkl3WGUvD1WDAzSXQBtmsyEy2Ze_Z8",
#     "authDomain":           "sasperiodtracker.firebaseapp.com",
#     "databaseURL":          "",
#     "projectId":            "sasperiodtracker",
#     "storageBucket":        "sasperiodtracker.appspot.com",
#     "messagingSenderId":    "189992039358",
# }
# firebase        = pyrebase.initialize_app(firebaseConfig)
# firebase_auth   = firebase.auth()
# firebase_db     = firebase.database()

# AWS DynamoDB
dynamodb    = boto3.resource('dynamodb')
userTable   = dynamodb.Table('SasPeriodTrackerUserTable')
periodTable = dynamodb.Table('SasPeriodTrackerPeriodTable')

# AWS S3
s3          = boto3.client('s3')
# S3_PROFILE_IMAGE_PATH = 'https://sas-period-tracker.s3.amazonaws.com/profile-images/'

@csrf_exempt
def getUser(request, userId=None):
    if request.method == 'GET':
        print('in GET... uid=', userId)
        resp = userTable.get_item(Key={'userId': userId})
        print('in GET resp = ', resp)
        if 'Item' in resp:
            # valid user
            return JsonResponse({
                "userId"    : resp['Item']["userId"],
                "email"     : resp['Item']["email"],
                "firstName" : resp['Item']["firstName"],
                "lastName"  : resp['Item']["lastName"],
                "dob"       : resp['Item']["dob"]
            }, safe=False)
        else:
            # user is not in User table
            return __error_json_response()
        
    elif request.method == 'POST':
        # cipher = AES.new('secret key 123', AES.MODE_EAX, nonce=nonce)
        # plaintext = cipher.decrypt(ciphertext)
        # print(f.decrypt(received_json_data['encryptedPassword']))

        data = request.body.decode('utf-8') 
        received_json_data = json.loads(data)
        print('in signup(), received_json_data = ', received_json_data)
        # email       = request.POST.get('email')
        # uid         = received_json_data['userId']
        # email       = received_json_data['email']
        # firstName   = received_json_data['firstName']
        # lastName    = received_json_data['lastName']
        # dob         = received_json_data['dob']
        # avgPeriod   = received_json_data['avgPeriod']
    
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

@csrf_exempt
def getImagePresignedUrl(request, imageId):
    
    return

def __error_json_response(e=''):
    return JsonResponse({
        'status_code': 404,
        'error': f'Resource not found - {e}'
    })
