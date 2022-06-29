import os
from pymongo import MongoClient
# To access the local env file we created (.env.local in the api directory)  
from dotenv import load_dotenv

load_dotenv(dotenv_path="./.env.local")  # Here we set the path to the file it self

# Creating out environment variables that we will pull from the .env.local file
MONGO_URL = os.environ.get("MONGO_URL", "mongo")
MONGO_USERNAME = os.environ.get("MONGO_USERNAME", "root")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD", "")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)

# Here is an instance of the mongo client class that we create.
mongo_client = MongoClient(
  host=MONGO_URL,
  username=MONGO_USERNAME,
  password=MONGO_PASSWORD,
  port=MONGO_PORT,
)


def insert_test_document():
    """Inserts sample document to the test_collection in the test db"""
    db = mongo_client.test
    test_collection = db.test_collection
    res = test_collection.insert_one({"name": "Donahue", "student": True})
    print(res)
