import gql from 'graphql-tag'
import duck from '../../duck'

const getExtraFilter = (topicId) => {
  if (topicId) {
    return `topicConnectId:"${topicId}"`
  }

  return ''
}

const addSalesOperationLog = async (userId, input, topicId) => {
  duck.query({
    query: gql`
        mutation($input:SalesOperationLogInput!){
          addSalesOperationLog
  (input:$input, loggedByConnectId:"${userId}",${getExtraFilter(topicId)})
  {
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
    type: 'salesOperationLog/add',
    key: 'salesOperationLogAdd'
  })
}

export default addSalesOperationLog
