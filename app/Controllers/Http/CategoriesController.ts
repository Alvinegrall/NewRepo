import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Category from "App/Models/Category";
import Log from "App/Models/Log";

export default class CategoriesController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { name } = request.body();

      const categorie = new Category();

      categorie.name = name;

      await categorie.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "Vous avez crée un une catégorie <b> " + categorie.name + " </b>"),
        (logs.sourceName = "Category");
      logs.sourceId = categorie.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        data: categorie,
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
      const categorie = await Category.query()
        .where("is_active", true)
        .preload("articles");

      return response.status(200).json({ error: false, data: categorie });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const categorie = await Category.query()
        .where("id", params.id)
        .preload("articles")
        .firstOrFail();

      return response.status(200).json({ error: false, data: categorie });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }
}
