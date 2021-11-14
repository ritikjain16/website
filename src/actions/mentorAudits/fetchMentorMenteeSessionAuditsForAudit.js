import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchMentorMenteeSessionAuditsForAudit = async ({ filterQuery, fromBatchSession = false }) =>
  duck.query({
    query: gql`
    {
  mentorMenteeSessionAudits(filter: { and: [ ${filterQuery || ''} ] }) {
    id
    auditor {
      id
      name
      role
      email
    }
    ${fromBatchSession ? `batchSession {
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
    }` : `
        mentorMenteeSession {
        id
        sessionStartDate
        sessionEndDate
        sessionStatus
        isSubmittedForReview
        isFeedbackSubmitted
        sendSessionLink
        leadStatus
        isAudit
        source
        rating
        comment
        createdAt
        sessionRecordingLink
        country
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
    `}
    status
    score
    customScore
    totalScore
    createdAt
    updatedAt
  }
}
    `,
    type: 'mentorAudits/fetch',
    key: 'mentorAudits',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.mentorSessions = []
      extractedData.menteeSession = []
      extractedData.topic = []
      extractedData.user = []
      extractedData.mentorAudits = get(originalData, 'mentorMenteeSessionAudits', [])
      return { ...extractedData }
    }
  })

export default fetchMentorMenteeSessionAuditsForAudit

