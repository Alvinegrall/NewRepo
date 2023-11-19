import { Application } from "@adonisjs/core/build/standalone";
import Mail from "@ioc:Adonis/Addons/Mail";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import SendMails from "App/Mailers/SendMails";
import Article from "App/Models/Article";
import Beneficiaire from "App/Models/Beneficiaire";
import Cycle from "App/Models/Cycle";
import Entre from "App/Models/Entre";
import Sortie from "App/Models/Sortie";
import fs from "fs";
import PDFDocument from "pdfkit-table";

export default class ArticlesController {
  public async getHomePageData({ response }: HttpContextContract) {
    try {
      const articles = await Article.query().where("is_active", true);
      const entre = await Entre.query().where("is_active", true);

      const sortie = await Sortie.query().where("is_active", true);
      const stock_alerte = await Article.query()
        .where("is_alert", true)
        .andWhere("is_active", true);

      const article_name = articles.map((elt) => elt.name);
      const article_qte = articles.map((elt) => elt.qte);

      const datas = {
        total_article: articles.length,
        total_sortie: sortie.length,
        total_entre: entre.length,
        total_alerte: stock_alerte.length,
        article_name: article_name,
        article_qte: article_qte,
      };

      return response.status(200).json({
        error: false,
        data: datas,
      });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }

  public async getStatistics({ request, params, response }: any) {
    try {
      const { date, beneficiaire_id } = request.body();

      const benefi = Beneficiaire.query()
        .where("id", beneficiaire_id)
        .preload("sortie", (q) =>
          q.where("date", "<=", date).preload("article")
        )
        .firstOrFail();

      return response.status(200).json({ error: false, data: benefi });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }

  public async getAllStatistics({ request, params, response }: any) {
    try {
      const entre = await Beneficiaire.query()
        .where("is_active", true)
        .preload("sortie", (q) => q.preload("article"));
      return response.status(200).json({ error: false, data: entre });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }

  public async getAllArchive({ request, response }: any) {
    try {
      const cycle = await Cycle.query()
        .where("is_active", true)
        .andWhere("is_passed", true)
        .preload("entres", (q) => q.preload("article"))
        .preload("sortie", (q) => {
          q.preload("article");
          q.preload("beneficiaire");
        });

      // const cycles = await Cycle.query()
      //   .where("is_active", true)
      //   .where("is_default", true)
      //   .preload("entres", (q) => q.preload("article"))
      //   .preload("sortie", (q) => {
      //     q.preload("article");
      //     q.preload("beneficiaire");
      //   })
      //   .preload("logs")
      //   .firstOrFail();

      // const article = await Article.query()
      //   .where("is_active", true)
      //   .preload("category")
      //   .preload("magasin")
      //   .preload("entre")
      //   .preload("sortie")
      //   .orderBy("id", "desc");

      // // console.log("PDF créé+++++");

      // const doc = new PDFDocument({ margin: 30, size: "A4" });
      // console.log("PDF créé+++++ 1");

      // // Créez un tableau pour afficher les données
      // const table: any = {
      //   title:
      //     "Rapport de la période allant de  " +
      //     new Date(cycles.dateDebut).toLocaleString() +
      //     " ---- " +
      //     new Date(cycles.dateFin).toLocaleString(),
      //   headers: ["Bénéficiaire", "Article", "Quantité"],
      //   padding: 5,
      //   rows: [],
      // };

      // const tableArticles: any = {
      //   title: "Etat des articles à la fin du cycle",
      //   headers: ["Article", "Quantité", "En alerte"],
      //   padding: 5,
      //   rows: [],
      // };

      // const tableEntre: any = {
      //   title: "Entrées / Livraisons",
      //   headers: ["Date", "Article", "Quantité"],
      //   padding: 5,
      //   rows: [],
      // };

      // console.log("PDF créé+++++ 3");
      // doc.pipe(fs.createWriteStream("./rapport-de-stock.pdf"));

      // cycles.sortie.forEach((elt) => {
      //   const userData = [elt.beneficiaire.name, elt.article.name, elt.qte];

      //   // verifier si le beneficiaire est deja dans le tableau
      //   // si oui alors on ajoute la qte
      //   // sinon on ajoute le beneficiaire et l'article

      //   const benef = table.rows.find(
      //     (elt: any) => elt[0] === userData[0] && elt[1] === userData[1]
      //   );
      //   if (benef) {
      //     benef[2] = Number(benef[2]) + Number(userData[2]);
      //   } else {
      //     table.rows.push(userData);
      //   }
      // });

      // article.forEach((elt) => {
      //   const userData = [elt.name, elt.qte, elt.is_alert ? "Oui" : "Non"];
      //   tableArticles.rows.push(userData);
      // });

      // cycles.entres.forEach((elt) => {
      //   const userData = [
      //     new Date(elt.date.toString()).toLocaleString(),
      //     elt.article.name,
      //     elt.qte,
      //   ];
      //   tableEntre.rows.push(userData);
      // });

      // // A4 595.28 x 841.89 (portrait) (about width sizes)
      // // width

      // await doc.table(table);
      // await doc.table(tableArticles);
      // await doc.table(tableEntre);

      // // or columnsSize
      // // await doc.table(table, {
      // //   columnsSize: [200, 100, 100],
      // // });
      // // done!
      // doc.end();

      // await Mail.sendLater((message) => {
      //   message
      //     .from("tsagueyvesthibaut@gmail.com")
      //     .to("tsagueyvesthibaut@gmail.com")
      //     .subject("Rapoort du mois")
      //     .attach("document.pdf");
      // });

      return response.ok({
        error: false,
        cycle: cycle,
        data: {
          cycle: cycle,
          // total: cycle.total,
          // current_page: cycle.currentPage,
          // has_more_pages: cycle.hasMorePages,
          // first_page: cycle.firstPage,
          // last_page: cycle.lastPage,
          // is_empty: cycle.isEmpty,
        },
      });
      // return response.status(200).json({ error: false, data: cycle });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }
}
