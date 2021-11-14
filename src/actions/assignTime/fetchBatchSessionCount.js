import gql from 'graphql-tag'
import duck from '../../duck'

const fetchBatchSessionCount = (batchCode) => {
  duck.query({
    query: gql`
      query batchSessionsCount{
  batchSessionsMeta(
    filter:{
      and: [
        {batch_some:{code:"${batchCode}"}}
      ]
    }
  ){
    count
  }
}

  `,
    type: 'batchSessionsMeta/fetch',
    key: 'batchSessionsMeta'
  })
}

export default fetchBatchSessionCount
