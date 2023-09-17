import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Fournisseur from 'App/Models/Fournisseur'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await Fournisseur.createMany([
        {
         name:"Afrique fourniture"
        },
        {
          name:"OAC"
        },
        {
          name:"INTEK"
        },
        {
          name:"Aura"
        }
       
  
      ])
      
  }

  }

