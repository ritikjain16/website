import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchTopicCount = async (courseId) =>
  duck.query({
    query: gql`
    {
      topicsMeta(filter: { courses_some: { id: "${courseId}" } }) {
        count
      }
    }
    `,
    type: 'topics/fetch',
    key: 'topicsCount',
  })

export default fetchTopicCount

