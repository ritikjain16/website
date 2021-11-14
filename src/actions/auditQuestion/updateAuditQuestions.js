import gql from 'graphql-tag'
import duck from '../../duck'

const updateAuditQuestions = async ({ input }) =>
  duck.query({
    query: gql`
    mutation($input: [AuditQuestionsUpdate]!) {
      updateAuditQuestions(input: $input) {
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
    type: 'auditQuestions/update',
    key: 'auditQuestions/reorder',
  })

export default updateAuditQuestions
