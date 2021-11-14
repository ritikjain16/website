import gql from 'graphql-tag'
import duck from '../../duck'

const deleteContentTag = async (id) => duck.query({
  query: gql`
      mutation {
      deleteContentTag(id: "${id}") {
      id
    }
  }
  `,
  type: 'contentTags/delete',
  key: 'deleteContentTag',
})

export default deleteContentTag
