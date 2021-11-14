import gql from 'graphql-tag'
import duck from '../../duck'


const deleteUserApprovedCodeTagMapping = async (id) =>
  duck.query({
    query: gql`
      mutation {
        deleteUserApprovedCodeTagMapping(id:"${id}") {
            id
            userApprovedCodeTag {
                title
                codeCount
                status
                id
            }
        }
    }
    `,
    type: 'userApprovedCodeTagMapping/delete',
    key: 'userApprovedCodeTagMapping',
  })

export default deleteUserApprovedCodeTagMapping
