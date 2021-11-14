import uploadFile from '../utils/uploadFile'
import removePosterFromCampaign from './removePosterFromCampaign'

const addPosterToCampaign = async ({
  file,
  typeField,
  campaignId,
  prevFileId
}) => {
  if (campaignId) {
    if (file) {
      const mappingInfo = file && {
        typeId: campaignId,
        type: 'Campaign',
        typeField
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          if (typeField === 'posterMobile') {
            removePosterFromCampaign(campaignId, prevFileId, typeField).then(() => {
              uploadFile(file, fileInfo, mappingInfo)
            })
          } else {
            removePosterFromCampaign(campaignId, prevFileId).then(() => {
              uploadFile(file, fileInfo, mappingInfo)
            })
          }
        } else {
          uploadFile(file, fileInfo, mappingInfo)
        }
      }
    }
  }
  return {}
}

export default addPosterToCampaign
