import uploadFile from '../utils/uploadFile'
import removeFromSchoolImage from './removeImageFromSchool'

const addImageToSchool = async ({
  file,
  schoolId,
  typeField,
  prevFileId
}) => {
  let data = {}
  if (schoolId) {
    if (file) {
      const mappingInfo = file && {
        typeId: schoolId,
        type: 'School',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          await removeFromSchoolImage(schoolId, prevFileId, typeField).then(async () => {
            await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
          })
        } else {
          await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
        }
      }
    }
    return data
  }
}

export default addImageToSchool
