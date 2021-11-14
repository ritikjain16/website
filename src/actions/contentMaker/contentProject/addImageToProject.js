import uploadFile from '../../utils/uploadFile'
import removeImageFromProject from './removeImageFromProject'

const addImageToProject = async ({
  file,
  projectId,
  prevFileId,
  typeField,
}) => {
  let data = {}
  if (projectId) {
    if (file) {
      const mappingInfo = file && {
        typeId: projectId,
        type: 'BlockBasedProject',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          if (typeField === 'externalPlatformLogo') {
            await removeImageFromProject(projectId, prevFileId, typeField).then(async () => {
              await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
            })
          } else {
            await removeImageFromProject(projectId, prevFileId).then(async () => {
              await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
            })
          }
        } else {
          await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
        }
      }
    }
  }
  return data
}

export default addImageToProject
