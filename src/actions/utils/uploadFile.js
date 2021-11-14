import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import getFullPath from '../../utils/getFullPath'

const UPLOAD_FILE = gql`
mutation($fileInput: FileInput!, $connectInput: FileConnectInput!) {
  uploadFile(fileInput: $fileInput,
  connectInput: $connectInput
  ){
    id,
    name,
    uri
  }
}
`

const uploadFile = async (file, fileInfo, mappingInfo) => {
  const res = await requestToGraphql(UPLOAD_FILE,
    { file, fileInput: fileInfo, connectInput: mappingInfo })
  const uploadedFileInfo = get(res, 'data.uploadFile', null)
  /** When a file is updated,Appending the uri with Date.now() prevents browser to
   show the image with the same uri */
  const fileUri = `${getFullPath(
    uploadedFileInfo.signedUri ||
      uploadedFileInfo.uri
  )}?${Date.now()}`
  return { ...uploadedFileInfo, uri: fileUri }
}

export default uploadFile
