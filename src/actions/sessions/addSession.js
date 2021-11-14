import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const addSession = async (input, mentorId, courseId, sessionType, count) => duck.query({
  query: gql`
     mutation($input:MentorSessionInput!){
        addMentorSession(input:$input,userConnectId:"${mentorId}",courseConnectId:"${courseId}") {
            id
            course {
              id
            }
            createdAt
            updatedAt
            availabilityDate
            user{
              id
              name
              username
            }
            ${getSlotNames()}
        }
     }
  `,
  variables: {
    input
  },
  type: 'session/add',
  key: `mentorSession/${sessionType}/${count}`,
  changeExtractedData: (extractedData, originalData) => {
    if (get(originalData, 'addMentorSession') && get(extractedData, 'session')) {
      extractedData.session.mentorName = get(originalData, 'addMentorSession.user.name') ||
            get(originalData, 'addMentorSession.user.username')
    }

    return extractedData
  }
})

export default addSession
