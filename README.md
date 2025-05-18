
# Vehicle-Fleet app

This is the design and implementation of vehicle fleet simulation using MQTT, an SQL database and a nodejs backend.

# The features include:
- Vehicle registration and authentication using mqtt and JWT
- telemetry ingestion
- mission assignment and status tracking.
- vehicle health tracking
- mission details reporting api

# Future implementation
- The app can be easily extended to include a small react front end that assigns the missions and generates the reports. 
- I fully intended to implement that but did not get the chance within the time.

# How to understand the structure best'
- for convenience I have attached an [Excalidraw](https://excalidraw.com/) design which you can import into the website and view
    - The design includes a version that was implemented (right) and a version at scale for the future (left)
![overview of the design](/current_design.png)
- The decision_log.md file includes to the best of my abilities the documentation of the design choices i made thus far. Please feel free to contact me for any design relates questions.
- The apis are exported as a postman collection and saved with the repo. please note: the test/sample_test_data.txt file includes any required test data for all tests
- The mqtt requests can just be tested using a postman mqtt request with the sample data present in the test/sample_test_data.txt file.

# How to run the system
- Docker would be the simplest way to run it, it is entirely developed and intended to be ran through it
    - from the root directory open a terminal and run while having docker running 
    `docker-compose --env-file .env up --build`
- I have attached the env file for ease also, it has no important secrets but it demonstrates the point
- This compose file will run the following services
    - The Mosquitto broker with its configurations and passwd_file as volumes which can be found in the repo under /libs/infrastructure/mqtt
    - The app itself which is a node js app built in typescript with express as the server which will run migrations on the db service
    - a postgresql db which will be the db of choice and will be mounted to a volume for persistent data on the machine. you can connect to it using pg admin with the secrets found in the .env file if you wish to check the data yourself.
    - The test app which is a python script (3.12) that installs and runs the tests
        - vehicle registration
        - telemetry ingestion
        - creating a sample mission
    - you can uncomment any test before running the containers if you wish.