import uploadFile from '../../utils/uploadFile'
import removeImageFromLo from './removeImageFromLo'

const addImageToLo = async ({
  file,
  loId,
  prevFileId,
  typeField,
}) => {
  let data = {}
  if (loId) {
    if (file) {
      const mappingInfo = file && {
        typeId: loId,
        type: 'LearningObjective',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          if (typeField === 'pqStoryImage') {
            await removeImageFromLo(loId, prevFileId, typeField).then(async () => {
              await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
            })
          } else {
            await removeImageFromLo(loId, prevFileId).then(async () => {
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

export default addImageToLo
