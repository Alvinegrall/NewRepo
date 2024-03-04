import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Log from "App/Models/Log";
import Magasin from "App/Models/Magasin";

export default class MagasinsController {
  public async register({ auth,request, response }: HttpContextContract) {
    try {
      const { name } = request.body();

      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }
      const magasin = new Magasin();

      magasin.name = name;
      magasin.userCreate = auth.user.id;

      await magasin.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "Vous avez crée un nouveau Magasin <b> " + magasin.name + " </b>"),
        (logs.sourceName = "magasin");
      logs.sourceId = magasin.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        data: magasin,
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
      const magasin = await Magasin.query()
        .where("is_active", true)
        .preload("articles");

      return response.status(200).json({ error: false, data: magasin });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const magasin = await Magasin.query()
        .where("id", params.id)
        .preload("articles")
        .firstOrFail();

      return response.status(200).json({ error: false, data: magasin });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }

  public async delete({ params, response }: any) {
    try {
      const val = await Magasin.query().where("id", params.id).firstOrFail();

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
