import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Admin from 'App/Models/Admin'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
        await Admin.create({
            email: 'alvine@hydrac.com',
            password: '12345',
          })
      
  }

  }

