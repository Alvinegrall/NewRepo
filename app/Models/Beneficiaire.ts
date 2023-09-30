import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Sortie from './Sortie'

export default class Beneficiaire extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serialize: Boolean })
  public isActive: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Sortie)
  public sortie: HasMany<typeof Sortie>

  @beforeFetch()
  public static getActive(query: any) {
    query.where("is_active", true);
  }
}
