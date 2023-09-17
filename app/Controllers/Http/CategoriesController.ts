// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Database from "@ioc:Adonis/Lucid/Database";
import Category from "App/Models/Category";

export default class CategoriesController {
    public async save({ response }: any) {
        const body = [
            "Développement personnel",
            "Marketing",
            "Gestion",
            "Finance",
            "RH",
            "Vente",
            "Logistiques"
        ]
        const user = await Category.all();
        
        if(user.length == 0){
            body.forEach(async (elt)=>{
             await Database.table("categories").insert({
                    name: elt,
                  });
            })
        }
        return response.status(200).json({
          message: "User created successfully",
          data: body,
        });
      }
}
