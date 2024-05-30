import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Fournisseur from "App/Models/Fournisseur";
import CreateFornisseurValidator from "App/Validators/CreateFornisseurValidator";

export default class FournisseursController {
  public async register({ auth,request, response }: HttpContextContract) {
    try {
      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }

      const payload = await request
      .validate(CreateFornisseurValidator)
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
      
      const fournisseur = new Fournisseur();

      fournisseur.name = payload.name;
      fournisseur.userCreate = auth.user.id;

      await fournisseur.save();

      return response.status(200).json({
        error: false,
        data: fournisseur,
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
      const fournisseur = await Fournisseur.query()
        .where("is_active", true)
        .preload("entre");

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
  public async delete({ params, response }: any) {
    try {
      const val = await Fournisseur.query().where("id", params.id).firstOrFail();

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
