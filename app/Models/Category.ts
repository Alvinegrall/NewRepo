
import {
    column,
    BaseModel,
    hasMany,
    HasMany
  } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'


  export default class Category extends BaseModel {
    @column({ isPrimary: true })
    public id: number
  
    @column()
    public name: string
    
    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime
  
    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
  

  
  

 
  }
  
  