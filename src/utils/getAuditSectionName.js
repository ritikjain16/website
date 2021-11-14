import { auditQuestionsSection } from '../constants/auditQuestionConst'

const {
  classQuality, interpersonalSkills,
  addTimestampSpecificComments, negativeTimestampSigns,
  processMonitoring, codingExercises, other
} = auditQuestionsSection

const getAuditSectionName = (section) => {
  let sectionTitle = ''
  if (section === classQuality) sectionTitle = 'Class Quality'
  else if (section === interpersonalSkills) sectionTitle = 'Interpersonal skills (Dealing with kids)'
  else if (section === addTimestampSpecificComments) sectionTitle = 'Add Timestamp Specific Comments'
  else if (section === negativeTimestampSigns) sectionTitle = 'Any of these signs during the class?'
  else if (section === processMonitoring) sectionTitle = 'Process Monitoring'
  else if (section === codingExercises) sectionTitle = 'Coding exercises'
  else if (section === other) sectionTitle = 'Other'
  return sectionTitle
}

export default getAuditSectionName
