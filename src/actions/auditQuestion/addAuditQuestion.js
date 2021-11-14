import gql from 'graphql-tag'
import duck from '../../duck'

const addAuditQuestion = async ({ input, sectionId, subSectionId }) =>
  duck.query({
    query: gql`
    mutation($input: AuditQuestionInput!) {
        addAuditQuestion(input: $input, ${sectionId ? `sectionConnectId: "${sectionId}"` : ''}, ${subSectionId ? `subSectionConnectId: "${subSectionId}"` : ''}) {
          id
          order
          score
          statement
          maxRating
          questionType
          isMandatory
          auditType
          auditSubType
          description
          section {
            id
            title
          }
          subSection{
            id
            title
          }
          mcqOptions {
            statement
            isCorrect
          }
          ratingDisplayType
          timestampTags {
            order
            title
          }
          status
          createdAt
          updatedAt
        }
        }
    `,
    variables: {
      input
    },
    type: 'auditQuestions/add',
    key: 'auditQuestions',
  })

export default addAuditQuestion
