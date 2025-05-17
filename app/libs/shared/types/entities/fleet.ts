export type Fleet = {
    id: string;
    fleet_name: string;
    hashed_password: string;
    fleet_description: string;
    fleet_status: E_FleetStatus;
    created_at: number;
    updated_at: number;
};

export enum E_FleetStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    DELETED = "DELETED",
}