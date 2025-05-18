import { Mission } from "../../shared/types/entities/mission";
import { Result } from "../../shared/types/generalTypes";

export interface ICreateMission {
  vehicle_id: string;
  mission_name: string;
  mission_type: string;
  mission_description: string;
  mission_start_time: number;
  mission_location: string;
  token: string;
}

export interface IReceiveMissionStatus {
  mission_id: string;
  status: string;
  timestamp: number;
  token: string;
  vehicle_id: string;
  vehicle_details?:{
    [key: string]: string;
  }
}

export interface IMissionDataHandler {
  createMission: (
    data: Omit<
      Mission,
       "created_at" | "updated_at" | "deleted_at" | "is_deleted" | "mission_end_time" | "mission_actual_start_time"
    >
  ) => Promise<Result<string>>;
  getMissionById: (id: string) => Promise<Result<Mission>>;
  updateMission: (
    id: string,
    data: Partial<Mission>
  ) => Promise<Result<string>>;
}
