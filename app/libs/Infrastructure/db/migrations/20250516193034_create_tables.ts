import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

  //This table holds the data for fleet group that are allowed to register with the system
  // it will be used by a lambda function to populate the passwd_file in the mosquitto broker upon need to add more vehicles in the system
  // it then allows the vehicle to connect to the broker if it belongs to a certain fleet sub group (say by zone eg: fleet group 1 belongs to zone foo or OEM bar or customer baz) and then register with the system after that
  // this is a temporary solution until we have a better way to handle vehicle registration at scale especially with tls

  //another way to handle this is from the front end, the system adming can create a fleet group and then trigger a passwd_file update accordingly in the broker
  await knex.schema.createTable("fleet", (table) => {
    table.uuid("id").primary();
    table.string("hashed_password").notNullable();
    table.string("fleet_description").notNullable();
    table.string("fleet_name").notNullable();
    table.string("fleet_status").notNullable();
    table.bigInteger("created_at").notNullable();
    table.bigInteger("updated_at").notNullable();
  });

  await knex.schema.createTable("vehicle", (table) => {
    table.uuid("id").primary();
    table
      .uuid("fleet_id")
      .notNullable()
      .references("id")
      .inTable("fleet")
      .onDelete("SET NULL");
    table.string("vin").notNullable().unique();
    table.string("oem").notNullable();
    table.string("model").notNullable();
    table.string("vehicle_year").notNullable();
    table.string("vehicle_type").notNullable();
    table.string("vehicle_status").notNullable();
    table.string("vehicle_client_id").notNullable();
    table.bigInteger("created_at");
    table.bigInteger("updated_at");
    table.bigInteger("deleted_at").nullable();
    table.boolean("is_deleted").defaultTo(false);
  });
  await knex.schema.createTable("telemetry", (table) => {
    table.uuid("id").primary();
    table
      .uuid("vehicle_id")
      .notNullable()
      .references("id")
      .inTable("vehicle")
      .onDelete("CASCADE");
    table.string("telemetry_type").notNullable();
    table.string("telemetry_value").notNullable();
    table.bigInteger("telemetry_timestamp").notNullable();
    table.bigInteger("created_at");
    table.bigInteger("updated_at");
    table.bigInteger("deleted_at").nullable();
    table.boolean("is_deleted").defaultTo(false);
  });

  await knex.schema.createTable("mission", (table) => {
    table.uuid("id").primary();
    table.string("mission_name").notNullable();
    table.string("mission_description").notNullable();
    table.string("mission_status").notNullable();
    table.string("mission_type").notNullable();
    table
      .uuid("mission_vehicle_id")
      .notNullable()
      .references("id")
      .inTable("vehicle")
      .onDelete("CASCADE");
    table.string("mission_start_time").notNullable();
    table.string("mission_end_time").notNullable();
    table.string("mission_start_location").notNullable();
    table.bigInteger("created_at").notNullable();
    table.bigInteger("updated_at").notNullable();
  });

}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("vehicle");
  await knex.schema.dropTableIfExists("telemetry");
  await knex.schema.dropTableIfExists("mission");
}
