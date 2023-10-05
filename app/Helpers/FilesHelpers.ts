import * as fs from 'fs'
import * as path from 'path'

class Deployment {
  public static baseUrl: string = '' // Assurez-vous de définir la valeur correcte pour baseUrl

  public static pathExt(param: string): string {
    const pathInfo = path.parse(param)
    return pathInfo.ext
  }

  public static fileName(param: string): string {
    const pathInfo = path.parse(param)
    return pathInfo.name
  }

  public static deleteDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      throw new Error(`${dirPath} doit être un répertoire existant`)
    }

    if (!dirPath.endsWith('/')) {
      dirPath += '/'
    }

    const files = fs.readdirSync(dirPath)
    for (const file of files) {
      const filePath = path.join(dirPath, file)
      if (fs.lstatSync(filePath).isDirectory()) {
        Deployment.deleteDir(filePath)
      } else {
        fs.unlinkSync(filePath)
      }
    }

    fs.rmdirSync(dirPath)
  }
}

export default Deployment
