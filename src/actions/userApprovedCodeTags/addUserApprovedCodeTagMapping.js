import gql from 'graphql-tag'
import duck from '../../duck'


const addUserApprovedCodeTagMapping = async (
  input = {},
  userApprovedCodeId,
  userApprovedCodeTagId
) =>
  duck.query({
    query: gql`
      mutation($input: UserApprovedCodeTagMappingInput!) {
        addUserApprovedCodeTagMapping(
            input: $input,
            userApprovedCodeConnectId: "${userApprovedCodeId}",
            userApprovedCodeTagConnectId: "${userApprovedCodeTagId}"
        ) {
            id
            userApprovedCode {
            id
            studentName
            }
            userApprovedCodeTag {
            id
            title
            }
        }
      }
    `,
    variables: {
      input,
    },
    type: 'userApprovedCodeTagMapping/add',
    key: 'userApprovedCodeTagMapping',
  })

export default addUserApprovedCodeTagMapping
