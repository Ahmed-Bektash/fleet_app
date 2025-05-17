export enum E_QOS {
    AT_MOST_ONCE = 0,
    AT_LEAST_ONCE = 1,
    EXACTLY_ONCE = 2,
}

export enum E_TOPICS {
    VEHICLE_REGISTER = "/vehicle/register",
    VEHICLE_HEALTH = "/vehicle/health",
    TELEMETRY = "/telemetry",
    MISSION = "/missions",
    MISSION_STATUS = "/missions/status",
    MISSION_CANCEL = "/missions/cancel",
    VEHICLE_AUTH_RESPONSE = "/vehicle/auth/response",
}
