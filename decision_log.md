
# 15.5.25
- The password file is assumed to be inserted by the deployment mechanism and copied from a secret manager which contains the admin user representing the system itself with its hash password
# 10.5.25 
- This application is to be an N-tier monolith for the backend as a start. Cruicially, it will be broken down into veritcal layers by concern such that they can be separated into separate services at scale when needed.

- -  This means: for one api call --> the request flow for a domain (eg: telemetry/mission/auth...etc) can be later taken out and deployed separately with little effort and side effect.

- I will be using Node js for the main backend, python for the test env and react for the front end.

- An SQL DB was selected for auth/registration, assignments, mission status and health as it these data points are relational and there is a need for high consistency given the real time nature of the data.
- - at scale this will not be sufficient so another system design (at scale) is provided to showcase when there is a need to handle these large data sets such as splitting up data sources and creating a special timeseries db for telemetry data.

- assumption: no users are created in the system with roles for example, to create a mission or assign it to a vehicle. for the purposes of this task, anyone can do that