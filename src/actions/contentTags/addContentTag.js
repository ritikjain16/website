import gql from 'graphql-tag'
import duck from '../../duck'


const addContentTag = async (input) =>
  duck.query({
    query: gql`
      mutation($input: ContentTagInput!) {
        addContentTag(
          input: $input
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
    type: 'contentTag/add',
    key: 'contentTags',
  })

export default addContentTag
