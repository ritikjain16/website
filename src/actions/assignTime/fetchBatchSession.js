import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'


const getQuery = (batchCode, page, perPage) => (
  gql`
   {
  batchSessions(
    filter:{
      and:[
        {
          batch_some:{
           code: "${batchCode}"
          }
        }
      ]
    },
    first: ${perPage},
    skip: ${perPage * (page - 1)},
    orderBy: bookingDate_ASC
  ){
    id
    course {
      id
    }
    batch {
      id
      code
      allottedMentor{
        id
        name
      }
      course {
        id
      }
      currentComponent {
        id
        currentTopic {
          id
          title
        }
      }
    }
    createdAt
    topic {
      id
      title
      order
    }
    sessionStartDate
    sessionEndDate
    sessionRecordingLink
    sessionCommentByMentor
    sessionStatus
    mentorSession {
      user {
        name
        id
      }
    }
    bookingDate
    ${getSlotNames()}
  }
   batchSessionsMeta(
      filter:{
      and:[
        {
          batch_some:{
           code: "${batchCode}"
          }
        }
      ]
    },
    ){
      count
    }
}
    `
)

const fetchBatchSessions = (batchCode, pageQueries) => {
  const { page, perPage } = pageQueries
  duck.query({
    query: getQuery(batchCode, page, perPage),
    type: 'batchSessions/fetch',
    key: 'batchSessions',
    changeExtractedData: (extractedData, originalData) => {
      if (originalData.batchSessions.length === 0) {
        extractedData.batch = []
        extractedData.batchSessions = []
        extractedData.topic = []
        extractedData.user = []
      }
      extractedData.batchSessions = get(originalData, 'batchSessions', [])
      return extractedData
    }
  })
}

export default fetchBatchSessions
