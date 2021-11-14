import gql from 'graphql-tag'
import duck from '../../duck'


const updateUserApprovedCodeTag = async (id, input) =>
  duck.query({
    query: gql`
      mutation($input: UserApprovedCodeTagUpdate!) {
        updateUserApprovedCodeTag(
          input: $input,
          id: "${id}"
        ) {
            title
            codeCount
            id
            createdAt
            updatedAt
        }
      }
    `,
    variables: {
      input
    },
    type: 'userApprovedCodeTags/update',
    key: 'userApprovedCodeTags',
  })

export default updateUserApprovedCodeTag
