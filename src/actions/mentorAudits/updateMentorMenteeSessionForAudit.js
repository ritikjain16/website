import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateMentorMenteeSessionForAudit = async (mentorMenteeSessionId, checked, type) =>
  duck.query({
    query: gql`
    mutation {
  updateMentorMenteeSession(id: "${mentorMenteeSessionId}", ${type ? `input: { isPostSalesAudit: ${checked} }` : `input: { isAudit: ${checked} }`}) {
    id
      country
      sessionStartDate
      sessionEndDate
      sessionStatus
      isSubmittedForReview
      isFeedbackSubmitted
      sessionRecordingLink
      rating
      comment
      sendSessionLink
      leadStatus
      isPostSalesAudit
      isAudit
      source
      createdAt
      topic {
      id
      title
      order
      }
      mentorSession {
      id
      user {
          id
          name
          username
          phone {
          countryCode
          number
          }
      }
      }
      menteeSession {
      id
      bookingDate
      ${getSlotNames()}
      user {
          id
          name
          timezone
          country
          studentProfile {
          parents {
              user {
              name
              email
              phone {
                  countryCode
                  number
              }
              }
          }
          }
      }
  }
}
}
  `,
    type: 'mentorMenteeSessionsForAudit/update',
    key: 'mentorMenteeSessionsForAudit',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.completedSession = []
      extractedData.menteeSession = []
      extractedData.topic = []
      extractedData.user = []
      extractedData.mentorMenteeSessionsForAudit = {
        ...get(originalData, 'updateMentorMenteeSession', [])
      }
      return { ...extractedData }
    }
  })

export default updateMentorMenteeSessionForAudit
