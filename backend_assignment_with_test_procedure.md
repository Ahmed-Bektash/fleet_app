
# Backend Developer Assignment

## Overview

You are tasked with implementing a backend system that communicates with autonomous vehicles using MQTT.
The backend should manage vehicle registration, telemetry ingestion, mission assignment, and status tracking.

---

## Objectives

- Implement secure MQTT communication
- Process and store vehicle data in a database
- Expose APIs for mission and vehicle handling
- Ensure end-to-end data flow integrity and authentication
- Define topic and message structure / format to be used in MQTT. explain why you choose such format. 

---

## Task Requirements

### 1. MQTT Broker Integration
- Set up an MQTT broker with authentication.
- Configure it to receive data from vehicles.
- Implement vehicle registration and authentication using MQTT.

### 2. Database Integration
- Use a database to store telemetry, vehicle status, and mission status.
- Ensure structured schema and timestamped entries.

### 3. Vehicle Handling
- Implement vehicle registration flow via MQTT.
- Validate and authenticate each incoming vehicle using registration records.

### 4. Telemetry and Status
- Process telemetry and status data received via MQTT.
- Persist the data with relevant timestamps into the database.

### 5. Mission Handling
- Implement a REST API to accept mission requests from a frontend.
- Send mission instructions to the vehicle via MQTT.
- Implement another API or handler to receive mission response from the vehicle.
- Update the mission status accordingly in the database.

### 6. MQTT Controllers
Create separate MQTT topic handlers for:
- Vehicle telemetry data
- Vehicle health/status data
- Vehicle mission data

### 7. Reporting
- Implement a REST API to generate a report in JSON format.
- The report should include mission requests and the vehicles assigned to each.

---

## Test Procedure

### 1. Vehicle Telemetry Data Flow via MQTT
- Simulate sending vehicle telemetry data using a Python script over MQTT.
- Backend must:
  - Authenticate the vehicle (ensure it is registered).
  - Reject or ignore data from unregistered or unauthenticated vehicles.
  - Process and store telemetry data in the time-series database.

**Expected Results:**
- Telemetry data from a registered vehicle is saved in the database.
- Unauthorized data is properly handled.

---

### 2. Mission Request via Postman
- Use Postman to simulate a mission request.
- Backend must:
  - Accept and log the mission request.
  - Forward the mission to the vehicle via MQTT.
  - Handle the vehicle’s mission response over MQTT.

**Expected Results:**
- Mission appears in the database with initial and updated statuses.

---

### 3. Mission Response Handling
- Simulate mission response via MQTT.
- Backend must:
  - Verify the authenticity of the response.
  - Update the database with the appropriate mission status.

---

### 4. Mission Status Update
- Simulate mission progress updates over MQTT.
- Backend must:
  - Update the mission status in the database with timestamps.

**Expected Results:**
- The database reflects mission progress accurately.

---

## Deliverables

- GitHub repository link
- README with setup instructions and testing guide
