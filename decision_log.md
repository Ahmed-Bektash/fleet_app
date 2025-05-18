
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
- This application is to be an N-tier monolith for the backend as a start. Cruicially, it will be broken down into veritcal layers by concern such that they can be separated into separate services at scale when needed.

- -  This means: for one api call --> the request flow for a domain (eg: telemetry/mission/auth...etc) can be later taken out and deployed separately with little effort and side effect.

- I will be using Node js for the main backend, python for the test env and react for the front end.

- An SQL DB was selected for auth/registration, assignments, mission status and health as it these data points are relational and there is a need for high consistency given the real time nature of the data.
- - at scale this will not be sufficient so another system design (at scale) is provided in the design file to showcase when there is a need to handle these large data sets such as splitting up data sources and creating a special timeseries db for telemetry data.

- assumption: no users are created in the system with roles for example, to create a mission or assign it to a vehicle. for the purposes of this task, anyone can do that