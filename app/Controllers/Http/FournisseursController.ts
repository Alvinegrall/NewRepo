import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Fournisseur from "App/Models/Fournisseur";

export default class FournisseursController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { name } = request.body();

      const fournisseur = new Fournisseur();

      fournisseur.name = name;

      await fournisseur.save();

      return response.status(200).json({
        error: false,
        data: fournisseur,
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
      const fournisseur = await Fournisseur.query().preload("entre");

      return response.status(200).json({ error: false, data: fournisseur });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const fournisseur = await Fournisseur.query()
        .where("code", params.code)
        .preload("entre")
        .firstOrFail();

      return response.status(200).json({ error: false, data: fournisseur });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }
}
