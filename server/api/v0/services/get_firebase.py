import firebase_admin
from firebase_admin import credentials
import os
from dotenv import load_dotenv

load_dotenv()

class SasFirebase:
    def __init__(self):
        self.firebaseConfig = {
            "apiKey": os.environ.get("FIREBASE_API_KEY"),
            "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN"),
            "databaseURL": "",
            "projectId": os.environ.get("FIREBASE_PROJECT_ID"),
            "storageBucket": os.environ.get("FIREBASE_STORAGE_BUCKET"),
            "messagingSenderId": os.environ.get("FIREBASE_MESSAGING_SENDER_ID"),
        }
        cred = credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"))

        if not firebase_admin._apps:
            # To avoid initializing more than once
            firebase_admin.initialize_app(cred)