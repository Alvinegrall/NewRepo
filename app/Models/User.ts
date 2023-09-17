import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({columnName: 'name'})
  public name: string

  @column({columnName: 'email'}) 
  public email: string 

  @column({columnName: 'number'})
  public number: string

  @column.date()
  public date: DateTime

  @column({columnName: 'heure'})
  public heure: string

  @column({columnName: 'paysO'})
  public paysO: string

  @column({columnName: 'paysD'})
  public paysD: string

  @column({columnName: 'invest'})
  public invest: string

  @column({columnName: 'reminded'})
  public reminded: boolean

  @column.dateTime()
  public remindedAt: DateTime

  @column({columnName: 'timeinvest'})
  public timeinvest: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
