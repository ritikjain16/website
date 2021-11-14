import gql from 'graphql-tag'
import duck from '../../duck'

const fetchCourses = async () =>
  duck.query({
    query: gql`
    {
      courses(filter: { status: published }) {
        id
        title
      }
    }
    `,
    type: 'courses/fetch',
    key: 'courses',
  })

export default fetchCourses

