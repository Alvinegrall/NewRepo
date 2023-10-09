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
import Sortie from "App/Models/Sortie";
import fs from "fs";
import PDFDocument from "pdfkit-table";
import Article from "App/Models/Article";
import Mail from "@ioc:Adonis/Addons/Mail";
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
        // Create pdf file and send it to the client
        const cycles = await Cycle.query()
          .where("is_active", true)
          .where("is_default", true)
          .preload("entres", (q) => q.preload("article"))
          .preload("sortie", (q) => {
            q.preload("article");
            q.preload("beneficiaire");
          })
          .preload("logs")
          .firstOrFail();

        const article = await Article.query()
          .where("is_active", true)
          .preload("category")
          .preload("magasin")
          .preload("entre")
          .preload("sortie")
          .orderBy("id", "desc");

        // console.log("PDF créé+++++");

        const doc = new PDFDocument({ margin: 30, size: "A4" });
        console.log("PDF créé+++++ 1");

        // Créez un tableau pour afficher les données
        const table: any = {
          title:
            "Rapport de la période allant de  " +
            new Date(cycles.dateDebut).toLocaleString() +
            " ---- " +
            new Date(cycles.dateFin).toLocaleString(),
          headers: ["Bénéficiaires", "Articles", "Quantité"],
          padding: 5,
          rows: [],
        };

        const tableArticles: any = {
          title: "Etat des articles à la fin du cycle",
          headers: ["Articles", "Quantité", "En alerte"],
          padding: 5,
          rows: [],
        };

        const tableEntre: any = {
          title: "Entrées",
          headers: ["Articles", "Quantité"],
          padding: 5,
          rows: [],
        };

        console.log("PDF créé+++++ 3");
        let fileName = "";
        fileName = `${cycles.code}-${new Date().getTime()}.pdf`;
        const path = `./tmp/uploads/${fileName}`;

        doc.pipe(fs.createWriteStream(path));

        cycles.sortie.forEach((elt) => {
          const userData = [elt.beneficiaire.name, elt.article.name, elt.qte];

          // verifier si le beneficiaire est deja dans le tableau
          // si oui alors on ajoute la qte
          // sinon on ajoute le beneficiaire et l'article

          const benef = table.rows.find(
            (elt: any) => elt[0] === userData[0] && elt[1] === userData[1]
          );
          if (benef) {
            benef[2] = Number(benef[2]) + Number(userData[2]);
          } else {
            table.rows.push(userData);
          }
        });

        article.forEach((elt) => {
          const userData = [elt.name, elt.qte, elt.is_alert ? "Oui" : "Non"];
          tableArticles.rows.push(userData);
        });

        cycles.entres.forEach((elt) => {          
          const userData = [ elt.article.name, elt.qte];
          tableEntre.rows.push(userData);
        });

        // A4 595.28 x 841.89 (portrait) (about width sizes)
        // width

        await doc.table(table);
        await doc.table(tableArticles);
        await doc.table(tableEntre);

        // or columnsSize
        // await doc.table(table, {
        //   columnsSize: [200, 100, 100],
        // });
        // done!
        doc.end();

        await Mail.sendLater((message) => {
          message
            .from("tsagueyvesthibaut@gmail.com")
            .to("tsagueyvesthibaut@gmail.com")
            .subject("Raport et etat des stocks")
            .attach(path);
        });
        element.isPassed = true;
        element.isArchive = true;
        element.isDefault = false;
        element.rapport = `/uploads/${fileName}`;
        await element.save();

        // end of pdf creation
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
          (cycle.dateFin = DateTimeHelpers.addMonth(
            DateTimeHelpers.now(),
            1
          )),
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
