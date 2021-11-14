import uploadFile from '../../utils/uploadFile'
import removeAssetFromVideo from './removeAssetFromVideo'

const addAssetToVideo = async ({
  file,
  videoId,
  prevFileId,
  typeField,
}) => {
  let data = {}
  if (videoId) {
    if (file) {
      const mappingInfo = file && {
        typeId: videoId,
        type: 'Video',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (prevFileId) {
        await removeAssetFromVideo(videoId, prevFileId, typeField).then(async () => {
          await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
        })
      } else {
        await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
      }
    }
  }
  return data
}

export default addAssetToVideo
