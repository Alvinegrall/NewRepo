// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Mail from "@ioc:Adonis/Addons/Mail";
import User from "App/Models/User";
import { DateTime } from "luxon";

export default class UsersController {
  public async register({ request, response }: any) {
    const body = request.body();

    const status = await User.create({
      name: body.name,
      email: body.email,
      number: body.number,
      date: body.date,
      heure: body.heure,
      paysO: body.paysO,
      paysD: body.paysD,
      invest: body.invest,
      timeinvest: body.timeinvest,
    });

    if (status) {
      await Mail.send((message) => {
        message
          .from(body.email)
          .to(body.email)
          .subject("Confirmation d'inscription")
          .htmlView("emails/welcome", {
            user: { fullName: body.name },
            appointmentDate: body.date,
            appointmentTime: body.heure,
          });
      });
    }

    return response.status(200).json({
      message: "User created successfully",
      data: body,
    });
  }

  public async getAll({ response }: any) {
    const user = await User.all();
    // SQL: SELECT * from "users" ORDER BY "id" DESC;

    return response.status(200).json({
      message: "event created successfully",
      data: user,
    });
  }

  public async remind({ response }: any) {
    const user = await User.all();
    // SQL: SELECT * from "users" ORDER BY "id" DESC;
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    user.forEach(async (element) => {
      // get the current date

      // check if the date is today
      if (
        day == element.date.day &&
        month == element.date.month &&
        year == element.date.year
      ) {
        const hourNow = DateTime.now().hour;
        const remindedHour1 = hourNow + 2;
        const remindedHour2 = hourNow + 2;

        const heure = element.heure.split(" : ")[0];

        if (remindedHour1 == parseInt(heure)) {
          if (!element.reminded) {
            element.reminded = true;
            element.remindedAt = DateTime.now();
            await element.save();

            await Mail.send((message) => {
              message
                .from(element.email)
                .to(element.email)
                .subject("Rappel de votre rendez-vous")
                .htmlView("emails/remind", {
                  user: { fullName: element.name },
                  appointmentDate: element.date,
                  appointmentTime: element.heure,
                  startDate: "6",
                });
            });
          }
        }

        if (remindedHour2 == parseInt(heure)) {
            element.reminded = true;
            element.remindedAt = DateTime.now();
            await element.save();

            await Mail.send((message) => {
              message
                .from(element.email)
                .to(element.email)
                .subject("Rappel de votre rendez-vous")
                .htmlView("emails/remind", {
                  user: { fullName: element.name },
                  appointmentDate: element.date,
                  appointmentTime: element.heure,
                  startDate: "2",
                });
            });
          
        }
      }
    });

    return response.status(200).json({
      message: "event created successfully",
      data: user,
    });
  }
}
