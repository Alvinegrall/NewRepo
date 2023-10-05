/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import DateTimeHelpers from "App/Helpers/DateTimeHelpers";
import Cycle from "App/Models/Cycle";
import cron from "node-cron";
const updateDatabase = async () => {
  try {
    // check if cycle is finished
    const cycles = await Cycle.query()
      .where("is_active", true)
      .where("is_passed", false);

    const dateNow = new Date();

    cycles.forEach(async (element) => {
      const dateFin = new Date(element.dateFin);

      const diff = dateFin.getTime() - dateNow.getTime();

      const diffdays = Math.ceil(diff / (1000 * 3600 * 24));

      if (diffdays < 1) {
        element.isPassed = true;
        element.isArchive = true;
        element.isDefault = false;
        await element.save();
        // create new cycle
        let code = "CYCLE-" + Math.floor(Math.random() * 1000000);
        //   check if code exist in database and generate another one if it does
        let cycle_code = await Cycle.findBy("code", code);
        while (cycle_code) {
          code = "CYCLE-" + Math.floor(Math.random() * 1000000);
          cycle_code = await Cycle.findBy("code", code);
        }
        const cycle = new Cycle();
        // date_debut is a DateTime
        (cycle.dateDebut = DateTimeHelpers.now()),
          (cycle.dateFin = DateTimeHelpers.addMinutes(DateTimeHelpers.now(), 5)),
          (cycle.code = code);

        await cycle.save();
      } 
    });
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("*/10 * * * * *", () => {
  updateDatabase();
});
