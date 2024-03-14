import { DateTime } from "luxon";
import {
  BaseModel,
  beforeFetch,
  BelongsTo,
  belongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import Article from "./Article";
import Beneficiaire from "./Beneficiaire";
import Cycle from "./Cycle";

export default class Sortie extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public code: string;

  @column()
  public qte: string;

  @column({ serialize: Boolean })
  public isActive: boolean;

  @column()
  public date: DateTime;

  @column()
  public cycleId: number;

  @column()
  public beneficiaireId: number;

  @column()
  public articleId: number;

  @column()
  public isConforme: boolean;

  @column()
  public userCreate: number;

  @column()
  public userDelete: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Article)
  public article: BelongsTo<typeof Article>;

  @belongsTo(() => Beneficiaire)
  public beneficiaire: BelongsTo<typeof Beneficiaire>;

  @beforeFetch()
  public static getActive(query: any) {
    query.where("is_active", true);
  }
  @belongsTo(() => Cycle)
  public cycle: BelongsTo<typeof Cycle>;
}
