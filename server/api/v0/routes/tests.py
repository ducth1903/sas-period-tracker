from flask import Blueprint
from ..utils import response

tests_api = Blueprint('tests_api', __name__)

@tests_api.get('/tests')
def tests_get():
    return {"message": "Hello from SAS", **response.ok_json_response()}
