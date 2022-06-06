import os   # Need to import this so we can access the local environment variables. Os used for much more as well
from flask import Flask, request # This request is for the flask app used to get access to the client request that is sent to flask app from other clients
import requests     # This request is from python itself. The one I used to create client requests and send them to another server
from dotenv import load_dotenv # Import this so we can get the local env file we created (.env.local in the api directory)
from flask_cors import CORS  # Cross-Origin Resource Sharing. Needed to access our api being ran on the same ip 127.0.0.1 as our frontend app

load_dotenv(dotenv_path="./.env.local") # Here we set the path to the file it self

UNSPLASH_URL='https://api.unsplash.com/photos/random'
UNSPALSH_KEY=os.environ.get("UNSPLASH_KEY", "")
DEBUG=bool(os.environ.get("DEBUG", True))
# To disable debug mode put this DEBUG="" in the .env.local file within the api folder

# make sure we have api key or raise an error that will stop the program from running till we put the key into the .env.local file 
if not UNSPALSH_KEY:
    raise EnvironmentError("Please create .env.local file and insert the UNSPLASH_KEY there")

app = Flask(__name__)
CORS(app)

#Not good to set debug mode when in production. This in not production but not a good practice to have it here.
app.config["DEBUG"] = DEBUG  # This enables debug mode in out flask app. *** THIS WILL AUTO RESTART OUR APP after every change made in it

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

# This is how you run the flask application within the module. (A module is any .py file)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050) # using the .run method of the app you can run the flask server