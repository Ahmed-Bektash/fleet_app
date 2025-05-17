import { Vehicle } from "../../shared/types/entities/vehicle";
import { Result } from "../../shared/types/generalTypes";

export interface IRegisterVehicle {
  topic: string;
  message: {
    clientId: string;
    vin: string;
    fleetId: string;
    vehicleType: string;
    oem: string;
    model: string;
    year: string;
  };
}

export interface IUpdateVehicle {
  id: string;
  data: Partial<Vehicle>;
  token: string;
}

export interface IVehicleDataHandler {
  registerVehicle: (
    clientId: string,
    fleetId: string,
    vin: string,
    vehicleType: string,
    vehicleOem: string,
    vehicleModel: string,
    vehicleYear: string
  ) => Promise<Result<string>>;
  getVehicleByVin(vin: string): Promise<Result<Vehicle>>;
  getVehicleById(vin: string): Promise<Result<Vehicle>>;
  updateVehicleData(
    id: string,
    data: Partial<Vehicle>
  ): Promise<Result<Vehicle>>;
}
