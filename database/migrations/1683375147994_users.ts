import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('number', 180).notNullable().unique();
      table.date('date').notNullable();
      table.string('heure', 180).notNullable();
      table.string('paysO', 180);
      table.string('paysD', 180).notNullable();
      table.string('invest', 180).notNullable();
      table.boolean('reminded').notNullable().defaultTo(false)
      table.timestamp('reminded_at', { useTz: true }).nullable()
      

     

      table.string('timeinvest', 180).notNullable();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
