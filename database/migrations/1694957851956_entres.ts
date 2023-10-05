import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "entres";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("code").unique().notNullable();
      table.string("qte");
      table.string("marque");
      table.dateTime("date");
      table.boolean("is_active").defaultTo(true)

      table
        .integer("fournisseur_id")
        .unsigned()
        .references("fournisseurs.id")
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
