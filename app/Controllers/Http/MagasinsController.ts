import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Magasin from "App/Models/Magasin";

export default class MagasinsController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { name } = request.body();

      const magasin = new Magasin();

      magasin.name = name;

      await magasin.save();

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
      const magasin = await Magasin.query().preload("articles");

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
}
