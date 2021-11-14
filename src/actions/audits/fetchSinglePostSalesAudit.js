import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchSinglePostSalesAudit = async (postSalesAuditId) => duck.query({
  query: gql`
    {
        postSalesAudit(id: "${postSalesAuditId}") {
            id
            overallClassComment
            score
            customScore
            totalScore
            status
            auditAudioFile {
              id
              uri
            }
            auditor{
              id
              name
            }
            timestampAnswer {
              id
              startTime
              endTime
              isGood
              needWork
              rude
              distracted
              dormant
              comment
              auditQuestion {
                id
              }
              answerTimestampTags {
                title
                order
              }
            }
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
  type: 'postSalesAudit/fetch',
  key: 'postSalesAudit',
  changeExtractedData: (extractedData, originalData) => {
    extractedData.menteeSession = []
    extractedData.mentorSessions = []
    extractedData.user = []
    extractedData.postSalesAudit = get(originalData, 'postSalesAudit')
    return { ...extractedData }
  }
})

export default fetchSinglePostSalesAudit

