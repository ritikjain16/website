import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const addSchool = async ({ selectedBd, ...input }) =>
  duck.query({
    query: gql`
        mutation addSchool($input: SchoolInput!) {
        addSchool(
          input: $input
          ${selectedBd ? `bdeConnectId: "${selectedBd}"` : ''}
        ){
          id
          name
          coordinatorName
          code
          hubspotId
          logo {
            id
            uri
          }
          schoolPicture {
            id
            uri
          }
          admins {
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
          bde {
            id
            user {
              id
              name
            }
          }
          coordinatorEmail
          coordinatorPhone {
            countryCode
            number
          }
          coordinatorRole
          city
          createdAt
        }
      }
        `,
    variables: {
      input
    },
    type: 'schools/add',
    key: 'schools',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.user = []
      extractedData.schools = {
        ...get(originalData, 'addSchool')
      }
      return { ...extractedData }
    },
  })
export default addSchool
