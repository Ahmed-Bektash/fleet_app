export enum E_QOS {
    AT_MOST_ONCE = 0,
    AT_LEAST_ONCE = 1,
    EXACTLY_ONCE = 2,
}

export enum E_TOPICS {
    VEHICLE_REGISTER = "/vehicle/register",
    TELEMETRY = "/telemetry",
    VEHICLE_AUTH_RESPONSE = "/vehicle/auth/response",
}
