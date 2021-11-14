import gql from 'graphql-tag'
import duck from '../../duck'


const updateContentTag = async (id, input) =>
  duck.query({
    query: gql`
      mutation($input: ContentTagUpdate!) {
        updateContentTag(
          input: $input
          id: "${id}"
        ) {
            title
            status
            id
            createdAt
            updatedAt
        }
      }
    `,
    variables: {
      input
    },
    type: 'contentTags/update',
    key: 'contentTags',
  })

export default updateContentTag
