/* eslint-disable no-console */
import gql from 'graphql-tag'
import duck from '../../duck'

const fetchMentorsWithSessions = async (date, slotTime, force = false) => duck.query({
  query: gql`
    query {
        mentorSessions(filter: {
            and: [
              {availabilityDate: "${new Date(new Date(date).setHours(0, 0, 0, 0))}"}
              {slot${slotTime}: true}
              {sessionType: trial}
            ]
        }) {
        user {
          id
          name
          email
          country
          role
          phone {
            countryCode
            number
          }
        }
    }
  }
  `,
  type: 'mentorSession/fetch',
  key: date ? `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${slotTime}` : 'mentorSession',
  force
})

export default fetchMentorsWithSessions
