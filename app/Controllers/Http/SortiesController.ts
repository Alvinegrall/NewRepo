import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DateTimeHelpers from "App/Helpers/DateTimeHelpers";

import Article from "App/Models/Article";
import Beneficiaire from "App/Models/Beneficiaire";
import Cycle from "App/Models/Cycle";
import Log from "App/Models/Log";
import Sortie from "App/Models/Sortie";

import fs from "fs";
import PDFDocument from "pdfkit-table";

export default class SortiesController {
  public async register({ auth, request, response }: HttpContextContract) {
    try {
      const {
        code_article,
        beneficiaire_id,
        qte,
        date,
        cycle_code,
        is_conforme,
      } = request.body();

      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }
      //   const fournisseur = await Fournisseur.findByOrFail("id", fournisseur_id);

      const cycle = await Cycle.query().where("code", cycle_code).firstOrFail();

      if (cycle.isPassed) {
        return response.status(500).json({
          error: true,
          message: "Ce cycle est cloturé",
        });
      }

      const beneficiaire = await Beneficiaire.findByOrFail(
        "id",
        beneficiaire_id
      );
      const article = await Article.findByOrFail("code", code_article);

      const sortie = new Sortie();

      sortie.code = Date.now().toString(32);
      sortie.qte = qte;
      sortie.beneficiaireId = beneficiaire.id;
      sortie.articleId = article.id;
      sortie.date = date;
      sortie.cycleId = cycle.id;
      sortie.userCreate = auth.user?.id;
      // sortie.isConforme = is_conforme

      await sortie.save();

      article.qteBefore = article.qte;
      if (Number(article.qte) <= Number(qte)) {
        return response.status(500).json({
          error: true,
          message: "Quantité insuffisante",
        });
      }
      article.qte = Number(article.qte) - Number(qte);

      if (Number(article.stock_alerte) < Number(article.qte)) {
        console.log("if case");
        article.is_alert = false;
      } else {
        console.log("elese if case");

        article.is_alert = true;
      }
      await article.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "<b> " +
          auth.user?.name +
          " </b>" +
          " à effectué une sortie de <b> " +
          article.name +
          "</b> <b>( " +
          qte +
          " )</b> vers le département <b> " +
          beneficiaire.name) + " </b>",
        (logs.sourceName = "sortie");
      logs.sourceId = sortie.id;
      logs.cycleId = cycle.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        message: "sortie create successfully",
        data: sortie,
      });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }

  public async getAll({ response, params }: any) {
    try {
      const cycle = await Cycle.findByOrFail("code", params.cycle_code);

      const sortie = await Sortie.query()
        .where("is_active", true)
        .where("cycle_id", cycle.id)
        .preload("article")
        .preload("beneficiaire")
        .orderBy("id", "desc");

      // const sortie = await Sortie.query()
      //   .where("is_active", true)
      //   .preload("article")
      //   .preload("beneficiaire")
      //   .orderBy("id", "desc");

      return response.status(200).json({ error: false, data: sortie });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const sortie = await Sortie.query()
        .where("code", params.code)
        .preload("article")
        .preload("beneficiaire")
        .firstOrFail();

      return response.status(200).json({ error: false, data: sortie });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }

  public async delete({ params, response }: any) {
    try {
      const val = await Sortie.query().where("id", params.id).firstOrFail();

      val.isActive = false;

      await val.save();

      return response
        .status(200)
        .json({ error: false, data: "Supprimé avec success" });
    } catch (error) {
      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la suppression" });
    }
  }

  public async getAllPaginate({ response, request, params }: any) {
    try {
      const {
        page = 1,
        per_page = 10,
        category = null,
        search_key,
        search_value,
        start_date,
        end_date,
        limit_date,
        source_name,
        beneficiaire_id,
        article_id,
        source_ref,
        type,
      } = request.qs();

      const cycle = await Cycle.findByOrFail("code", params.cycle_code);
      let query: any;

      query = Sortie.query()
        .where("is_active", true)
        .where("cycle_id", cycle.id)
        .preload("article")
        .preload("beneficiaire")
        .orderBy("id", "desc");

      if (start_date) {
        query.where("date", ">=", start_date);
      }
      if (end_date) {
        query.where("date", "<=", end_date);
      }

      if (beneficiaire_id) {
        query.where("beneficiaire_id", beneficiaire_id);
      }

      if (article_id) {
        query.where("article_id", article_id);
      }
      if (search_value) {
        query = Sortie.query()
          .where("is_active", true)
          .where("cycle_id", cycle.id)
          .whereHas("article", (q) => {
            q.where("name", "like", `%${search_value}%`);
          })
          .preload("article")
          .preload("beneficiaire")
          .orderBy("id", "desc");
      }

      if (limit_date && !limit_date.includes("all")) {
        const limited_date = DateTimeHelpers.addDays(
          DateTimeHelpers.now(),
          limit_date
        );
        query.where("created_at", ">=", limited_date);
      }
      // if (type && type !== "all") {
      //   query.where("is_alert", type);
      // }
      const sorties = await query.paginate(page, per_page);

      return response.status(200).json({
        error: false,
        sorties: sorties.all(),
        data: {
          sorties: sorties.all(),
          total: sorties.total,
          current_page: sorties.currentPage,
          has_more_pages: sorties.hasMorePages,
          first_page: sorties.firstPage,
          last_page: sorties.lastPage,
          is_empty: sorties.isEmpty,
        },
      });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }
  public async genaratePdfSortie({ response, request, params }: any) {
    try {
      const {
        page = 1,
        per_page = 10,
        category = null,
        search_key,
        search_value,
        start_date,
        end_date,
        limit_date,
        source_name,
        title,
        beneficiaire_id,
        article_id,
        source_ref,
        type,
      } = request.qs();

      const cycle = await Cycle.findByOrFail("code", params.cycle_code);
      let query: any;

      query = Sortie.query()
        .where("is_active", true)
        .where("cycle_id", cycle.id)
        .preload("article")
        .preload("beneficiaire")
        .orderBy("id", "desc");

      if (start_date) {
        query.where("date", ">=", start_date);
      }
      if (end_date) {
        query.where("date", "<=", end_date);
      }

      if (beneficiaire_id) {
        query.where("beneficiaire_id", beneficiaire_id);
      }

      if (article_id) {
        query.where("article_id", article_id);
      }
      if (search_value) {
        query = Sortie.query()
          .where("is_active", true)
          .where("cycle_id", cycle.id)
          .whereHas("article", (q) => {
            q.where("name", "like", `%${search_value}%`);
          })
          .preload("article")
          .preload("beneficiaire")
          .orderBy("id", "desc");
      }

      if (limit_date && !limit_date.includes("all")) {
        const limited_date = DateTimeHelpers.addDays(
          DateTimeHelpers.now(),
          limit_date
        );
        query.where("created_at", ">=", limited_date);
      }
      // if (type && type !== "all") {
      //   query.where("is_alert", type);
      // }
      const sorties = await query;

      // generate pdf file
      const doc = new PDFDocument({ margin: 30, size: "A4" });

      // Créez un tableau pour afficher les données
      // const table: any = {
      //   title: "Article en alerte :",
      //   headers: ["Bénéficiaires", "Articles", "Quantité"],
      //   padding: 5,
      //   rows: [],
      // };

      const tableEntre: any = {
        title: title ? title : "Sorties",
        headers: ["No", "Date", "Article", "Quantité", "Bénéficiaire"],
        padding: 5,
        rows: [],
      };

      // const tableEntre: any = {
      //   title: "Entrées",
      //   headers: ["Articles", "Quantité"],
      //   padding: 5,
      //   rows: [],
      // };

      let fileName = "";
      // fileName = `${new Date().getFullYear()}-${new Date().getTime()}.pdf`;
      fileName = `Sortie-${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}.pdf`;
      const path = `tmp/uploads/${fileName}`;

      doc.pipe(fs.createWriteStream(path));

      sorties.forEach((elt: Sortie, index) => {
        const userData = [
          index,
          DateTimeHelpers.formatDate(elt.date),
          elt?.article?.name,
          elt?.qte,
          elt?.beneficiaire?.name,
        ];
        tableEntre.rows.push(userData);
      });

      // A4 595.28 x 841.89 (portrait) (about width sizes)
      // width

      // await doc.table(table);
      await doc.table(tableEntre);

      doc.end();

      return {
        path: path,
        fileName: `http://localhost:3333/uploads/${fileName}`,
      };
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }
}
