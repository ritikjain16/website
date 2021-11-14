import gql from 'graphql-tag'
import duck from '../../duck'

const fetchAuditQuestion = async (filterQuery) =>
  duck.query({
    query: gql`
      {
        auditQuestions(filter: { and: [${!filterQuery ? '' : filterQuery}] }) {
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
    type: 'auditQuestions/fetch',
    key: 'auditQuestions',
  })

export default fetchAuditQuestion

