import gql from 'graphql-tag'
import { auditType } from '../../constants/auditQuestionConst'
import duck from '../../duck'

const removeAudioFromAuditDocument = async (auditId, fileId, auditTypeValue) => duck.query({
  query: gql`
  mutation {
  ${auditTypeValue === auditType.preSales ? `removeFromPreSalesAuditAudioFile(preSalesAuditId: "${auditId}", fileId: "${fileId}") {
    preSalesAudit { id } }` : ''}
  ${auditTypeValue === auditType.postSales ? `removeFromPostSalesAuditAudioFile(postSalesAuditId: "${auditId}", fileId: "${fileId}") {
    postSalesAudit { id } }` : ''}
}
  `,
  type: `${auditTypeValue === auditType.preSales ? 'preSalesAudit' : 'postSalesAudit'}/fetch`,
  key: auditTypeValue === auditType.preSales ? 'removeFromPreSalesAuditAudioFile' : 'removeFromPostSalesAuditAudioFile',
})

export default removeAudioFromAuditDocument
