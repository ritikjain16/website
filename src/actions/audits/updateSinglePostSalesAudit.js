import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateSinglePostSalesAudit = async ({ auditId, input, section }) =>
  duck.query({
    query: gql`
    mutation($input:PostSalesAuditUpdate) {
        updatePostSalesAudit(id: "${auditId}"
        input: $input
        ) {
            id
            overallClassComment
            score
            customScore
            totalScore
            status
            customSectionScore {
            questionSection {
              id
              title
              order
            }
            customScore
            }
            mentorMenteeSession {
            id
            sessionStartDate
            sessionRecordingLink
            menteeSession {
                id
                ${getSlotNames()}
                user {
                id
                name
                }
            }
            mentorSession {
                id
                user {
                id
                name
                }
            }
            }
            auditQuestionsData: auditQuestions {
            mcqAnswers {
                statement
                isSelected
            }
            boolAnswers
            inputAnswer
            ratingAnswer
            customScore
            auditQuestion {
                id
                order
                statement
                score
                maxRating
                description
                section {
                  id
                  title
                  order
                }
                subSection {
                  id
                  title
                  order
                }
                questionType
                isMandatory
                mcqOptions {
                statement
                isCorrect
                }
                ratingDisplayType
                timestampTags {
                title
                showByDefault
                order
                }
            }
            }
        }
    }
    `,
    variables: {
      input
    },
    type: 'postSalesAudit/update',
    key: `postSalesAudit/${section}`,
    changeExtractedData: (extractedData) => {
      extractedData.menteeSession = []
      extractedData.mentorSessions = []
      extractedData.user = []
      return { ...extractedData }
    }
  })

export default updateSinglePostSalesAudit
