import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Article from "App/Models/Article";
import Entre from "App/Models/Entre";
import Fournisseur from "App/Models/Fournisseur";
import Log from "App/Models/Log";

export default class EntresController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { marque, code_article, fournisseur_id, qte } = request.body();

      const fournisseur = await Fournisseur.findByOrFail("id", fournisseur_id);
      //   const beneficiaire = await Beneficiaire.findByOrFail("id", beneficiaire_id);
      const article = await Article.findByOrFail("code", code_article);

      const entre = new Entre();

      (entre.fournisseurId = fournisseur.id),
        (entre.articleId = article.id),
        (entre.qte = qte),
        (entre.marque = marque);
      entre.code = Date.now().toString(32);

      await entre.save();
      article.qteBefore = article.qte;
      article.qte = Number(article.qte) + Number(qte);
      
      if (Number(article.stock_alerte) < Number(article.qte)) {
        article.is_alert = false;
      }

      await article.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "Vous avez reçu une livraison de " +
          article.name +
          " de " +
          fournisseur.name),
        (logs.sourceName = "entre");
      logs.sourceId = entre.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        message: "entré create successfully",
        data: entre,
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
      const entre = await Entre.query()
      .where("is_active",true)
        .preload("article")
        .preload("fournisseur")
        .orderBy("id", "desc")

      return response.status(200).json({ error: false, data: entre });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const entre = await Entre.query()
        .where("code", params.code)
        .preload("article")
        .preload("fournisseur")
        .firstOrFail();

      return response.status(200).json({ error: false, data: entre });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }

  public async delete({ params, response }: any) {
    try {
      const val = await Entre.query().where("id", params.id).firstOrFail();

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
