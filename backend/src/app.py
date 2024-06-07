from flask import Flask, jsonify, request
from flask_cors import CORS
from logic import search, update_scores

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)


cached_search_result = {
    "query": "",
    "result": []
}


@app.route("/", methods=["GET"])
@app.route("/index", methods=["GET"])
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/search", methods=["POST"])
def search_controller():
    query = request.get_json()["query"]

    result = search(query, cached_search_result) 

    # Update the cached search result
    cached_search_result["query"] = query
    cached_search_result["result"] = result

    return jsonify(result)


@app.route("/rate", methods=["POST"])
def rate_controller():
    data = request.get_json()
    index = data["index"]
    rating = data["rating"]

    update_scores(index, rating, cached_search_result)

    return jsonify({"message": "success"})
