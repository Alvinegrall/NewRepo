// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Log from "App/Models/Log";

export default class LogsController {
  public async getAll({ response }: any) {
    try {
      const log = await Log.query()
        .where("is_active", true)
        .limit(10)
        .orderBy("id", "desc");

      return response.status(200).json({ error: false, data: log });
    } catch (error) {
      console.log("error", error);

      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la récupération" });
    }
  }

  public async delete({ params, response }: any) {
    try {
      const log = await Log.query().where("id", params.id).firstOrFail();

      log.isActive = false;

      await log.save();

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
