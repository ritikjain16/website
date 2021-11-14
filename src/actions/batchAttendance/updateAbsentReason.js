import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateBatchSession = async ({ batchSessionId, input, key }) => {
  duck.query({
    query: gql`
    mutation($input: BatchSessionUpdate) {
      updateBatchSession(id: "${batchSessionId}", input: $input) {
        id
        sessionStatus
        bookingDate
        sessionStartDate
        sessionEndDate
        sessionAllotmentDate
        sessionRecordingLink
        sessionCommentByMentor
        mentorPaymentJustification
        createdAt
        attendance {
          student {
            id
            user {
              id
              username
              name
            }
            parents {
              user {
                username
                name
                email
                phone {
                  number
                }
              }
            }
          }
          isPresent
          status
          absentReason
        }
        topic {
          id
          title
        }
        batch {
          id
          code
          school {
            id
            name
          }
          course {
            title
          }
          allottedMentor {
            id
            username
            name
            email
            inviteCode
            phone {
              number
            }
          }
          students {
            id
            user {
              id
            }
          }
          description
          studentsMeta {
            count
          }
        }
        ${getSlotNames()}
      }
    }
  `,
    variables: {
      input,
      callBatchAPI: true
    },
    type: 'batchSession/update',
    key: key ? `batchSession/${key}` : 'batchSession',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.batchSessions = {
        ...get(originalData, 'updateBatchSession')
      }
      return extractedData
    }
  })
}

export default updateBatchSession
