import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const getFilters = (id, date) => {
  let filter = ''
  if (id) {
    filter = `user_some:{id:"${id}"}`
  } else if (date) {
    filter = `bookingDate:"${date}"`
  }

  return filter
}

const fetchMenteeSessions = async (skipCount, id, date) => duck.query({
  query: gql`
    query {
        menteeSessions(filter: {
            and: [
              {${getFilters(id, date)}}
              {source_not:school}
            ]
        }
        orderBy: bookingDate_ASC) {
        id
        createdAt
        updatedAt
        bookingDate
        user {
          id
          name
          username
          studentProfile {
            id
            grade
            parents{
              id
              user{
                id
                name
                email
                phone{
                  number
                  countryCode
                }
              }
            }
          }
        }
        ${getSlotNames()}
    }
  }
  `,
  type: 'menteeSession/fetch',
  key: date ? `menteeSession/${new Date(date).setHours(0, 0, 0, 0)}` : 'menteeSession'
})

export default fetchMenteeSessions
