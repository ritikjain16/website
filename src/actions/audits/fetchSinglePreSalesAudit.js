import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchSinglePreSalesAudit = async (preSalesAuditId) => duck.query({
  query: gql`
    {
        preSalesAudit(id: "${preSalesAuditId}") {
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
            client{
                id
                name
                studentProfile {
                    id
                    parents {
                    id
                    user {
                        id
                        name
                    }
                    }
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
  type: 'preSalesAudit/fetch',
  key: 'preSalesAudit',
  changeExtractedData: (extractedData, originalData) => {
    extractedData.user = []
    extractedData.preSalesAudit = get(originalData, 'preSalesAudit')
    return { ...extractedData }
  }
})

export default fetchSinglePreSalesAudit

