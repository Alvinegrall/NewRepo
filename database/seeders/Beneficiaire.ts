import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Beneficiaire from "App/Models/Beneficiaire";

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Beneficiaire.createMany([
      {
        name: "DG",
      },
      {
        name: "DGA",
      },
      {
        name: "DAD",
      },
      {
        name: "DFC",
      },
      {
        name: "BCP",
      },
      {
        name: "DCM",
      },
      {
        name: "DCT",
      },
      {
        name: "DI",
      },
      {
        name: "DCN",
      },
      {
        name: "DIT",
      },
      {
        name: "DIP",
      },
      {
        name: "CTV",
      },
    ]);
  }
}
