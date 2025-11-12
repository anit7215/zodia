from flask import Flask, Response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return "API 테스트"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)