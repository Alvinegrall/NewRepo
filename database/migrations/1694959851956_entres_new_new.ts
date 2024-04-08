import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "entres";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("prix_u").defaultTo(0);
      table.string("prix_t").defaultTo(0);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
