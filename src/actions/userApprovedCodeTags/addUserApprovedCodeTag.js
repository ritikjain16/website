import gql from 'graphql-tag'
import duck from '../../duck'


const addUserApprovedCodeTag = async (input) =>
  duck.query({
    query: gql`
      mutation($input: UserApprovedCodeTagInput!) {
        addUserApprovedCodeTag(
          input: $input
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
    type: 'userApprovedCodeTags/add',
    key: 'userApprovedCodeTags',
  })

export default addUserApprovedCodeTag
