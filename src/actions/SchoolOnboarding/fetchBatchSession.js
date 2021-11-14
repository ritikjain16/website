import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchBatchSessions = async (batchId) =>
  duck.query({
    query: gql`
    {
        batchSessions(filter: { batch_some: { id: "${batchId}" } }) {
            id
            batch{
                id
            }
            topic {
                id
                title
            }
            bookingDate
            ${getSlotNames()}
        }
    }
    `,
    type: 'batchSessions/fetch',
    key: 'batchSessions',
    changeExtractedData: (extractedData, originalData) => {
      const batchSession = []
      if (originalData.batchSessions.length) {
        get(originalData, 'batchSessions', []).forEach(session => {
          if (get(session, 'batch.id') === batchId) {
            batchSession.push(session)
          }
        })
      }
      extractedData.batchSessions = batchSession
      return { ...extractedData }
    }
  })

export default fetchBatchSessions

