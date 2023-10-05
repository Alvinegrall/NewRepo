import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Cycle from "App/Models/Cycle";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    let code = "CYCLE-" + Math.floor(Math.random() * 1000000);
    //   check if code exist in database and generate another one if it does
    let cycle_code = await Cycle.findBy("code", code);
    while (cycle_code) {
      code = "CYCLE-" + Math.floor(Math.random() * 1000000);
      cycle_code = await Cycle.findBy("code", code);
    }

    await Cycle.create({
      dateDebut: new Date(Date.now())
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),
      dateFin: new Date(new Date().setMonth(new Date().getMonth() + 1))
        .toISOString()
        .slice(0, 16)
        .replace("T", " "),
      code: code,
    });
  }
}
