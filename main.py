from flask import Flask, Response, send_file
import game.database as database
import game.logic as game


app = Flask(__name__)

@app.route("/")
def serve_web():
    return send_file("webroot/index.html")

if __name__ == "__main__":
    try:
        database.create_database_connection()
        app.run(use_reloader=True, host="127.0.0.1", port=3333)
    except Exception as error:
        print(f"Something went wrong: {error}")

