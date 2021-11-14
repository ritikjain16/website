import config from '../config/serverConfig'

const getFullPath = file => {
  if (file) {
    /** if the file already has the fileBaseUrl information i.e,
     * in the case of a updated file simply return the uri else add the fileBaseUrl */
    if (file.includes(config.fileBaseUrl) || file.includes(config.cloudFrontBaseUrl)) {
      return file
    }
    /** Not appending Date here helps in caching of files */
    return `${config.fileBaseUrl}/${file}`
  }
  return null
}

export default getFullPath
