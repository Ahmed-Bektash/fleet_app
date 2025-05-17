export type Vehicle = {
    id: string;
    fleet_id: string;
    vin: string;
    vehicle_type: string;
    oem: string;
    model: string;
    vehicle_year: string;
    vehicle_status: E_VehicleStatus;
    vehicle_client_id: string;
    created_at: number;
    updated_at: number;
    deleted_at: number | null;
    is_deleted: boolean;
}

export enum E_VehicleStatus {
    ACTIVE = 'ACTIVE',
    READY = 'READY',
    BUSY = 'BUSY',
    IN_MAINTENANCE = 'IN_MAINTENANCE',
    UNHEALTHY = 'TEMPORARILY_UNHEALTHY',
    DECOMMISSIONED = 'DECOMMISSIONED',
    INACTIVE = 'INACTIVE',
}