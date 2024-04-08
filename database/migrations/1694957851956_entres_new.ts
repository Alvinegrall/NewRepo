import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "entres";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("prix_u")
      table.string("prix_t");
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
