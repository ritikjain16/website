import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchTopic = async (topicId) =>
  duck.query({
    query: gql`
    {
      topics(filter:{ id:"${topicId}" }) {
        id
        title
      }
    }
    `,
    type: 'topics/fetch',
    key: 'topics',
  })

export default fetchTopic

