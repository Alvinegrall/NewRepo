
import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Roles from "App/Enums/Roles";
export default class ArticleValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    // name, stock_alerte, stock_securite, cat_id, magasin_id
    name: schema.string({ trim: true },[
      rules.unique({ table: "articles", column: "name" }),
    ]),
    stock_alerte: schema.number(),
    stock_securite: schema.number(),
    cat_id: schema.number(),
    magasin_id: schema.number(),
    // first_phone: schema.string({ trim: true }, [
    //   rules.unique({ table: "ass_membres", column: "first_phone" }),
    // ]),
    // second_phone: schema.string.optional(),
    // email: schema.string.optional({ trim: true }, [
    //   rules.email(),
    // ]),
    // residence: schema.string.optional({ trim: true }),
    // country: schema.string.optional({ trim: true }),
    // region: schema.string.optional({ trim: true }),
    // city: schema.string.optional({ trim: true }),
    // type: schema.enum([Roles.MEMBER, Roles.FOUNDER]),
    // matricule: schema.string.optional({ trim: true }),
    // photo_profil: schema.file.optional({ extnames: ["jpg", "png", "jpeg"] }),
    // phonenumber: schema.string({ trim: true }),
    // countrycode: schema.string({ trim: true }),
    // partner_urlcode: schema.string({ trim: true }),
    // marital_status: schema.string.optional({ trim: true }),
    // profession: schema.string.optional({ trim: true }),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    "name.unique": "Cette article existe déjà",
    "stock_alerte.required": "Stock d'arlerte est obligatoire",
    "stock_securite.required": "Stock de securité est obligatoire",
    "cat_id.required": "Choisir la catégorie",
    "magasin_id.required": "Choisir le magasin"
  }
}
