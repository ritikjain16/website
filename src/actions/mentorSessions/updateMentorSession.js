import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateMentorSession = async (input, id) => (
  duck.query({
    query: gql`
     mutation($input:MentorSessionUpdate!){
        updateMentorSession(id:"${id}",input:$input) {
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
    type: 'mentorSessions/update',
    key: 'updateMentorSession',
  })
)

export default updateMentorSession
