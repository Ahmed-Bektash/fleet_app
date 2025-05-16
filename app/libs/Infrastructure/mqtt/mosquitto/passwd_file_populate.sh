# !/bin/bash
# This script is used to create a password file for the Mosquitto MQTT broker
# Usage: ./passwd_file_populate.sh <username> <password>
# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <password>"
    exit 1
fi
# Assign the arguments to variables
USERNAME=$1
PASSWORD=$2

# exec inside the container
docker exec -it -u 1883 mos1 sh

# Check if the Mosquitto password file exists
if [ ! -f /mosquitto/passwd_file ]; then
    # Create the password file if it doesn't exist
    touch /mosquitto/passwd_file
fi
# Add the username and password to the password file
mosquitto_passwd -c /mosquitto/passwd_file $USERNAME $PASSWORD
# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Password file updated successfully."
else
    echo "Failed to update the password file."
    exit 1
fi