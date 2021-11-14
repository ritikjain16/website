import gql from 'graphql-tag'
import duck from '../../duck'

const updateStudentProfile = async (id, input) => duck.query({
  query: gql`
    mutation($input:StudentProfileUpdate!) {
      updateStudentProfile (input: $input, id: "${id}" ) {
        id
        profileAvatarCode
      }
    }
  `,
  variables: {
    input
  },
  type: 'userSavedCodes/update',
  key: 'updateUserSavedCodes',
})

export default updateStudentProfile
