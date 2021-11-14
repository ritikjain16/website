import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateBatchSessionForAudit = async (batchSessionId, checked) =>
  duck.query({
    query: gql`
    mutation {
      updateBatchSession(id: "${batchSessionId}", input: { isAudit: ${checked} }) {
        id
        sessionStartDate
        sessionEndDate
        sessionRecordingLink
        sessionCommentByMentor
        isAudit
        sessionStatus
        ${getSlotNames()}
        batch {
        id
        code
        school {
          id
          name
        }
        studentsMeta {
          count
        }
        type
        }
        mentorSession {
        id
        user {
            id
            name
            phone {
            number
            countryCode
            }
        }
        }
        topic {
        id
        order
        title
        }
      }
    }
  `,
    variables: {
      callBatchAPI: true
    },
    type: 'mentorMenteeSessionsForAudit/update',
    key: 'mentorMenteeSessionsForAudit',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.batch = []
      extractedData.batchSessions = []
      extractedData.topic = []
      extractedData.user = []
      extractedData.schools = []
      extractedData.mentorMenteeSessionsForAudit = {
        ...get(originalData, 'updateBatchSession', [])
      }
      return { ...extractedData }
    }
  })

export default updateBatchSessionForAudit
