export type Mission = {
    id:string;
    vehicle_id:string;
    mission_name:string;
    mission_type:string;
    mission_description:string;
    mission_status:E_MissionStatus;
    mission_planned_start_time:number;
    mission_actual_start_time:number | null;
    mission_end_time:number | null;
    mission_start_location:string;
    created_at:number;
    updated_at:number;
}

export enum E_MissionStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}