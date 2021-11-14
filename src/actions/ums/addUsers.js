import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const addUser = async input => duck.query({
  query: gql`
      mutation addUser($input: UserInput!) {
        addUser(input: $input) {
          id
          name
          username
          email
          role
          phone {
            countryCode
            number
          }
          status
          gender
          timezone
          country
          dateOfBirth
          createdAt
          updatedAt
          savedPassword
          fromReferral
        }
      }
    `,
  variables: {
    input
  },
  type: 'user/add',
  key: 'user',
  changeExtractedData: (extractedData) => ({
    ...extractedData,
    userForDashBoard: get(extractedData, 'user')
  })
})

export default addUser
