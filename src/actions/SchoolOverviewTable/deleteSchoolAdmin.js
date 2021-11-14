import gql from 'graphql-tag'
import duck from '../../duck'

const deleteSchoolAdmin = async (userId) =>
  duck.query({
    query: gql`
    mutation {
        deleteUser(id: "${userId}") {
            id
        }
    }
    `,
    type: 'users/delete',
    key: 'users',
  })
export default deleteSchoolAdmin
