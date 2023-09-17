import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Article from "App/Models/Article";

import Category from "App/Models/Category";

export default class ArticlesController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { name, stock_alerte, stock_securite, cat_id } = request.body();

      const cat = await Category.findByOrFail("id", cat_id);

      const article = new Article();

      (article.name = name),
        (article.code = Date.now().toString(32)),
        (article.stock_alerte = stock_alerte),
        (article.stock_securite = stock_securite),
        (article.categoryId = cat.id);

      await article.save();

      return response.status(200).json({
        error: false,
        message: "Arcticle create successfully",
        data: article,
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
      const article = await Article.query()
        .preload("category")
        .preload("entre")
        .preload("sortie");

      return response.status(200).json({ error: false, data: article });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const article = await Article.query()
        .where("code", params.code)
        .preload("category")
        .preload("entre")
        .preload("sortie")
        .firstOrFail();

      return response.status(200).json({ error: false, data: article });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }
}
