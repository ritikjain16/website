import gql from 'graphql-tag'
import duck from '../../duck'

const deleteAuditQuestion = async ({ auditQuestionId }) =>
  duck.query({
    query: gql`
    mutation {
        deleteAuditQuestion(id: "${auditQuestionId}") {
            id
        }
    }
    `,
    type: 'auditQuestions/delete',
    key: 'auditQuestions',
  })

export default deleteAuditQuestion
