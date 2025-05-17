import * as jsonwebtoken from "jsonwebtoken";
import { E_HttpResponseStatus, Result } from "../types/generalTypes";
import { E_QOS, E_TOPICS } from "../types/businessTypes";
import { E_VehicleStatus } from "../types/entities/vehicle";
import { IVehicleDataHandler } from "../../services/vehicle/vehicleTypes";
import { IMqttClient } from "../../Infrastructure/mqtt/mqttTypes";
export async function authVehicle(
  token_input: string,
  vehicleId: string,
  dataHandler: IVehicleDataHandler,
  messageClient: IMqttClient
): Promise<Result> {
  let result: Result = {
    state: true,
    data: null,
    error: null,
  };
  //authenticate the message
  const token = token_input.split(" ")[1];
  let decoded: { vehicleId: string };
  try {
    decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET) as {
      vehicleId: string;
    };
  } catch (error) {
    result = {
      state: false,
      data: null,
      error: {
        code: E_HttpResponseStatus.UNAUTHORIZED,
        message: "Unauthorized",
        details: "Invalid token: " + error.message,
      },
    };
    //publish the message to the mqtt broker
    const publishTopic = `${E_TOPICS.VEHICLE_AUTH_RESPONSE}/${vehicleId}`;
    const publishResult = await messageClient.publish(publishTopic, token, {
      qos: E_QOS.AT_LEAST_ONCE,
    });
    if (!publishResult) {
      throw new Error("Failed to publish unauthorized message to MQTT broker");
    }
  }
  // check if vehicle is already registered and authenticated
  const vehicle = await dataHandler.getVehicleById(decoded.vehicleId);
  if (
    vehicle.data?.vehicle_status === E_VehicleStatus.INACTIVE ||
    vehicle.data?.vehicle_status === E_VehicleStatus.UNHEALTHY ||
    vehicle.data?.vehicle_status === E_VehicleStatus.DECOMMISSIONED
  ) {
    result = {
      state: false,
      data: null,
      error: {
        code: E_HttpResponseStatus.UNAUTHORIZED,
        message: "Unauthorized",
        details: "Invalid vehicle",
      },
    };
  }
  return result;
}
