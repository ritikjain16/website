import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const addMentorSession = async (input, mentorId, courseConnectId) => (
  duck.query({
    query: gql`
     mutation($input:MentorSessionInput!){
        addMentorSession(
            input:$input,
            userConnectId:"${mentorId}",
            ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
        ) {
            id
            course {
                id
                title
            }
            createdAt
            updatedAt
            availabilityDate
            sessionType
            user {
                id
                name
                email
                username
            }
            batchSessions{
                topic {
                    title
                }
                batch{
                    type
                    code
                }
                bookingDate
                ${getSlotNames()}
                sessionStatus
                attendance{
                    student{
                        id
                        user{
                            id
                            name
                        }
                    }
                    isPresent
                    status
                }
            }
            mentorMenteeSessions{
                id
                topic {
                    title
                    description
                }
                sessionStatus
                menteeSession{
                    bookingDate
                    user {
                        id
                        name
                    }
                    ${getSlotNames()}
                }
            }
        }
     }
  `,
    variables: {
      input
    },
    type: 'mentorSessions/add',
    key: 'mentorSessions',
  })
)

export default addMentorSession
