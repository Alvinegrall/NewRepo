import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "logs";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name");
      table.integer('user_create')
      table.integer('user_delete')
      table.string("description");
      table.boolean("status");
      table.boolean("is_active").defaultTo(true);
      table.string("source_name");
      table.integer("source_id");

      table
        .integer("cycle_id")
        .unsigned()
        .references("cycles.id")
        .onDelete("CASCADE");

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
