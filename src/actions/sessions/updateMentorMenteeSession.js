import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateMentorMenteeSession = async (id, input, key) => {
  duck.query({
    query: gql`
        mutation($input:MentorMenteeSessionUpdate) {
          updateMentorMenteeSession(id:"${id}",input:$input) {
            id
            sessionStartDate
            sessionEndDate
            sessionStatus
            createdAt
            isSubmittedForReview
            isFeedbackSubmitted
            isAudit
            isPostSalesAudit
            course{
              id
              title
            }
            topic{
              id
              title
              order
            }
            mentorSession{
              id
              user{
                id
                name
                username
                phone{
                  countryCode
                  number
                }
                mentorProfile {
                  sessionLink
                }
              }
            }
            rating
            friendly
            motivating
            engaging
            helping
            enthusiastic
            patient
            conceptsPerfectlyExplained
            distracted
            rude
            slowPaced
            fastPaced
            notPunctual
            average
            boring
            poorExplanation
            averageExplanation
            comment
            sessionRecordingLink
            menteeSession{
              id
              bookingDate
              user{
                id
                name
              }
              ${getSlotNames()}
            }
          }
        }
     `,
    variables: {
      input
    },
    type: 'completedSession/update',
    key: key || 'updateCompletedSession',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.completedSession = {
        ...get(originalData, 'updateMentorMenteeSession')
      }
      if (get(originalData, 'updateMentorMenteeSession.topic')) {
        extractedData.completedSession.topic = {
          ...get(originalData, 'updateMentorMenteeSession.topic')
        }
      }
      if (get(originalData, 'updateMentorMenteeSession.menteeSession')) {
        for (let i = 0; i < 24; i += 1) {
          if (get(originalData, `updateMentorMenteeSession.menteeSession.slot${i}`)) {
            extractedData.completedSession.slotId = i
            break
          }
        }
      }
      if (get(originalData, 'updateMentorMenteeSession.mentorSession')) {
        extractedData.completedSession.mentorName = get(originalData, 'updateMentorMenteeSession.mentorSession.user.name')
      }
      localStorage.setItem('updatedMentorMenteeSession', get(originalData, 'updateMentorMenteeSession.id'))
      return extractedData
    }
  })
}

export default updateMentorMenteeSession
