import { VehicleModel } from "../../Infrastructure/db/models/vehicleModel";
import { ObjectionWrapper } from "../../Infrastructure/db/objectionWrapper";
import { E_VehicleStatus, Vehicle } from "../../shared/types/entities/vehicle";
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
    fleetId: string,
    vin: string,
    vehicleType: string,
    vehicleOem: string,
    vehicleModel: string,
    vehicleYear: string
  ): Promise<Result<string>> {
    try {
      // Simulate a successful registration
      const registered_vehicle = await VehicleModel.query().insert({
        vehicle_client_id: clientId,
        fleet_id: fleetId,
        vin: vin,
        vehicle_type: vehicleType,
        oem: vehicleOem,
        model: vehicleModel,
        vehicle_year: vehicleYear,
        vehicle_status: E_VehicleStatus.READY,
        created_at: Date.now(),
        updated_at: Date.now(),
        deleted_at: null,
        is_deleted: false,
      });
      return {
        state: true,
        data: registered_vehicle.id,
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

  async getVehicleByVin(
    vin: string
  ): Promise<Result<Vehicle>> {
    try {
      const vehicle = await VehicleModel.query().findOne({
        vin: vin,
      });
      if (!vehicle) {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.NOT_FOUND,
            message: "Vehicle not found",
            details: "Vehicle not found",
          },
        };
      }
      return {
        state: true,
        data: vehicle,
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

  async updateVehicleData(
    id: string,
    data: Partial<Vehicle>
  ): Promise<Result<Vehicle>> {
    try {
      const updatedVehicle = await VehicleModel.query().updateAndFetchById(id,data);
      if (!updatedVehicle) {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.NOT_FOUND,
            message: "Vehicle not found",
            details: "Vehicle not found",
          },
        };
      }
      return {
        state: true,
        data: updatedVehicle,
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

  async getVehicleById(
    id: string
  ): Promise<Result<Vehicle>> {
    try {
      const vehicle = await VehicleModel.query().findById(id);
      if (!vehicle) {
        return {
          state: false,
          data: null,
          error: {
            code: E_HttpResponseStatus.NOT_FOUND,
            message: "Vehicle not found",
            details: "Vehicle not found",
          },
        };
      }
      return {
        state: true,
        data: vehicle,
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
