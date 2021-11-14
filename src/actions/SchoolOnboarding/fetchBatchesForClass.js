import gql from 'graphql-tag'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const fetchBatchesForClass = async (classIds) =>
  duck.query({
    query: gql`
    {
        batches(filter: { classes_some: { id_in:[${getIdArrForQuery(classIds)}] } }) {
          id
          code
        }
        batchesMeta(
          filter: { classes_some: { id_in:[${getIdArrForQuery(classIds)}] } }
        ) {
          count
        }
    }
    `,
    type: 'batches/fetch',
    key: 'fetchBatchesForClass',
  })

export default fetchBatchesForClass

