import gql from 'graphql-tag'
import duck from '../../duck'

const addSchoolAdmin = async (input, schoolId) =>
  duck.query({
    query: gql`
        mutation($input: UserInput!) {
          addUser(input: $input, schoolsConnectIds: ["${schoolId}"]) {
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
    type: 'users/add',
    key: 'users',
  })
export default addSchoolAdmin
