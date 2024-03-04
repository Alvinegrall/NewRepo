import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Roles from 'App/Enums/Roles'
import Admin from 'App/Models/Admin'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
        await Admin.create({
            name: 'Alvin',
            phone:'677438521',
            email: 'alvine@hydrac.com',
            password: '12345',
            role: Roles.ADMIN

          })
        }
  }
