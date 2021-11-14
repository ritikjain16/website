import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const updateSession = async (input, id, key) => {
  duck.query({
    query: gql`
     mutation($input:MentorSessionUpdate!){
        updateMentorSession(input:$input,id:"${id}") {
            id
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
    type: 'session/update',
    key: key || 'updateSession'
  })
}

export default updateSession
