import axios from 'axios'

class DeploymentHelpers {
  public static baseUrl: string = process.env.BASE_URL ?? '' // Assurez-vous de définir la valeur correcte pour baseUrl

  public static async cpanelSubdomain(subdomain: string, parentDir: string = ''): Promise<string> {
    const whmUsername = process.env.WHM_USERNAME // Assurez-vous de définir la valeur correcte pour whmUsername
    const whmPassword = process.env.WHM_PASSWORD // Assurez-vous de définir la valeur correcte pour whmPassword
    const cpanelIp = 'server.waaza.tech' // IP de cPanel ou votre_domaine.com
    const domain = DeploymentHelpers.trimHttp(DeploymentHelpers.baseUrl)

    const query = `https://${cpanelIp}:2083/json-api/cpanel?cpanel_jsonapi_module=SubDomain&cpanel_jsonapi_func=addsubdomain&cpanel_jsonapi_apiversion=2&dir=/public_html/${parentDir}${subdomain}.${domain}/&rootdomain=${domain}&domain=${subdomain}`

    const config = {
      headers: {
        Authorization: `Basic ${Buffer.from(`${whmUsername}:${whmPassword}`).toString('base64')}`,
      },
    }

    try {
      const response = await axios.get(query, config)
      return response.data
    } catch (error) {
      console.error('Request error:', error)
      throw error
    }
  }

  public static trimHttp(param: string): string {
    return param.replace('https://', '').replace('http://', '').replace('/', '')
  }
}

export default DeploymentHelpers
