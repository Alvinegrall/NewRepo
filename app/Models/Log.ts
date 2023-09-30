import { DateTime } from "luxon";
import { BaseModel, beforeFetch, column } from "@ioc:Adonis/Lucid/Orm";

export default class Log extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: String;

  @column()
  public description: String;

  @column({ serialize: Boolean })
  public isActive: boolean;

  @column()
  public sourceName: String;

  @column()
  public sourceId: number;

  @column()
  public status: Boolean;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeFetch()
  public static getActive(query: any) {
    query.where("is_active", true);
  }
}
