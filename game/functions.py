from . import format
from . import database
from geopy import distance
import random
import time
import copy


def start_new_game(player_names_list):

    player_list = []
    parcel_list = []

    for player_name in player_names_list:
        player_list.append(format.Player(player_name))

    random_parcels = database.fetch_10_random_parcels_from_db()
    random_airports = database.fetch_10_random_airports_from_db()

    for i in range(len(random_parcels)):
        # Attribute a random weight for the item, based on its heft type.
        random_weight = float(f"{random.uniform(format.heft_classes.get(random_parcels[i][2])[0],format.heft_classes.get(random_parcels[i][2])[1]):.2f}")

        # Combine into single list
        combined_parcel = format.Parcel(
            random_parcels[i][0], random_parcels[i][1],              # item name and CO2
            random_weight, random_parcels[i][3],                   # heft and info
            random_airports[i][0], random_airports[i][1],            # destination airport and country
            [random_airports[i][2], random_airports[i][3]])  # destination location coordinates as a list
        parcel_list.append(combined_parcel)

    return player_list, parcel_list # Return player list and combined list of parcels


def select_parcels_for_player(player, selected_parcel_indexes, parcel_list):
    for parcel_index in selected_parcel_indexes:
        player.parcels_picked.append(copy.deepcopy(parcel_list[int(parcel_index)]))


def calculate_distances(player):
    parcel_list = player.parcels_picked

    for parcel in parcel_list:
        distance_from_player = float(str(calculate_distance(player.location, parcel.location))[:-3])
        parcel.distance_to_player = distance_from_player

def deliver_parcel(player, parcel_index, airplane):
    distance_from_player = float(str(calculate_distance(player.location, player.parcels_picked[int(parcel_index)].location))[:-3])
    player.distance_traveled += distance_from_player

    travel_time = calculate_flight_time(distance_from_player, airplane)
    player.time_traveled += travel_time

    produced_co2 = calculate_flight_CO2(distance_from_player, airplane, player.parcels_picked, player.parcels_picked[int(parcel_index)].co2_item)
    player.co2_produced += produced_co2

    player.parcels_picked[int(parcel_index)].delivered = True
    player.location = player.parcels_picked[int(parcel_index)].location


def calculate_distance(player_location, destination_location):
    distance_from_player = distance.distance(player_location, destination_location)
    return distance_from_player


def calculate_flight_time(distance_from_player, airplane):
    default_flight_time = distance_from_player / format.transport_speed1

    match airplane:
        case "1":
            travel_time = default_flight_time * format.transport_speed3
        case "2":
            travel_time = default_flight_time
        case "3":
            travel_time = default_flight_time * format.transport_speed2

    return travel_time


def calculate_flight_times(player):
    for parcel in player.parcels_picked:
        default_flight_time = parcel.distance_to_player / format.transport_speed1

        parcel.travel_time["cargo_plane"] = default_flight_time * format.transport_speed3
        parcel.travel_time["passenger_plane"] = default_flight_time
        parcel.travel_time["private_jet"] = default_flight_time * format.transport_speed2


def calculate_flight_CO2(distance_from_player, airplane, player_parcels, chosen_parcel_co2):
    match airplane:
        case "1":
            CO2_multiplier = format.transport1_co2
        case "2":
            CO2_multiplier = format.transport2_co2
        case "3":
            CO2_multiplier = format.transport3_co2

    total_weight = 0
    for parcel in player_parcels:
        if not parcel.delivered:
            total_weight += parcel.heft

    delivery_CO2 = distance_from_player * 0.36 * total_weight * CO2_multiplier
    CO2_full = delivery_CO2 + chosen_parcel_co2

    return CO2_full


def get_highscores():
    highscores_list = database.fetch_player_highscores_from_db(10)
    return highscores_list


def calculate_scores(player_list):
    for player in player_list:
        player.parcels_picked = []
        if player.co2_produced != 0:
            score = int(((1 / player.co2_produced) * 1000000) * 1000)
        else:
            score = 0
        if not player.gameover:
            player.score = score


def add_highscores(player_list):
    database.insert_new_player_scores_in_to_db(player_list)


def get_time():
    return time.time()


def is_time_over(end_time, added_time):
    if get_time() + added_time < end_time:
        return False
    return True


def time_left(end_time, added_time):
    how_much_time_left = end_time - get_time() + added_time
    return how_much_time_left


def set_end_time(time_limit):
    endtime = get_time() + time_limit
    return endtime


def check_connection():
    connected = database.connection_check()
    return connected