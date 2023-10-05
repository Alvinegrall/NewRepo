import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Article from "App/Models/Article";
import Beneficiaire from "App/Models/Beneficiaire";
import Entre from "App/Models/Entre";
import Sortie from "App/Models/Sortie";

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
}
