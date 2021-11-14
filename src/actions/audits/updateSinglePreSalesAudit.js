import gql from 'graphql-tag'
import duck from '../../duck'

const updateSinglePreSalesAudit = async ({ auditId, input, section, auditorConnectId }) =>
  duck.query({
    query: gql`
    mutation($input: PreSalesAuditUpdate) {
        updatePreSalesAudit(id: "${auditId}",
        ${auditorConnectId ? `auditorConnectId:"${auditorConnectId}"` : ''}
        input: $input
        ) {
            id
            overallClassComment
            score
            customScore
            totalScore
            status
            client{
                id
                name
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
    variables: {
      input
    },
    type: 'preSalesAudit/update',
    key: `preSalesAudit/${section}`,
  })

export default updateSinglePreSalesAudit
