import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchPaidSession = async (
  id,
  date,
) => duck.query({
  query: gql`
    query {
      mentorSessions(filter:{
        and: [
          {sessionType: paid}
          {availabilityDate: "${date}"}
          ${id !== 'ALL' ? `{user_some: {id : "${id}"}}` : ''}
        ]
      }) {
        id
        course {
          id
        }
        availabilityDate
        ${getSlotNames()}
      }
    }
  `,
  type: 'session/fetch',
  key: `mentorSession/${id}/${new Date(date).setHours(0, 0, 0, 0)}`
})

export default fetchPaidSession
