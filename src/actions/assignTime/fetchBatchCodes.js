import gql from 'graphql-tag'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const fetchBatchCodes = async (batchId, typeFilter) =>
  duck.query({
    query: gql` 
      query{
    batches(
      filter:{
        and:[
          ${!batchId ? '' : `{
            allottedMentor_some:{
              id_in:[${getIdArrForQuery([batchId])}]
            }}`}
            ${!typeFilter ? '' : typeFilter}
        ]
      },
      orderBy : code_DESC
    ) {
      id
      code
      type
      course{
        id
      }
      allottedMentor{
        name
        username
        id
      }
    }
  }
    `,
    type: 'batches/fetch',
    key: 'batches',
    changeExtractedData: (extractedData, originalData) => {
      if (originalData.batches.length === 0) {
        extractedData.batches = []
      }
      return extractedData
    }
  })


export default fetchBatchCodes
