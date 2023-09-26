import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Article from "App/Models/Article";
import Beneficiaire from "App/Models/Beneficiaire";
import Log from "App/Models/Log";
import Sortie from "App/Models/Sortie";

export default class SortiesController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { code_article, beneficiaire_id, qte, date } = request.body();

      //   const fournisseur = await Fournisseur.findByOrFail("id", fournisseur_id);
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

      await sortie.save();

      article.qteBefore = article.qte;
      article.qte = Number(article.qte) - Number(qte);
      await article.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "Vous avez reçu une sortie de <b> " +
          article.name +
          "</b> vers le département <b> " +
          beneficiaire.name) + " </b>",
        (logs.sourceName = "sortie");
      logs.sourceId = sortie.id;

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

  public async getAll({ response }: any) {
    try {
      const sortie = await Sortie.query()
        .preload("article")
        .preload("beneficiaire");

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
}
