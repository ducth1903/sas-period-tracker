"""
Entrypoint to Flask backend server
"""

import os
from flask import Flask
from api.v0.routes.users import users_api
from api.v0.routes.periods import periods_api
from api.v0.routes.mixed import mixed_api

app = Flask(__name__)
app.register_blueprint(users_api)
app.register_blueprint(periods_api)
app.register_blueprint(mixed_api)

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
