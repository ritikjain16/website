import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_MENTORS_LIST = () => gql`
  query {
    users(filter: { role: mentor }) {
      id
      role
      name
      email
      phone {
        countryCode
        number
      }
      mentorProfile {
        id
        salesExecutive {
          id
        }
      }
    }
  }
`

const fetchMentorsList = async () =>
  duck.query({
    query: FETCH_MENTORS_LIST(),
    type: 'users/fetch',
    key: 'users',
  })

export default fetchMentorsList
