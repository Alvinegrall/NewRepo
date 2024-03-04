import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Article from "App/Models/Article";
import Cycle from "App/Models/Cycle";
import Entre from "App/Models/Entre";
import Fournisseur from "App/Models/Fournisseur";
import Log from "App/Models/Log";

export default class EntresController {
  public async register({ auth,request, response }: HttpContextContract) {
    try {
      const { marque, code_article, fournisseur_id, qte, cycle_code } =
        request.body();

        if (!auth.user) {
          return response.unauthorized({
            error: true,
            message: "Invalid credentials",
          });
        }

      const cycle = await Cycle.query().where("code", cycle_code).firstOrFail();

      if (cycle.isPassed) {
        return response.status(500).json({
          error: true,
          message: "Ce cycle est cloturé",
        });
      }

      const fournisseur = await Fournisseur.findByOrFail("id", fournisseur_id);
      //   const beneficiaire = await Beneficiaire.findByOrFail("id", beneficiaire_id);
      const article = await Article.findByOrFail("code", code_article);

      const entre = new Entre();

      (entre.fournisseurId = fournisseur.id),
        (entre.articleId = article.id),
        (entre.qte = qte),
        entre.userCreate = auth.user?.id,
        (entre.marque = marque);
      entre.code = Date.now().toString(32);
      entre.cycleId = cycle.id;

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
      logs.cycleId = cycle.id;

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
  public async getAll({ response, params }: any) {
    try {
      const cycle = await Cycle.findByOrFail("code", params.cycle_code);

      const entre = await Entre.query()
        .where("is_active", true)
        .where("cycle_id", cycle.id)
        .preload("article",(q)=>q.where("is_active",true))
        .preload("fournisseur")
        .orderBy("id", "desc");

      // const entre = await Entre.query()
      //   .where("is_active", true)
      //   .preload("article")
      //   .preload("fournisseur")
      //   .orderBy("id", "desc");

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
