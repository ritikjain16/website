import uploadFile from '../../utils/uploadFile'
import removeImageFromBadge from './removeImageFromBadge'

const addImageToBadge = async ({
  file,
  badgeId,
  prevFileId,
  typeField,
}) => {
  let data = {}
  if (badgeId) {
    if (file) {
      const mappingInfo = file && {
        typeId: badgeId,
        type: 'Badge',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (prevFileId) {
        await removeImageFromBadge(badgeId, prevFileId, typeField).then(async () => {
          await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
        })
      } else {
        await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
      }
    }
  }
  return data
}

export default addImageToBadge
