import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Article from "App/Models/Article";
import Entre from "App/Models/Entre";
import Fournisseur from "App/Models/Fournisseur";

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

      await article.save();

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
        .preload("article")
        .preload("fournisseur");

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
}
