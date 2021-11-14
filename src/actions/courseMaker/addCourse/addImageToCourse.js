import uploadFile from '../../utils/uploadFile'
import removeFromCourseThumbnails from './removeImageFromCourse'

const addImageToCourse = async ({
  file,
  courseId,
  prevFileId,
  typeField,
}) => {
  let data = {}
  if (courseId) {
    if (file) {
      const mappingInfo = file && {
        typeId: courseId,
        type: 'Course',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          if (typeField === 'bannerThumbnail') {
            await removeFromCourseThumbnails(courseId, prevFileId, typeField).then(async () => {
              await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
            })
          } else {
            await removeFromCourseThumbnails(courseId, prevFileId).then(async () => {
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

export default addImageToCourse
