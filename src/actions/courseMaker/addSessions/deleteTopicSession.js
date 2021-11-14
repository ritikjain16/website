import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteTopicSession = async (id) => duck.query({
  query: gql`
    mutation {
        deleteTopic(id: "${id}") {
            id
        }
    }
  `,
  type: 'topics/delete',
  key: 'topics',
})

export default deleteTopicSession
