import { E_MissionStatus } from "../../shared/types/entities/mission";
import { E_VehicleStatus } from "../../shared/types/entities/vehicle";
import { Result } from "../../shared/types/generalTypes";

export interface IGetMissionsReport {
    start_time_ms: number;
    end_time_ms: number;
    limit: number;
    offset: number;
}

export interface IReportingDataHandler {
    getMissionsReport(
        start_time_ms: number,
        end_time_ms: number,
        limit: number,
        offset: number
    ): Promise<Result<MissionsReport[]>>;
}

export type MissionsReport = {
    mission_id: string;
    mission_start_time: number;
    mission_end_time: number;
    mission_status: E_MissionStatus;
    vehicle_id: string;
    vehicle_vin: string;
    vehicle_oem: string;
    vehicle_model: string;
    vehicle_type: string;
    vehicle_status: E_VehicleStatus;
}