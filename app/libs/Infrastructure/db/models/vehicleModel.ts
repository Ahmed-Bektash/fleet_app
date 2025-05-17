import { Model } from "objection";
import {
  E_VehicleStatus,
  Vehicle,
} from "../../../shared/types/entities/vehicle";
import { v4 as uuidv4 } from 'uuid';

export class VehicleModel extends Model implements Vehicle {
  id!: string;
  fleet_id!: string;
  vin!: string;
  oem!: string;
  model!: string;
  vehicle_year!: string;
  vehicle_type!: string;
  vehicle_status!: E_VehicleStatus;
  vehicle_client_id!: string;
  created_at!: number;
  updated_at!: number;
  deleted_at!: number | null;
  is_deleted!: boolean;

  static get tableName() {
    return "vehicle";
  }

  static get idColumn() {
    return "id";
  }

  override $beforeInsert() {
    this.id = uuidv4();
    this.created_at = Date.now();
  }

  override $beforeUpdate() {
    this.updated_at = Date.now();
  }
}
