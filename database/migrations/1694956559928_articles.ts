import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "articles";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("code").unique().notNullable();
      table.string("name");
      table.string("marque");
      table.string("stock_alerte");
      table.string("stock_securite");
      table.boolean("is_alert").defaultTo(true);
      table.boolean("is_active").defaultTo(true);
      table.integer("qte").notNullable().defaultTo(0);
      table.integer("qte_before").notNullable().defaultTo(0);
      table.integer('user_create')
      table.integer('user_delete')
      table
        .integer("category_id")
        .unsigned()
        .references("categories.id")
        .onDelete("CASCADE");

      table
        .integer("magasin_id")
        .unsigned()
        .references("magasins.id")
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
