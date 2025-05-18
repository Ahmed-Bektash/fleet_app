from typing import List, Dict
import time
import random
import string

TELEMETRY_TYPES = {
    "SPEED" : "speed",
    "FUEL_LEVEL" : "fuel_level",
    "ODOMETER" : "odometer",
    "ENGINE_STATUS" : "engine_status",
    "LOCATION" : "location",
    "TEMPERATURE" : "temperature",
    "BATTERY_VOLTAGE" : "battery_voltage",
    "TIRE_PRESSURE" : "tire_pressure",
    "BRAKE_STATUS" : "brake_status",
    "DOOR_STATUS" : "door_status",
    "LIGHT_STATUS" : "light_status",
    "GPS_COORDINATES" : "gps_coordinates",
    "AIRBAG_STATUS" : "airbag_status",
    "ENGINE_TEMPERATURE" : "engine_temperature",
    "TRANSMISSION_STATUS" : "transmission_status",
    "SEAT_BELT_STATUS" : "seat_belt_status",
    "AIR_CONDITIONING_STATUS" : "air_conditioning_status",
    "HEATER_STATUS" : "heater_status",
    "INFOTAINMENT_STATUS" : "infotainment_status",
}
def generate_vehicle_registration_data(number: int,fleet_id:str) -> list:
    """
    Generate vehicle registration data for testing.
    """
    oems = ["bmw", "audi", "mercedes", "toyota", "ford"]
    models = ["x6", "a4", "c-class", "camry", "mustang"]
    years = ["2020", "2021", "2022", "2023", "2024"]
    vehicle_types = ["sedan", "suv", "truck", "crossover", "hatchback"]
    data = {
        "vehicleType": vehicle_types[number % len(vehicle_types)],
        "oem": oems[number % len(oems)],
        "model": models[number % len(models)],
        "year": years[number % len(years)]
    }
    vehicle_registration_data: List[Dict[str, str]] = []
    for i in range(number):
        vehicle_registration_data.append({
            "clientId": f"vehicle-{i}",
            "vin": f"test-vin-{i}",
            "fleetId": fleet_id,
            "vehicleType": data["vehicleType"],
            "oem": data["oem"],
            "model": data["model"],
            "year": data["year"]
        })
    return vehicle_registration_data
    

def generate_telemetry_data(number: int, vehicle_id:str,token:str) -> Dict[str, str | Dict[str,str]]:
    """
    Generate telemetry data for testing.
    """
    entry:Dict[str,str] = {}
    for key in TELEMETRY_TYPES.values():
        entry[key] = ''.join("test_telemetry_value-" + random.choice(string.ascii_letters))
    # Only keep the first i items from entry
    entry = dict(list(entry.items())[:number])

    telemetry_data: Dict[str, str | Dict[str,str]] = {
            "vehicleId": vehicle_id,
            "token": token,
            "timestamp_ms": str(int(time.time() * 1000)),
            "telemetryData": entry
        }
    return telemetry_data