import { Model } from "objection";
import { E_FleetStatus, Fleet } from "../../../shared/types/entities/fleet";
import { v4 as uuidv4 } from 'uuid';
export class FleetModel extends Model implements Fleet {
  id!: string;
  fleet_name!: string;
  hashed_password!: string;
  fleet_description!: string;
  fleet_status!: E_FleetStatus;
  created_at!: number;
  updated_at!: number;

  static get tableName() {
    return "fleet";
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