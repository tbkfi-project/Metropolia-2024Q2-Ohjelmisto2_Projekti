import os
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask, request, send_file
import game.database as database
import game.logic as game

dotenv_path = Path("./config/.env")
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

@app.route("/")
def serve_index():
    return send_file("static/index.html")

@app.route("/game/<function_name>")
def endpoint_game(function_name):

    args = dict(request.args) # Save query arguments into dictionary

    match function_name: # Choose appropriate function for game phase.
        case "new":
            print("uli")

        case "parcel_select":
            print("uli")

        case "parcel_deliver":
            print("uli")

        case "parcel_result":
            print("uli")

        case _:
            print("some default behaviour (else)")


if __name__ == "__main__":
    db_error = database.create_database_connection() # Expect: (1)None if OK, (2)ERROR if not OK.
    if db_error:
        print(f"ERROR: DB-CONNECTION, {db_error}")
    else:
        app.run(use_reloader=True, host=os.getenv("FLASK_BIND"), port=os.getenv("FLASK_PORT"))

