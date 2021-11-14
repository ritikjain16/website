import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchTopicsForChapters = async (courseId) =>
  duck.query({
    query: gql`
        {
        topics(filter: { courses_some: { id: "${courseId}" } }) {
          id
          title
        }
      }
    `,
    type: 'topics/fetch',
    key: `topics/${courseId}`,
  })

export default fetchTopicsForChapters

