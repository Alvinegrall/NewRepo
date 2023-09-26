import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Article from "./Article";
import Beneficiaire from "./Beneficiaire";

export default class Sortie extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public code: string;

  @column()
  public qte: string;

  @column()
  public date: DateTime;
  
  @column()
  public beneficiaireId: number;

  @column()
  public articleId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Article)
  public article: BelongsTo<typeof Article>;

  @belongsTo(() => Beneficiaire)
  public beneficiaire: BelongsTo<typeof Beneficiaire>;
}
