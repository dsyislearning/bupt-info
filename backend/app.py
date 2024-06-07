from flask import Flask, jsonify, request
from logic import search

app = Flask(__name__)


@app.route("/", methods=["GET"])
@app.route("/index", methods=["GET"])
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/search", methods=["POST"])
def search_controller():
    query = request.get_json()["query"]
    result = search(query)
    return jsonify(result)