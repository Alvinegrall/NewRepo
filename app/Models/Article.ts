import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Category from "./Category";
import Sortie from "./Sortie";
import Entre from "./Entre";
import Fournisseur from "./Fournisseur";

export default class Article extends BaseModel {
  @column({ isPrimary: true })
  public id: number;
  // table.string("name");
  // table.string("marque");
  // table.string("stock_alerte");
  // table.string("stock_securite");
  // table.boolean("is_active").defaultTo(false);
  // table.integer("qte").notNullable().defaultTo(0)

  @column()
  public name: string;

  @column()
  public code: string;

  @column()
  public stock_alerte: string;

  @column()
  public stock_securite: string;

  @column()
  public is_active: boolean;

  @column()
  public qte: number;

  @column()
  public categoryId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>;
  @hasMany(() => Sortie)
  public sortie: HasMany<typeof Sortie>;

  @hasMany(() => Entre)
  public entre: HasMany<typeof Entre>;
}
