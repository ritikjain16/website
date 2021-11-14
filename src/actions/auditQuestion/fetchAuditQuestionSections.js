import gql from 'graphql-tag'
import duck from '../../duck'

const fetchAuditQuestionSections = async (auditType) =>
  duck.query({
    query: gql`
    {
      auditQuestionSections(filter:{ auditType: ${auditType} }) {
          id
          order
          title
      }
      auditQuestionSubSections(filter:{ auditType: ${auditType} }) {
          id
          title
          order
      }
    }
    `,
    type: 'auditQuestionSections/fetch',
    key: 'auditQuestionSections',
  })

export default fetchAuditQuestionSections

