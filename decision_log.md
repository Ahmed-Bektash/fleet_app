# 18.5.25
- The topics are designed as follows
    - /vehicle/register: to handle all registration requests
    - /vehicle/register/response/{vehicle_client_id}: to send back the token to the client with which they can connect to the system afterwards. This is similar to a request response model but it will only be done once at client startup. The JWT is assumed to last 1D after which the client is expected to re-register. The backend knows that the same vin means the same vehicle and will not create a new one but rather update the existing vehicle row
    - /missions: to create all missions, the backend subscribes to that and creates a mission then publishes that mission on the next topic
    - /mission/{vehicle_id}: which each client listens to as they know their respective ids
    - /mission/cancel/{mission_id}: is not implemented but allows the front end dashboard to tell the backend to cancel a specific mission from a control tower.
    - /mission/stats: this allows all vehicles to update the mission stats and the backend will be able to parse it by mission id and update accordingly as they stream in
    - /telemetry: all vehicles can send their telemetry data which would be parsed by the backend if it is authenticated and fulfills the needed interface. it has a qos of 0 because it's fine if some packets drop
    - /vehicle/health: all vehicles can send here their updated statuses which will reflect in the system and the backend can send that to the front end dashboard later through a websocket for live updates for example.
- The Database entites are designed in a heirarchy to reflect their structure: 
    - fleet-->vehicles --> missions & telemetry
    - This allows process flow to be dependable and separation of concerns to be meaningful
    - This allows for joins and reports to be simple

# 15.5.25
- Vehicle Registration and Auth:
There are  multiple ways to handle registration and authentication provided by mosquitto. I can use passwd_files or the dynamic security plugin for example. For the purposes of this task, the passwd file should suffice. The flow of registration is described in the design document attached to this project (.excalidraw file)

Authentication flow works in many ways as well. The previous assumption will not allow us to use ACLs in the project although at scale it would be better especially if it is connected tosome backend with db in the broker but these all require extra build steps using languages like go/rust and i am not sure of the necessity here given the timeline. 

There are 2 ways to authenticate given the previous points: JWT auth in the app or session based auth in the app. I chose JWT based auth with the following assumptions (since i would be building the whole design): 
- JWT would be better for many clients/vehicles and a single app config as we have here 
- The client contains an sdk developed by us to disconnect itself if the auth token is rejected due to timeout or wrong credentials and attempt to re-register again. This effectively means the app will not have to manage client disconnections as it will not be able to block the clients from spamming the broker but it will trust the on-client sdk to handle it accordinly.
- The app itself will not have authentication with the front end, it is implied that this would be necessary but would not be implemented for this task since it was not specifically required. 
A better way:
- To have ACLs on the broker level with a JWT authenticator to quickly invalidate the vehicle request before it makes it to the system, then when it expires, the vehicle can re-login with its refresh token which would be authenticated using the registration record in a cache which would match the DB records. The JWT and cache combination allow vehicles to scale without overloading the system db at run time. I chose the simpler way for this task's timeline while explaining the future design i would make.
# 10.5.25 
- This application is to be an N-tier modular monolith for the backend as a start. Cruicially, it will be broken down into veritcal layers by concern such that they can be separated into services at scale when needed.

    - This means: for one api call --> the request flow for a domain (eg: mission/reports...etc) can be later taken out and deployed separately with little effort and side effect.
    - The app structure is divided into services wrapped by a factory which creates the needed service upon request. This ensures the same contract whether the consumer is mqtt or http. This makes it easy to extend and change any layer without major cost. 
    - each service contains a use case (app layer) and a data handler, the factory when making the service injects the data layer into the app layer and converts any incoming request into the needed internal request for the app layer. This allows the app layer to not depend on any protocol or db as long as the interfaces mandated by the app (the core) is respected. 
        - The api folder contains the routers and is related to the express layer above
        - The libs folder contains the services and is doesn't know anything about the framework
            - The infrastructure folder contains the concrete implementations of the db and mqtt, i.e: the config, models, migrations, adapters...etc
            - The servics folder is subdivided into smaller apps containing all needed files and exposing a factory which can be called by the upper layer which handles the orchestration of modules.
            - the shared folder includes utilities and types which can be shared laterally without dependancy.
    - Test app:
        - The test app has an entry point that is the testapp.py file and calls the needed tests from each file named by its service name. 
        - There are 2 data files, one that generates sample data and one that contains examples
        - by default the test app will run all tests and print their results to the console.


- I will be using Node js for the main backend written in typescript, python for the test env (and react for the front end if the time allows)

- An SQL DB was selected for auth/registration, assignments, mission status and health as it these data points are relational and there is a need for high consistency given the real time nature of the data.
    - At scale this will likely not be sufficient so another system design (at scale) is provided in the design file to showcase when there is a need to handle these large data sets such as splitting up data sources and creating a special timeseries db for telemetry data or a nosql db as needed.

- assumption: no users are created in the system with roles for example, to create a mission or assign it to a vehicle. for the purposes of this task, anyone can do that
- assumption: Where possible, I implemented the needed utility but i left out the non related items that would consume more time from the task allocated time already because i favored submission over perfection at this level. That meansthings like a special error handler, api handler and logger were not implemented. Error handling and logging are still maintained but they can be better managed by special handler classes.