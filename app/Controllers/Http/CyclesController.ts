// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Cycle from "App/Models/Cycle";

export default class CyclesController {
  public async register({ request, response }: any) {
    try {
      const { date_debut, date_fin } = request.body();
      const code = "CYCLE-" + Math.floor(Math.random() * 1000000);

      const cycle = new Cycle();
      cycle.dateDebut = date_debut;
      cycle.dateFin = date_fin;
      cycle.code = code;
      cycle.save();

      return response.status(200).json({ error: false, data: cycle });
    } catch (error) {
      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la création" });
    }
  }
  public async getAll({ params, response }: any) {
    try {
      const cycle = await Cycle.query()
        .where("is_active", true)
        .preload("entres")
        .preload("sortie")
        .preload("logs");

      return response.status(200).json({ error: false, data: cycle });
    } catch (error) {
      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la création" });
    }
  }

  public async getOne({ params, response }: any) {
    try {
      const cycles = await Cycle.query()
        .where("code", params.code)
        .preload("entres")
        .preload("sortie")
        .preload("logs")
        .firstOrFail();

      return response.status(200).json({ error: false, data: cycles });
    } catch (error) {
      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la création" });
    }
  }
}
