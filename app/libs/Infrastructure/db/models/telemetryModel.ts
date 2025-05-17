import { Model } from "objection";
import { E_TelemetryType, Telemetry } from "../../../shared/types/entities/telemetry";

export class TelemetryModel extends Model implements Telemetry {
  id!: string;
  vehicle_id!: string;
  telemetry_type!: E_TelemetryType;
  telemetry_value!: string;
  telemetry_timestamp!: number;
  created_at!: number;
  updated_at!: number;
  deleted_at!: number | null;
  is_deleted!: boolean;

  static get tableName() {
    return "telemetry";
  }

  static get idColumn() {
    return "id";
  }

  override $beforeInsert() {
    this.id = crypto.randomUUID();
    this.created_at = Date.now();
  }

  override $beforeUpdate() {
    this.updated_at = Date.now();
  }
}
