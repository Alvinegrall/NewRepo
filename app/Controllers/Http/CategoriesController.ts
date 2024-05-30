import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Category from "App/Models/Category";
import Log from "App/Models/Log";
import CreateCategorieValidator from "App/Validators/CreateCategorieValidator";

export default class CategoriesController {
  public async register({ auth, request, response }: HttpContextContract) {
    try {
      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }

      const payload = await request
      .validate(CreateCategorieValidator)
      .then((data) => data)
      .catch((error) => {
        if (error.messages?.errors) {
          return response.badRequest({
            error: true,
            message: error.messages.errors[0].message,
          });
        } else {
          return response.badRequest({
            error: true,
            message:
              "Une erreur est survenue lors de l'exécution de la requête",
          });
        }
      });

    if (payload) {
      const categorie = new Category();

      categorie.name = payload.name;
      categorie.userCreate = auth.user.id;

      await categorie.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "<b> " +
          auth.user?.name +
          " </b>" +
          "à crée un une catégorie <b> " +
          categorie.name +
          " </b>"),
        (logs.sourceName = "Category");
      logs.sourceId = categorie.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        data: categorie,
      });
    }
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

  public async delete({ params, response }: any) {
    try {
      const val = await Category.query().where("id", params.id).firstOrFail();

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
