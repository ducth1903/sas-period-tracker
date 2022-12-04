def error_json_response(e=""):
    return {
        "status_code": 404, 
        "error": f"Resource not found {f' - {e}' if e else ''}"
    }

def ok_json_response():
    return {"status_code": 200}

def is_valid_response(resp):
    return True if resp["ResponseMetadata"]["HTTPStatusCode"] == 200 else False