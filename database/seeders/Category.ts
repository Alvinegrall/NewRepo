import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Category.createMany([
      {
       name:"Fournitures de bureau",
      },
      {
        name:"Pause café"
      },
      {
        name:"Matériel de plomberie"
      },
      {
        name:"Matériel de DIP"
      },
      {
        name:"Encres"
      },
      {
        name:"Autre"
      }
     

    ])
  }

  }

