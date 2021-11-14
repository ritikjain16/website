/* eslint-disable no-console */
import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchMenteeWithSessions = async (date, slotTime, force = false) => duck.query({
  query: gql`
    query {
        menteeSessions(filter: {
            and: [
              {bookingDate: "${new Date(new Date(date).setHours(0, 0, 0, 0))}"}
              {slot${slotTime}: true}
              {topic_some: {order: 1}}
              {source_not_in:[school]}
            ]
        }) {
        id
        course {
          id
        }
        topic {
            id
            order
        }
        user {
          id
          name
          role
          createdAt
          gender
          verificationStatus
          country
          timezone
          source
          studentProfile {
            grade
            parents {
                user {
                    id
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
  `,
  type: 'menteeSession/fetch',
  key: `menteeSession/${new Date(date).setHours(0, 0, 0, 0)}/${slotTime}`,
  force,
  changeExtractedData: (extractedData, originalData) => {
    if (get(extractedData, 'user') && get(originalData, 'menteeSessions')) {
      extractedData.user.forEach((_u, index) => {
        const session = originalData.menteeSessions.filter(_s => get(_s, 'user.id') === _u.id) || []
        if (session && session.length) {
          extractedData.user[index].course = get(session, '0.course.id')
          extractedData.user[index].sessionId = get(session, '0.id')
          extractedData.user[index].topic = get(session, '0.topic')
        }
      })
    }
    return extractedData
  }
})

export default fetchMenteeWithSessions
