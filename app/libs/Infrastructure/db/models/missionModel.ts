import { Model } from "objection";
import { E_MissionStatus, Mission } from "../../../shared/types/entities/mission";
import { v4 as uuidv4 } from 'uuid';

export class MissionModel extends Model implements Mission{
    id!:string;
    vehicle_id!:string;
    mission_name!:string;
    mission_type!:string;
    mission_description!:string;
    mission_status!:E_MissionStatus;
    mission_planned_start_time!:number;
    mission_actual_start_time!:number | null;
    mission_end_time!:number | null;
    mission_start_location!:string;
    created_at!:number;
    updated_at!:number;
    
    static get tableName() {
        return "mission";
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