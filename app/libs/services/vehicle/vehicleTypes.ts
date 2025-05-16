import { Result } from "../../shared/types/generalTypes";

export interface IRegisterVehicle{
    topic: string;
    message: Buffer<ArrayBufferLike>;
}

export interface IAuthVehicle{
    vehicleToken : string
}

export interface IVehicleDataHandler {
    registerVehicle: (
        clientId: string,
        vin: string,
        vehicleType: string,
        vehicleOem: string,
        vehicleModel: string,
        vehicleYear: string,
    ) => Promise<Result<string>>;
    authVehicle: (vehicleToken: string) => Promise<Result>;
}

export const REGISTRATION_MESSAGE_LENGTH = 6;
export const AUTH_MESSAGE_LENGTH = 2;


export const VEHICLE_REGISTRATION_BODY_ORDER = {
    clientId: 0,
    vin: 1,
    vehicleType: 2,
    oem: 3,
    model: 4,
    year: 5,
}
