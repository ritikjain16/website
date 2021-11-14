import gql from 'graphql-tag'
import duck from '../../duck'


const deleteUserApprovedCodeTag = async (id) =>
  duck.query({
    query: gql`
      mutation {
        deleteUserApprovedCodeTag(id: "${id}") {
            title
            codeCount
            id
            createdAt
            updatedAt
        }
      }
    `,
    type: 'userApprovedCodeTags/delete',
    key: 'userApprovedCodeTags',
  })

export default deleteUserApprovedCodeTag
