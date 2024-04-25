from flask import Flask, send_file
import game.database as database
import game.logic as game


app = Flask(__name__)

@app.route("/")
def serve_index():
    return send_file("static/index.html")

if __name__ == "__main__":
    db_error = database.create_database_connection() # Expect: (1)None if OK, (2)ERROR if not OK.
    if db_error:
        print(f"ERROR: DB-CONNECTION, {db_error}")
    else:
        app.run(use_reloader=True, host="127.0.0.1", port=3333)

