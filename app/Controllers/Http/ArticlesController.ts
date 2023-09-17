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
        (article.categoryId = cat_id);

      await article.save();

      console.log("leuds", cat);

      return response.status(200).json({
        error: false,
        message: "Arcticle create successfully",
        data: cat,
      });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: error.message,
      });
    }
  }
}
