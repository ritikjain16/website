import gql from 'graphql-tag'
import duck from '../../duck'

const fetchBatches = async (batchCode, key) =>
  duck.query({
    query: gql`
      query{
          batches(orderBy: createdAt_DESC,filter:{
            and: [
              {
                code_contains:"${batchCode}"
              }
            ]
            }){
            id
            code
          }
        }
    `,
    type: 'batch/fetch',
    key: `${key ? `fetchBatches/${key}` : 'fetchBatches'}`
  })
export default fetchBatches
