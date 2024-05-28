import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Roles from 'App/Enums/Roles'

export default class CreateUserValidator {
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
  // name, phone, email, password,role
  public schema = schema.create({
    name: schema.string({ trim: true }),
    phone: schema.string({ trim: true }, [
      rules.unique({ table: "admins", column: "phone" }),
      rules.mobile(),
    ]),
    email: schema.string({ trim: true }, [
      rules.email(),
      rules.unique({ table: "admins", column: "email" }),
    ]),
    password: schema.string({ trim: true }),
    role: schema.enum([Roles.ADMIN, Roles.USER]),
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
    "name.unique": "Cet utilisateur existe déja",
    "phone.required": "Le numéro de téléphone est obligatoire",
    "email.required": "L'email est obligatoire",
    "password.required": "Le mot de passe est obligatoire",
    "role.required": "Le role est obligatoire",
    "role.enum": "Le role doit etre ADMIN ou USER",
    "phone.unique": "Cet utilisateur existe déja",
    "email.unique": "Cet utilisateur existe déja",
  }
}
