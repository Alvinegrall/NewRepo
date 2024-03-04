import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Article from "App/Models/Article";
import Beneficiaire from "App/Models/Beneficiaire";
import Cycle from "App/Models/Cycle";
import Log from "App/Models/Log";
import Sortie from "App/Models/Sortie";

export default class SortiesController {
  public async register({auth, request, response }: HttpContextContract) {
    try {
      const { code_article, beneficiaire_id, qte, date, cycle_code } =
        request.body();


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
          "Vous avez effectué une sortie de <b> " +
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
}
