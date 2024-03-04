import { column, BaseModel, hasMany, HasMany, beforeFetch } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Article from "./Article";

export default class Category extends BaseModel {
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

  // @column()
  // public code: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Article)
  public articles: HasMany<typeof Article>;

  @beforeFetch()
  public static getActive(query: any) {
    query.where("is_active", true);
  }
}
