import { DateTime } from "luxon";
import {
  BaseModel,
  beforeFetch,
  BelongsTo,
  belongsTo,
  column,
} from "@ioc:Adonis/Lucid/Orm";
import Article from "./Article";
import Fournisseur from "./Fournisseur";
import Cycle from "./Cycle";

export default class Entre extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public code: string;

  @column()
  public qte: string;

  @column()
  public articleId: number;

  @column()
  public fournisseurId: number;

  @column()
  public marque: string;

  @column()
  public date: DateTime;

  @column({ serialize: Boolean })
  public isActive: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Article)
  public article: BelongsTo<typeof Article>;

  @belongsTo(() => Fournisseur)
  public fournisseur: BelongsTo<typeof Fournisseur>;

  @belongsTo(() => Cycle)
  public cycle: BelongsTo<typeof Cycle>;

  @beforeFetch()
  public static getActive(query: any) {
    query.where("is_active", true);
  }
}
