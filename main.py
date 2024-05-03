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
        case "new": # Initializes a new game by creating the parcel and the player lists
            player_list, parcel_list = game.functions.start_new_game(list(args["players"].split(','))) # args: "players" = player names as one string separated by commas
            json_body = {"parcels": [vars(parcel) for parcel in parcel_list], "players": [vars(player) for player in player_list]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "parcels" = all variables of all parcels, "players": = all variables of all players

        case "parcel_select": # Adds the five parcel selected by the player to that players "selected_parcels" list
            acting_player_name, selected_indexes_raw = args["player"], args["indexes"] # args: "player" = current players name, "indexes" = a string of five numbers corresponding to the indexes of the selected parcels
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            player_used_time = acting_player.time_traveled
            time_over = game.functions.is_time_over(turn_end_time, player_used_time)
            if time_over:
                acting_player.gameover = True
                json_body = {"game_over": True}
                return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns "game_over" = true if the players time ran out before the selection

            selected_indexes = [*selected_indexes_raw]
            game.functions.select_parcels_for_player(acting_player, selected_indexes, parcel_list)
            json_body = {"game_over": False}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns "game_over" = false if the player chose the parcels in time

        case "player_parcel_list": # returns the inputted players "selected_parcel" list
            acting_player_name = args["player"] # args: "player" = current players name
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            game.functions.calculate_distances(acting_player)

            json_body = {"parcels": [vars(parcel) for parcel in acting_player.parcels_picked]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "parcels" = all variables of all parcels that the inputted player has chosen

        case "parcel_deliver": # runs all the logic required for the parcel delivery for the inputted player
            acting_player_name, chosen_parcel_index, chosen_airplane = args["player"], args["index"], args["airplane"]  # args: "player" = current players name,
                                                                                                                        #       "index" = index of the chosen parcel in players "selected_parcels" list,
                                                                                                                        #       "airplane" = number corresponding to the chosen airplane (1,2 or 3)
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
                return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "game_over" = true if the players time ran out before the selection

            json_body = {"parcels": [vars(parcel) for parcel in acting_player.parcels_picked]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "parcels" = all variables of all parcels that the inputted player has chosen IF the player chose the parcels in time

        case "highscores": # returns the top 10 players along with their scores from the database
            highscores_list = game.functions.get_highscores()
            json_body = {"highscores": [vars(player) for player in highscores_list]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns_ "highscores" = a list to the names and scores of the top 10 players

        case "end_game": # calculates player scores and adds them to the database
            game.functions.calculate_scores(player_list)
            game.functions.add_highscores(player_list)
            json_body = {"players": [vars(player) for player in player_list]}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "players" = all variables of all players

        case "time": # returns the current unix-time
            time = game.functions.get_time()
            json_body = {"time": time}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "time" = current unix time

        case "is_time_over": # calculates if the current timer has run out
            acting_player_name = args["player"] # args: "player" = current players name
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            player_used_time = acting_player.time_traveled
            time_over = game.functions.is_time_over(turn_end_time, player_used_time)
            json_body = {"is_time_over": time_over}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "is_time_over" = true if the time has run out, false if it hasn't

        case "time_left": # calculates the remaining time of the current running timer
            acting_player_name = args["player"] # args: "player" = current players name
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            player_used_time = acting_player.time_traveled
            time_left = game.functions.time_left(turn_end_time, player_used_time)
            json_body = {"player": acting_player.name, "time_left": time_left, "added_time": acting_player.time_traveled}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "player" = current players name,
                                                                                                     #          "time_left" = time left in seconds
                                                                                                     #          "added_time" = total time the player has used for travel

        case "start_new_time": # starts a new timer in the beginning of the parcel selection and parcel delivery phases
            time_limit = int(args["seconds"]) # args: "seconds" = turn limit time in seconds
            turn_end_time = game.functions.set_end_time(time_limit)
            turn_start_time = game.functions.get_time()
            json_body = {"start_time": turn_start_time,"end_time": turn_end_time, "time_limit": time_limit}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "start_time" = the starting time of the turn in UNIX format
                                                                                                     #          "end_time" = the end time of the turn in UNIX format
                                                                                                     #          "time_limit" = the time limit for the turn in seconds.

        case "check_connection": # checks the connection to the database
            connected = game.functions.check_connection()
            json_body = {"connected": connected}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "connected" = true if the connection to the database was succesful, false if it wasn't

        case "game_over": # sets the inputted players gameover variable as True
            acting_player_name = args["player"] # args: "player" = current players name
            for player in player_list:
                if player.name == acting_player_name:
                    acting_player = player

            acting_player.gameover = True

            json_body = {"player": acting_player.name, "game_over": acting_player.gameover}
            return Response(response=json.dumps(json_body), status=200, mimetype="application/json") # returns: "player" = name of the player whose time run out, "game_over" = true

        case _: # returns the 404-page if inputted anything else than the aforementioned endpoint names
            return Response(status=404)


if __name__ == "__main__":
    db_error = database.create_database_connection() # Expect: (1)None if OK, (2)ERROR if not OK.
    if db_error:
        print(f"ERROR: DB-CONNECTION, {db_error}")
    else:
        app.run(use_reloader=True, host=os.getenv("FLASK_BIND"), port=os.getenv("FLASK_PORT"))

