import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const getQuery = (batchId) => (
  gql`
 query lastSessionOfBatch   {
  batchSessions(filter: {batch_some: {id: "${batchId}"}}, orderBy: createdAt_DESC, first: 1, skip: 0) {
    topic {
      id
      order
    }
  }
  batches(filter: { id: "${batchId}" }) {
    id
    currentComponent {
      id
      currentTopic {
        id
        title
        order
      }
    }
  }
}
    `
)
const fetchLastSessionOfBatch = (batchId) => {
  duck.query({
    query: getQuery(batchId),
    type: 'lastSessionOfBatch/fetch',
    key: 'lastSessionOfBatch',
    changeExtractedData: (extractedData, originalData) => ({
      batchSessions: originalData.batchSessions.length === 0 ? [] : originalData.batchSessions,
      topic: originalData.batches.length === 0 ? [] : [get(originalData, 'batches[0].currentComponent.currentTopic')]
    })
  })
}

export default fetchLastSessionOfBatch
