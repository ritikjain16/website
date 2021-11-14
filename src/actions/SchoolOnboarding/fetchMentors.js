import gql from 'graphql-tag'
import duck from '../../duck'

const fetchMentors = async () =>
  duck.query({
    query: gql`
    {
        users(filter: { role: mentor }) {
            id
            name
        }
    }
    `,
    type: 'mentors/fetch',
    key: 'mentors',
  })

export default fetchMentors

