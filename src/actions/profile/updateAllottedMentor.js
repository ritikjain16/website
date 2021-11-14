import gql from 'graphql-tag'
import duck from '../../duck'

const updateAllottedMentor = async (id, mentorId, input = {}) => duck.query({
  query: gql`
  mutation($input:SalesOperationUpdate) {
      updateSalesOperation(id: "${id}", allottedMentorConnectId: "${mentorId}", input:$input) {
        id
        allottedMentor {
          id
          name
          username
        }
        client {
          id
          name
          username
        }
      }
    }
  `,
  type: 'salesOperation/update',
  key: `salesOperation/${id}`,
  variables: {
    input
  }
})

export default updateAllottedMentor
