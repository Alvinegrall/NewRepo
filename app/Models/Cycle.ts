import { DateTime } from "luxon";
import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Entre from "./Entre";
import Sortie from "./Sortie";
import Log from "./Log";

export default class Cycle extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public dateDebut: string;

  @column()
  public dateFin: string;

  @column()
  public code: string;

  @column()
  public isPassed: boolean;

  @column()
  public isDefault: boolean;

  @column()
  public isActive: boolean;

  @column()
  public isArchive: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @hasMany(() => Entre)
  public entres: HasMany<typeof Entre>;

  @hasMany(() => Sortie)
  public sortie: HasMany<typeof Sortie>;

  @hasMany(() => Log)
  public logs: HasMany<typeof Log>;
}
