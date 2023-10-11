import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Article from "App/Models/Article";

import Category from "App/Models/Category";
import Log from "App/Models/Log";
import Magasin from "App/Models/Magasin";

export default class ArticlesController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { name, stock_alerte, stock_securite, cat_id, magasin_id } =
        request.body();

      const cat = await Category.findByOrFail("id", cat_id);
      const magasin = await Magasin.findByOrFail("id", magasin_id);

      const article = new Article();

      (article.name = name),
        (article.code = Date.now().toString(32)),
        (article.stock_alerte = stock_alerte),
        (article.stock_securite = stock_securite),
        (article.categoryId = cat.id);
      article.magasinId = magasin.id;

      if (Number(stock_alerte) > 0) {
        article.is_alert = true;
      }

      await article.save();

      // save logs

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "Vous avez crée un article <b> " + article.name + " </b>"),
        (logs.sourceName = "articles");
      logs.sourceId = article.id;

      await logs.save();

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
        .where("is_active", true)
        .preload("category")
        .preload("magasin")
        .preload("entre")
        .preload("sortie")
        .orderBy("id", "desc");

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
  public async delete({ params, response }: any) {
    try {
      const val = await Article.query().where("id", params.id).firstOrFail();

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

  public async update({ response, request, params }: any) {
    try {
      const { name, stock_alerte, stock_securite, cat_id, magasin_id } =
        request.body();

      // update article

      const article = await Article.query()
        .where("id", params.id)
        .firstOrFail();

      if (article.name != name) {
        article.name = name;
      }

      if (article.stock_alerte != stock_alerte) {
        article.stock_alerte = stock_alerte;
      }

      if (article.stock_securite != stock_securite) {
        article.stock_securite = stock_securite;
      }

      if (article.categoryId != cat_id) {
        const cat = await Category.findByOrFail("id", cat_id);
        article.categoryId = cat.id;
      }

      if (article.magasinId != magasin_id) {
        const magasin = await Magasin.findByOrFail("id", magasin_id);
        article.magasinId = magasin.id;
      }

      await article.save();
      if (Number(article.stock_alerte) > Number(article.qte)) {
        article.is_alert = true;
      } else {
        article.is_alert = false;
      }
      article.save();
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }
  // public async delete({ params, response }: any) {
  //   try {
  //     const beneficiaire = await Beneficiaire.query()
  //       .where("code", params.code)
  //       .preload("sortie")
  //       .firstOrFail();

  //     return response.status(200).json({ error: false, data: beneficiaire });
  //   } catch (error) {
  //     return response.status(500).json({
  //       error: true,
  //       message: "Erreur lors de la récupération" + error,
  //     });
  //   }
  // }
}
