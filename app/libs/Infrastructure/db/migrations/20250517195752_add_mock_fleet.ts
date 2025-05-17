import type { Knex } from "knex";
import { v4 as uuidv4 } from 'uuid';



export async function up(knex: Knex): Promise<void> {
    await knex('fleet').insert([
        {
            id: uuidv4(),
            hashed_password: "$7$101$o1VmHp7Elc3Aq/UU$o6rIac9HpOeHpxWSbTc2b5lMAombkpaTqxWlpPNjBPyrR8vsDx/OkkiNXY8DQnHHUQa45r4/6HHUjTzbdCdUhQ==",
            fleet_description: "fleet_description 1",
            fleet_name: "fleet_name 1",
            fleet_status: "ACTIVE",
            created_at: Date.now(),
            updated_at: Date.now(),
        },
        {
            id: uuidv4(),
            hashed_password: "$7$101$o1VmHp7Elc3Aq/UU$o6rIac9HpOeHpxWSbTc2b5lMAombkpaTqxWlpPNjBPyrR8vsDx/OkkiNXY8DQnHHUQa45r4/6HHUjTzbdCdUhQ==",
            fleet_description: "fleet_description 2",
            fleet_name: "fleet_name 2",
            fleet_status: "ACTIVE",
            created_at: Date.now(),
            updated_at: Date.now(),
        },
    ]);
}


export async function down(knex: Knex): Promise<void> {
    await knex('fleet').delete()
}

