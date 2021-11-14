import uploadFile from '../../utils/uploadFile'
import removeFromTopicThumbnail from './removeThumbnailFromTopic'

const addThumbnailToTopic = async ({
  file,
  topicId,
  prevFileId,
  typeField
}) => {
  let data = {}
  if (topicId) {
    if (file) {
      const mappingInfo = file && {
        typeId: topicId,
        type: 'Topic',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          await removeFromTopicThumbnail(topicId, prevFileId, typeField).then(async () => {
            await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
          })
        } else {
          await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
        }
      }
    }
  }
  return data
}

export default addThumbnailToTopic
