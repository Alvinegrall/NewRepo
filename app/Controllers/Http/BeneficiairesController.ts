import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Beneficiaire from "App/Models/Beneficiaire";

export default class BeneficiairesController {
  public async register({ request, response }: HttpContextContract) {
    try {
      const { name } = request.body();

      const beneficiaire = new Beneficiaire();

      beneficiaire.name = name;

      await beneficiaire.save();

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
      const beneficiaire = await Beneficiaire.query().preload("sortie");

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
}
