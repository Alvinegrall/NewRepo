import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "sorties";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("code").unique().notNullable();
      table.string("qte").notNullable();
      table.dateTime("date");
      table.integer('user_create')
      table.integer('user_delete')
      table.boolean("is_active").defaultTo(true);

      table
        .integer("beneficiaire_id")
        .unsigned()
        .references("beneficiaires.id")
        .onDelete("CASCADE");

      table
        .integer("cycle_id")
        .unsigned()
        .references("cycles.id")
        .onDelete("CASCADE");

      table
        .integer("article_id")
        .unsigned()
        .references("articles.id")
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
