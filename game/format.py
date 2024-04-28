# Parcel object
class Parcel:
    def __init__(self, item, co2_item, heft, info, destination_airport, destination_country, location):
        self.item = item
        self.co2_item = co2_item
        self.heft = heft
        self.info = info
        self.destination_airport = destination_airport
        self.destination_country = destination_country
        self.location = location
        self.delivered = False


# Player object
class Player:
    def __init__(self, name):
        self.name = name
        self.score = 0
        self.location = [60.3172, 24.963301]
        self.parcels_picked = []
        self.gameover = False
        self.distance_traveled = 0
        self.time_traveled = 0
        self.co2_produced = 0

    def add_parcel(self, parcel):
        self.parcels_picked.append(parcel)


class HighscoreValue:
    def __init__(self,gameID,name,score):
        self.gameID = gameID
        self.name = name
        self.score = score

# Item heft classes
heft_classes = {1:(0.1,1), 2:(1,3), 3:(3,10)}


# Transport method speeds (1: km/h, ... rest are multiples of 1)
transport_speed1 = 800
transport_speed2 = 0.50
transport_speed3 = 2.0

transport1_co2 = 0.75
transport2_co2 = 1
transport3_co2 = 2.0

parcel_selection_time_limit = 150
actual_parcel_delivery_time_limit = 80


parcel_delivery_time_limit = 90

