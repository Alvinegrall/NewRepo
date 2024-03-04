import { DateTime } from "luxon";
import { BaseModel, beforeFetch, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Entre from "./Entre";

export default class Fournisseur extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public userCreate: number;

  @column()
  public userDelete: number;

  @column({ serialize: Boolean })
  public isActive: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  // @hasMany(() => Article)
  // public articles: HasMany<typeof Article>;

  @hasMany(() => Entre)
  public entre: HasMany<typeof Entre>;

  @beforeFetch()
  public static getActive(query: any) {
    query.where("is_active", true);
  }
}
