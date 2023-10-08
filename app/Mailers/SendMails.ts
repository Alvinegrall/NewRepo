import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'

export default class SendMails extends BaseMailer {
  constructor(protected user: string, protected token: string) {
    super()
  }
  
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public prepare(message: MessageContract) {
    message
      .subject('Rapport mensuel des stocks')
      .from('Hydrac')
      .to(this.user)
      .htmlView('emails/raport', {
        token: this.token,
      })
  }
}
