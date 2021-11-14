import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const deleteMentorSession = async (id) => (
  duck.query({
    query: gql`
     mutation {
    deleteMentorSession(id: "${id}") {
        id
        availabilityDate
        ${getSlotNames()}
    }
    }
  `,
    type: 'mentorSessions/delete',
    key: 'deleteMentorSession',
  })
)

export default deleteMentorSession
