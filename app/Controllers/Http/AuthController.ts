import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
    public async login({ auth, request, response }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')
    
        try {
          const data = await auth.use('api').attempt(email, password, { expiresIn: '30 mins' })
          return response.ok({
            error: false,
            token: data.token,
            data: {
              user: data.user,
            },
          })
        } catch {
          return response.ok({
            error: true,
            message: 'Identifiants de connexion invalides.',
          })
        }
      }
      public async profile({ auth, response }: HttpContextContract) {
        try {
          console.log(auth.user)
          if (!auth.user) {
            return response.unauthorized({
              error: true,
              message: 'Invalid credentials',
            })
          } else {
            return response.ok({
              error: false,
              data: {
                user: auth.user,
              },
            })
          }
        } catch {
          return response.unauthorized({
            error: true,
            message: 'Invalid credentials',
          })
        }
      }
    
}
