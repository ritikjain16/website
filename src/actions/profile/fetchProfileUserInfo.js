import gql from 'graphql-tag'
import duck from '../../duck'

const fetchUserCount = (role) => `usersMeta(filter: {
            role: ${role}
        }){
          count
        }`

const fetchProfileUserInfo = async (
  role,
  skipCount = 0,
  shouldFetchCount,
  shouldPaginate
) => duck.query({
  query: gql`{
        users(filter: {
            and: [
              {role: ${role}}
              {source_not:school}
            ]
        },
        orderBy: createdAt_DESC,
        ${shouldPaginate ? 'first: 20,' : ''}
        skip: ${skipCount}) {
        id
        name
        username
        email
        role
        phone{
            countryCode
            number
        }
        studentProfile {
          parents {
            user {
              id
              name
              username
              email
              phone {
                countryCode
                number
              }
            }
          }
        }
        status
        gender
        dateOfBirth
        createdAt
        updatedAt
        savedPassword
        fromReferral
      }
      ${shouldFetchCount ? fetchUserCount(role) : ''}
    }`,
  type: 'user/fetch',
  key: `user/${role}`
})

export default fetchProfileUserInfo
