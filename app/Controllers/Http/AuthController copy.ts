import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Admin from "App/Models/Admin";
import Cycle from "App/Models/Cycle";

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      const data = await auth
        .use("api")
        .attempt(email, password, { expiresIn: "7 days" });

      // const cycle = await Cycle.query()
      //   .where("is_active", true)
      //   .where("is_passed", false)
      //   .first();

      // if (!cycle) {
      //   let code = "CYCLE-" + Math.floor(Math.random() * 1000000);
      //   //   check if code exist in database and generate another one if it does
      //   let cycle_code = await Cycle.findBy("code", code);
      //   while (cycle_code) {
      //     code = "CYCLE-" + Math.floor(Math.random() * 1000000);
      //     cycle_code = await Cycle.findBy("code", code);
      //   }
      //   const cycle = new Cycle();
      //   // date_debut is a DateTime
      //   (cycle.dateDebut = new Date(Date.now())
      //     .toISOString()
      //     .slice(0, 16)
      //     .replace("T", " ")),
      //     (cycle.dateFin = new Date(
      //       new Date().setMonth(new Date().getMonth() + 1)
      //     )
      //       .toISOString()
      //       .slice(0, 16)
      //       .replace("T", " ")),
      //     (cycle.code = code);
      //   cycle.save();
      // }

      return response.ok({
        error: false,
        token: data.token,
        data: {
          user: data.user,
        },
      });
    } catch {
      return response
        .status(500)
        .json({ error: true, message: "Erreur lors de la création" });
    }
  }
  public async profile({ auth, response }: HttpContextContract) {
    try {
      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      } else {
        return response.ok({
          error: false,
          data: {
            user: auth.user,
          },
        });
      }
    } catch {
      return response.unauthorized({
        error: true,
        message: "Invalid credentials",
      });
    }
  }
  public async createUser({ auth, response, request }: HttpContextContract) {
    try {
      const { name, phone, email, password,role } = request.body();
      
      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }

      const admin = new Admin();
      admin.name = name;
      admin.userCreate = auth.user.id;
      admin.phone = phone;
      admin.email = email;
      admin.password = password;
      admin.rememberMeToken = null;
      admin.role = role
      await admin.save();
    } catch {
      return response.unauthorized({
        error: true,
        message: "Invalid credentials",
      });
    }
  }
  public async getAllUsers({ auth, response, request }: HttpContextContract) {
    try {
      const users = await Admin.query().where("is_active", true);
      return response.ok({
        error: false,
        data: {
          users: users,
        },
      });
    } catch {
      return response.unauthorized({
        error: true,
        message: "Invalid credentials",
      });
    }
  }
  public async deleteUser({ auth, response, request }: HttpContextContract) {
    try {
      const user = await Admin.query()
        .where("id", request.params().id)
        .firstOrFail();
      if (!auth.user) {
        return response.unauthorized({
          error: true,
          message: "Invalid credentials",
        });
      }
      user.userDelete = auth.user.id;
      user.isActive = false;
      await user.save();
      return response.ok({
        error: false,
        data: "user deleted successfully",
      });
    } catch {
      return response.unauthorized({
        error: true,
        message: "Invalid credentials",
      });
    }
  }
}
