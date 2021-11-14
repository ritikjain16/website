import uploadFile from '../../utils/uploadFile'
import removeFromChapterThumbnail from './removeFromChapterThumbnail'

const addThumbnailToChapter = async ({
  file,
  chapterId,
  prevFileId,
}) => {
  let data = {}
  if (chapterId) {
    if (file) {
      const mappingInfo = file && {
        typeId: chapterId,
        type: 'Chapter',
        typeField: 'thumbnail'
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          await removeFromChapterThumbnail(chapterId, prevFileId).then(async () => {
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

export default addThumbnailToChapter
