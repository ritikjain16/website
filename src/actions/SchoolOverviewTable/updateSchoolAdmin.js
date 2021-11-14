import gql from 'graphql-tag'
import duck from '../../duck'

const updateSchoolAdmin = async (input, userId) =>
  duck.query({
    query: gql`
        mutation($input: UserUpdate) {
        updateUser(id: "${userId}", input: $input) {
            id
            name
            email
            createdAt
            username
            phone {
            countryCode
            number
            }
        }
        }
        `,
    variables: {
      input
    },
    type: 'users/update',
    key: 'users',
  })
export default updateSchoolAdmin
