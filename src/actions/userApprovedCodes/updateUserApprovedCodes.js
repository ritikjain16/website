import gql from 'graphql-tag'
// import { get } from 'lodash'
import duck from '../../duck'

const updateUserApprovedCode = async (id, input) => duck.query({
  query: gql`
    mutation($input:UserApprovedCodeUpdate!) {
      updateUserApprovedCode (input: $input, id: "${id}" ) {
        id
        status
        approvedDescription
        approvedFileName
        approvedCode
        userApprovedCodeTagMappings{
        userApprovedCodeTag {
            title
            codeCount
            id
        }
        id
        }
      }
    }
  `,
  variables: {
    input
  },
  type: 'updateUserApprovedCode/update',
  key: 'updateUserApprovedCode'
})

export default updateUserApprovedCode
