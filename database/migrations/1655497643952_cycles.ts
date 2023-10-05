import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "cycles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.date("date_debut").notNullable();
      table.date("date_fin").notNullable();
      table.string("code").notNullable();
      table.boolean("is_default").defaultTo(true);
      table.boolean("is_active").defaultTo(true);
      table.boolean("is_archive").defaultTo(false);
      table.boolean("is_passed").defaultTo(false);
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
