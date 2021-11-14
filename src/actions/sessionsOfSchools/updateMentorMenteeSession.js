import gql from 'graphql-tag'
import duck from '../../duck'

const updateMentorMenteeSession = async (id, input) => {
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
            }
          }
        }
     `,
    variables: {
      input
    },
    type: 'completedSession/update',
    key: 'updateCompletedSession'
  })
}

export default updateMentorMenteeSession
