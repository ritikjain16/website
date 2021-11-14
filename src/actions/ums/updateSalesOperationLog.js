import gql from 'graphql-tag'
import duck from '../../duck'

const updateSalesOperationLog = async (id, input) => {
  duck.query({
    query: gql`
        mutation($input:SalesOperationLogUpdate!){
          updateSalesOperationLog(id:"${id}",input:$input) {
            id
            loggedBy{
              id
              name
            }
            salesOperation{
              id
            }
            log
            createdAt
            updatedAt
            type
            topic {
              id
            }
          }
        }
  `,
    variables: {
      input
    },
    type: 'salesOperationLog/update',
    key: 'salesOperationLogUpdate'
  })
}

export default updateSalesOperationLog
