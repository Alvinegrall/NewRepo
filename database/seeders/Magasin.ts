import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Magasin from "App/Models/Magasin";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Magasin.create({
      name: "Magasin 1",
    });
  }
}
