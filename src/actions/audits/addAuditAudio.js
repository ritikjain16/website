import { auditType } from '../../constants/auditQuestionConst'
import uploadFile from '../utils/uploadFile'
import removeAudioFromAuditDocument from './removeAudioFromAuditDocument'

const addAuditAudio = async ({
  file,
  auditTypeValue,
  auditId,
  prevFileId
}) => {
  let data = {}
  if (auditId) {
    if (file) {
      const mappingInfo = {
        typeId: auditId,
        type: auditTypeValue === auditType.preSales ? 'PreSalesAudit' : 'PostSalesAudit',
        typeField: 'auditAudioFile'
      }
      const fileInfo = {
        fileBucket: 'python'
      }
      if (file) {
        if (prevFileId) {
          await removeAudioFromAuditDocument(auditId, prevFileId, auditTypeValue).then(async () => {
            await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
          })
        } else {
          await uploadFile(file, fileInfo, mappingInfo).then(res => data = res)
        }
      }
      return data
    }
  }
}

export default addAuditAudio
