import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Beneficiaire from "App/Models/Beneficiaire";
import Log from "App/Models/Log";

export default class BeneficiairesController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { name } = request.body();

      const beneficiaire = new Beneficiaire();

      beneficiaire.name = name;

      await beneficiaire.save();

      const logs = new Log();
      (logs.name = "Creation"),
        (logs.description =
          "Vous avez crée un un Bénéficiaire <b> " +
          beneficiaire.name +
          " </b>"),
        (logs.sourceName = "beneficiaire");
      logs.sourceId = beneficiaire.id;

      await logs.save();

      return response.status(200).json({
        error: false,
        data: beneficiaire,
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
      const beneficiaire = await Beneficiaire.query()
        .where("is_active", true)
        .preload("sortie", (q) => q.preload("article"));

      return response.status(200).json({ error: false, data: beneficiaire });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const beneficiaire = await Beneficiaire.query()
        .where("code", params.code)
        .preload("sortie")
        .firstOrFail();

      return response.status(200).json({ error: false, data: beneficiaire });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }

  public async delete({ params, response }: any) {
    try {
      const beneficiaire = await Beneficiaire.query()
        .where("id", params.id)
        .preload("sortie")
        .firstOrFail();

        beneficiaire.isActive = false;
        await beneficiaire.save();

        return response
        .status(200)
        .json({ error: false, data: "Supprimé avec success" });
    } catch (error) {
      return response.status(500).json({
        error: true,
        message: "Erreur lors de la récupération" + error,
      });
    }
  }
}
