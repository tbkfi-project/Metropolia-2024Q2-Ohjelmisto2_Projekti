import os
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask, send_file
import game.database as database
import game.logic as game

dotenv_path = Path("./config/.env")
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

@app.route("/")
def serve_index():
    return send_file("static/index.html")

if __name__ == "__main__":
    db_error = database.create_database_connection() # Expect: (1)None if OK, (2)ERROR if not OK.
    if db_error:
        print(f"ERROR: DB-CONNECTION, {db_error}")
    else:
        app.run(use_reloader=True, host=os.getenv("FLASK_BIND"), port=os.getenv("FLASK_PORT"))

