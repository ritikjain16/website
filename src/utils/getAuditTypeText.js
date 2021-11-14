import { auditSubTypes, auditType } from '../constants/auditQuestionConst'

const { b2cDemo, b2cPaid, b2b } = auditSubTypes

const { preSales, postSales, mentor } = auditType

const getAuditTypeText = (type) => {
  let text = ''
  if (type === preSales) text = 'Pre-Sales'
  else if (type === mentor) text = 'Mentor'
  else if (type === postSales) text = 'Post-Sales'
  return text
}

export const getAuditSubTypeText = (subType) => {
  let subTypeText = ''
  if (subType === b2b) subTypeText = 'B2B'
  else if (subType === b2cDemo) subTypeText = 'B2C-Demo'
  else if (subType === b2cPaid) subTypeText = 'B2C-Paid'
  return subTypeText
}

export default getAuditTypeText
