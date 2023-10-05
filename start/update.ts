/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
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
        (cycle.dateDebut = new Date(Date.now())
          .toISOString()
          .slice(0, 16)
          .replace("T", " ")),
          (cycle.dateFin = new Date(
            new Date().setMonth(new Date().getMonth() + 1)
          )
            .toISOString()
            .slice(0, 16)
            .replace("T", " ")),
          (cycle.code = code);
        cycle.save();
      }
      else{
        console.log("okkk ++");
        
      }
    });
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("*/10 * * * * *", () => {
  updateDatabase();
});
