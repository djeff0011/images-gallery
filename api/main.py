# save this as app.py
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello, World!"

# This is how you run the flask application within the module. (A module is any .py file)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050) # using the .run method of the app you can run the flask server