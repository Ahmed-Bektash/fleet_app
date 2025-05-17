export type Telemetry = {
    id: string;
    vehicle_id: string;
    telemetry_type: E_TelemetryType;
    telemetry_value: string;
    telemetry_timestamp: number;
    created_at: number;
    updated_at: number;
    deleted_at: number | null;
    is_deleted: boolean;
}

export enum E_TelemetryType {
    SPEED = "speed",
    FUEL_LEVEL = "fuel_level",
    ODOMETER = "odometer",
    ENGINE_STATUS = "engine_status",
    LOCATION = "location",
    TEMPERATURE = "temperature",
    BATTERY_VOLTAGE = "battery_voltage",
    TIRE_PRESSURE = "tire_pressure",
    BRAKE_STATUS = "brake_status",
    DOOR_STATUS = "door_status",
    LIGHT_STATUS = "light_status",
    GPS_COORDINATES = "gps_coordinates",
    AIRBAG_STATUS = "airbag_status",
    ENGINE_TEMPERATURE = "engine_temperature",
    TRANSMISSION_STATUS = "transmission_status",
    SEAT_BELT_STATUS = "seat_belt_status",
    AIR_CONDITIONING_STATUS = "air_conditioning_status",
    HEATER_STATUS = "heater_status",
    INFOTAINMENT_STATUS = "infotainment_status",
}