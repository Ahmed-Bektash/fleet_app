export type Vehicle = {
    id: string;
    fleet_id: string;
    vin: string;
    vehicle_type: string;
    oem: string;
    model: string;
    vehicle_year: string;
    vehicle_status: E_VehicleStatus;
    Vehicle_client_Id: string;
    created_at: number;
    updated_at: number;
    deleted_at: number | null;
    is_deleted: boolean;
}

export enum E_VehicleStatus {
    ACTIVE = 'ACTIVE',
    READY = 'READY',
    BUSY = 'BUSY',
    INACTIVE = 'INACTIVE',
}