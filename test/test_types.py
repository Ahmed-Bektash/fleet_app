TOPICS = {
    "VEHICLE_REGISTER": "/vehicle/register",
    "VEHICLE_HEALTH": "/vehicle/health",
    "TELEMETRY": "/telemetry",
    "MISSION": "/missions",
    "MISSION_STATUS": "/missions/status",
    "MISSION_CANCEL": "/missions/cancel",
    "VEHICLE_AUTH_RESPONSE": "/vehicle/auth/response"
}
#TODO:  get from env
DB_NAME="fleetdb"
DB_USER="fleetdb"
DB_PASSWORD="fleetdb"
DB_HOST="db" # docker-compose service name
DB_PORT=5432
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "$7$101$2XqvPb0X9ZyNy07v$/Dn0tnZ/yKX2IOVWxarHAc63ipjFw4ga/pRJaTOuQeyXxNPq3obtG60Wno3k+HGEOKVoGmfmquVsrYXycfGowQ=="
BROKER_HOSTNAME = "mosquitto"
PORT = 1883
MQTT_CLIENT_ID = "test_client"