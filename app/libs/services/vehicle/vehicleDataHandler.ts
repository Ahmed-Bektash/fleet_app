import { ObjectionWrapper } from "../../Infrastructure/db/objectionWrapper";
import { E_HttpResponseStatus, Result } from "../../shared/types/generalTypes";
import { IVehicleDataHandler } from "./vehicleTypes";

export class VehicleDataHandler
  extends ObjectionWrapper
  implements IVehicleDataHandler
{
  private static instance: VehicleDataHandler;

  private constructor() {
    super();
  }

  public static getInstance(): VehicleDataHandler {
    VehicleDataHandler.instance ??= new VehicleDataHandler();
    return VehicleDataHandler.instance;
  }

  async registerVehicle(
   clientId: string,
        vin: string,
        vehicleType: string,
        vehicleOem: string,
        vehicleModel: string,
        vehicleYear: string,
  ): Promise<Result<string>> {
    try {
      // Simulate a successful registration
      return {
        state: true,
        data: `Vehicle ${vin} registered successfully`,
        error: null,
      };
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  }

  async authVehicle(vehicleToken: string): Promise<Result> {
    try {
      // Simulate a successful authentication
      return {
        state: true,
        data: { vehicleToken },
        error: null,
      };
    } catch (error) {
      return {
        state: false,
        data: null,
        error: {
          code: E_HttpResponseStatus.SERVER_ERROR,
          message: "Internal server error",
          details: error.message,
        },
      };
    }
  }
}
