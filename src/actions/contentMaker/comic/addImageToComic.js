import uploadFile from '../../utils/uploadFile'

const addImageToComic = async ({
  file,
  imageId,
}) => {
  let data = {}
  if (imageId) {
    if (file) {
      const mappingInfo = file && {
        typeId: imageId,
        type: 'ComicImage',
        typeField: 'image'
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
      }
    }
  }
  return data
}

export default addImageToComic
