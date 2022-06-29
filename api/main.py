import os   # Need to import this so we can access the local environment variables.
# This request used to get access to the client request
from flask import Flask, request
# This one I used to create client requests and send them to another server
import requests
# To access the local env file we created (.env.local in the api directory)  
from dotenv import load_dotenv
# Cross-Origin Resource Sharing. Needed to access our api
# being ran on the same ip 127.0.0.1 as our frontend app
from flask_cors import CORS


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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)  # using the .run runs the flask server
