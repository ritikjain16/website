import gql from 'graphql-tag'
import { filter, get } from 'lodash'
import duck from '../../duck'

const addParentChild = async input => {
  duck.query({
    query: gql`
      mutation parentChildSignUp($input: ParentChildSignUpInput) {
        parentChildSignUp(input: $input) {
          id
          name
          token
          role
          email
          source
          phone {
            countryCode
            number
          }
          createdAt
          parentProfile {
            children {
              user {
                id
                source
                name
                country
                timezone
                studentProfile {
                  id
                  grade
                  parents{
                    id
                    user{
                      id
                      name
                      email
                      phone {
                        countryCode
                        number
                      }
                    }
                    hasLaptopOrDesktop
                  }
                }
              }
              school {
                id
                name
              }
            }
          }
        }
      }
    `,
    variables: {
      input,
      tokenType: 'appTokenOnly'
    },
    type: 'user/add',
    key: 'user',
    changeExtractedData: (extractedData, originalData) => {
      const { parentChildSignUp } = originalData
      const child = filter(get(parentChildSignUp, 'parentProfile.children'),
        singleChild => get(singleChild, 'user.name') === get(input, 'childName'))
      const temp = {
        id: get(child, '0.user.id'),
        role: 'mentee',
        name: get(input, 'childName'),
        email: get(parentChildSignUp, 'email'),
        phone: get(parentChildSignUp, 'phone'),
        studentProfile: get(child, '0.user.studentProfile')
      }
      return ({
        userForDashBoard: temp
      })
    }
  })
}

export default addParentChild

// {
//   "id": "ckjn64n6n00000vx6b5pxg0p1",
//   "name": "parent0001",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI
// 6eyJpZCI6ImNram42NG42bjAwMDAwdng2YjVweGcwcDEifSwiaWF0IjoxNjEwMDQzMTYzLCJleHAiOjE2NDE2MDA3NjN9.
// 7oOhY_Z9wJ-hWt7-C8teM1Tz4ZTwdmTwqT2ZNQv8v_o",
//   "role": "parent",
//   "email": "test0001@gmail.com",
//   "source": "website",
//   "phone": {
//     "countryCode": "+91",
//     "number": "8847073123"
//   },
//   "createdAt": "2021-01-07T18:12:42.758Z",
//   "parentProfile": {
//     "children": [
//       {
//         "user": {
//           "id": "ckjn64nba00020vx67ti07fsz"
//         },
//         "school": null
//       }
//     ]
//   }
// }
