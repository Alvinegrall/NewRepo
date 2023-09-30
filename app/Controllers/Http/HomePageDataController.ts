import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Article from "App/Models/Article";
import Entre from "App/Models/Entre";
import Sortie from "App/Models/Sortie";

export default class ArticlesController {
  public async getHomePageData({ response }: HttpContextContract) {
    try {
      const articles = await Article.all();
      const entre = await Entre.all();
      const sortie = await Sortie.all();
      const stock_alerte = await Article.query().where("is_alert", true);

      const article_name = articles.map((elt)=>elt.name)
      const article_qte = articles.map((elt)=>elt.qte)

      const datas = {
        total_article: articles.length,
        total_sortie: sortie.length,
        total_entre: entre.length,
        total_alerte: stock_alerte.length,
        article_name: article_name,
        article_qte: article_qte
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
}
