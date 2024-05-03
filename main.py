import os
from dotenv import load_dotenv
from pathlib import Path
from flask import Flask, request, send_file, Response
import game.database as database
import game.logic
import game.functions
import json

dotenv_path = Path("./config/.env")
load_dotenv(dotenv_path=dotenv_path)

app = Flask(__name__)

@app.route("/")
def serve_index():
    return send_file("static/index.html")

@app.route("/game/<function_name>")
def endpoint_game(function_name):

    args = dict(request.args) # Save query arguments into dictionary
    global player_list, parcel_list, turn_start_time, turn_end_time

    match function_name: # Choose appropriate function for game phase.
        case "new":
            player_list, parcel_list = game.functions.start_new_game(list(args["players"].split(',')))
            json_body = {"parcels": [vars(parcel) for parcel in parcel_list], "players": [vars(player) for player in player_list]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "parcel_select":
            acting_player_name, selected_indexes_raw = args["player"], args["indexes"]
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            player_used_time = acting_player.time_traveled
            time_over = game.functions.is_time_over(turn_end_time, player_used_time)
            if time_over:
                acting_player.gameover = True
                json_body = {"game_over": True}
                return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

            selected_indexes = [*selected_indexes_raw]
            game.functions.select_parcels_for_player(acting_player, selected_indexes, parcel_list)
            json_body = {"game_over": False}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "player_parcel_list":
            acting_player_name = args["player"]
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            game.functions.calculate_distances(acting_player)

            json_body = {"parcels": [vars(parcel) for parcel in acting_player.parcels_picked]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "parcel_deliver":
            acting_player_name, chosen_parcel_index, chosen_airplane = args["player"], args["index"], args["airplane"]
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            player_used_time = acting_player.time_traveled

            game.functions.deliver_parcel(acting_player, chosen_parcel_index, chosen_airplane)

            game.functions.calculate_distances(acting_player)

            time_over = game.functions.is_time_over(turn_end_time, player_used_time)
            if time_over:
                acting_player.gameover = True
                json_body = {"game_over": True}
                return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

            json_body = {"parcels": [vars(parcel) for parcel in acting_player.parcels_picked]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "highscores":
            highscores_list = game.functions.get_highscores()
            json_body = {"highscores": [vars(player) for player in highscores_list]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "end_game":
            game.functions.calculate_scores(player_list)
            game.functions.add_highscores(player_list)
            json_body = {"players": [vars(player) for player in player_list]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "time":
            time = game.functions.get_time()
            json_body = {"time": time}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "is_time_over":
            acting_player_name = args["player"]
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            player_used_time = acting_player.time_traveled
            time_over = game.functions.is_time_over(turn_end_time, player_used_time)
            json_body = {"is_time_over": time_over}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "time_left":
            acting_player_name = args["player"]
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            player_used_time = acting_player.time_traveled
            time_left = game.functions.time_left(turn_end_time, player_used_time)
            json_body = {"player": acting_player.name, "time_left": time_left, "added_time": acting_player.time_traveled}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "start_new_time":
            time_limit = int(args["seconds"])
            turn_end_time = game.functions.set_end_time(time_limit)
            turn_start_time = game.functions.get_time()
            json_body = {"start_time": turn_start_time,"end_time": turn_end_time, "time_limit": time_limit}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "check_connection":
            connected = game.functions.check_connection()
            json_body = {"connected": connected}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case "game_over":
            acting_player_name = args["player"]
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            acting_player.gameover = True

            json_body = {"player": acting_player.name, "game_over": acting_player.gameover}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json")

        case _:
            return Response(status=404)


if __name__ == "__main__":
    db_error = database.create_database_connection() # Expect: (1)None if OK, (2)ERROR if not OK.
    if db_error:
        print(f"ERROR: DB-CONNECTION, {db_error}")
    else:
        app.run(use_reloader=True, host=os.getenv("FLASK_BIND"), port=os.getenv("FLASK_PORT"))

