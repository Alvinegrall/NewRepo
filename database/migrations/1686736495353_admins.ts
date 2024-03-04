import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import Roles from "App/Enums/Roles";

export default class extends BaseSchema {
  protected tableName = "admins";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name");
      table.string("phone").notNullable();
      table.enum("role", [Roles.ADMIN, Roles.USER]).defaultTo(Roles.USER);
      table.string("email", 255).notNullable().unique();
      table.string("password", 180).notNullable();
      table.string("remember_me_token").nullable();
      table.integer("user_create");
      table.integer("user_delete");
      table.boolean("is_active").defaultTo(true);
      table.boolean("is_delete").defaultTo(false);

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true }).notNullable();
      table.timestamp("updated_at", { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
