import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchCourseCount = async () =>
  duck.query({
    query: gql`
    {
        coursesMeta {
          count
        }
    }
    `,
    type: 'courses/fetch',
    key: 'coursesCount',
  })

export default fetchCourseCount

