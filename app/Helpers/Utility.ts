export default class Utility {

   public static PAYPAL_FEES_RATIO = 0.17;
     public static _ACTIVE = 1;
     public static _NOTACTIVE = 0;
     public static _DELETE = 2;
     public static _SUSPENSED = 3;
     public static _CANCEL = 4;

       /************** FOLDERS **************/
    public static  USER_FEEDBACK_FOLDER = "images/users/feedback/";
    public static  USER_GROUP_FOLDER = "images/users/groups/";
    public static  USER_PROFILE_FOLDER = "images/users/%1/profile/";
    public static  USER_FAROTI_FOLDER = "images/users/%1/farotis/";
    public static  USER_ORDER_FOLDER = "images/users/orders/";
    public static  USER_PARTNER_FOLDER = "images/users/partners/";
    public static  USER_CHAT_FOLDER = "images/users/%1/chats/";
    public static  USER_PROFILE_AVATAR = "images/avatar/avatar.png";
    public static  USER_DEFAULT_AVATAR = "images/avatar/default.png";

  public static APP_MODE_ANDROID = 1
  public static APP_MODE_IOS = 2
  public static APP_MODE_WEB = 3
  public static APP_MODE_API = 4

  // private static $INDICATIF = 237
  private static $PHONELENTGH = 9
  // private static $PHONE_PATTERN = '/^[+]?(237)?(6)([0-9]{8})$/'

  public static PROFIL_USER = 0
  public static PROFIL_PIONNER = 1
  public static PROFIL_WORKER = 2
  public static PROFIL_PLANNER = 3
  public static PROFIL_OFFICIAL = 5
  public static PROFIL_SUPPORT = 6
  public static PROFIL_API = 7

  public static isEmail($email) {
    return true
  }

  public static shortPhoneNumber(phone: string): string {
    if (phone.length === Utility.$PHONELENTGH) {
      return phone
    } else if (phone[0] === '+') {
      return phone.substring(4, phone.length)
    }
    return phone.substring(3, phone.length)
  }

  public static isPhoneNumber(phone: string): boolean {
    return (
      Utility.isMTNNumber(phone) || Utility.isOrangeNumber(phone) || Utility.isNexttelNumber(phone)
    )
  }

  public static isNexttelNumber(phone: string): boolean {
    const number = Utility.shortPhoneNumber(phone)
    return number[1] === '6'
  }

  public static isMTNNumber(phone: string): boolean {
    const number = Utility.shortPhoneNumber(phone)
    if (number[1] === '7' || number[1] === '8') {
      return true
    } else if (number[1] === '5') {
      return ['0', '1', '2', '3', '4'].includes(number[2])
    }
    return false
  }

  public static isOrangeNumber(phone: string): boolean {
    const number = Utility.shortPhoneNumber(phone)
    if (number[1] === '9') {
      return true
    } else if (number[1] === '5') {
      return ['5', '6', '7', '8', '9'].includes(number[2])
    }
    return false
  }

  public static paymentType(phone: string): string {
    let paymentType = 'wallet'
    if (Utility.isOrangeNumber(phone)) {
      paymentType = 'om'
    } else if (Utility.isMTNNumber(phone)) {
      paymentType = 'momo'
    } else if (Utility.isEmail(phone)) {
      paymentType = 'paypal'
    }
    return paymentType
  }

  public static now() {
    return Date.now() / 1000
  }

  public static rplAccent(word: string): string {
    const utf8: Record<string, string> = {
      '/[áàâãªä]/u': 'a',
      '/[ÁÀÂÃÄ]/u': 'A',
      '/[ÍÌÎÏ]/u': 'I',
      '/[íìîï]/u': 'i',
      '/[éèêë]/u': 'e',
      '/[ÉÈÊË]/u': 'E',
      '/[óòôõºö]/u': 'o',
      '/[ÓÒÔÕÖ]/u': 'O',
      '/[úùûü]/u': 'u',
      '/[ÚÙÛÜ]/u': 'U',
      '/ç/': 'c',
      '/Ç/': 'C',
      '/ñ/': 'n',
      '/Ñ/': 'N',
      '/–/': '-', // UTF-8 hyphen to "normal" hyphen
      '/[’‘‹›‚]/u': ' ', // Literally a single quote
      '/[“”«»„!?.]/u': ' ', // Double quote
      '/ /': ' ', // nonbreaking space (equiv. to 0x160)
    }

    return word.replace(new RegExp(Object.keys(utf8).join('|'), 'g'), (match) => utf8[match])
  }
}
