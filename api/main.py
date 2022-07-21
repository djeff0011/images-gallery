import os   # Need to import this so we can access the local environment variables.
# This request used to get access to the client request
from flask import Flask, request, jsonify
# This one I used to create client requests and send them to another server
import requests
# To access the local env file we created (.env.local in the api directory)
from dotenv import load_dotenv
# Cross-Origin Resource Sharing. Needed to access our api
# being ran on the same ip 127.0.0.1 as our frontend app
from flask_cors import CORS
from mongo_client import mongo_client   # Import from the mongo_client module we created

gallery = mongo_client.gallery          # Create the database gallery in mongo
images_collection = gallery.images      # Create the images collection(table) in gallery


load_dotenv(dotenv_path="./.env.local")  # Here we set the path to the file it self

UNSPLASH_URL = 'https://api.unsplash.com/photos/random'
UNSPALSH_KEY = os.environ.get("UNSPLASH_KEY", "")
# Debug mode here when set to true, flask application monitors changes in the file and
# reload flask app each time when changes are detected.
DEBUG = bool(os.environ.get("DEBUG", True))
# To disable debug mode put this DEBUG="" in the .env.local file within the api folder

# make sure we have api key or raise an error that will stop the program from running
#  till we put the key into the .env.local file
if not UNSPALSH_KEY:
    raise EnvironmentError("Please create .env.local file and insert the UNSPLASH_KEY")

app = Flask(__name__)
CORS(app)

# Not good to set debug mode when in production.
# *** THIS WILL AUTO RESTART OUR APP after every change made in it
app.config["DEBUG"] = DEBUG  # This enables debug mode in out flask app. 


@app.route("/new-image")
def new_image():
    word = request.args.get("query")
    # Create header so we can add it to the requests
    headers = {
        "Accept-Version": "v1",
        "Authorization": "Client-ID " + UNSPALSH_KEY
    }
    params = {"query": word}
    response = requests.get(url=UNSPLASH_URL, headers=headers, params=params)
    data = (response.json())
    return data

# This is how you run the flask application within the module. (A module is any .py)


@app.route("/images", methods=["GET", "POST"])  # Here we add method types in a list
def images():
    if request.method == "GET":
        # read images from the db
        images = images_collection.find({})  # We use {} to return all
        return jsonify([img for img in images])  # Use jsonify to make results a json
    if request.method == "POST":
        # save image in the db
        image = request.get_json()      # can use json.loads(request.data), others too
        # Get the image id that we created and set it to _id so we do not get the
        # Object of type ObjectId is not JSON serializable. This will fix it
        image["_id"] = image.get("id")  # do this before the next line to skip the error
        result = images_collection.insert_one(image)
        inserted_id = result.inserted_id
        return {"inserted_id": inserted_id}  # return dictionary with single key


@app.route("/images/<image_id>", methods=["DELETE"])
def image(image_id):
    if request.method == "DELETE":
        # DELETE IMAGE FROM THE DB
        result = images_collection.delete_one({"_id": image_id})
        # Error handling when not found. Numbers after return statement are error codes
        if not result:
            return {"error": "Image wasn't delted. Please try again"}, 500
        
        if result and not result.deleted_count:
            return {"error": "Image not found"}, 404
        return {"deleted_id": image_id}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)  # using the .run runs the flask server
