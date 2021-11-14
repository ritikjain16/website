import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const updateSchool = async (id, { selectedBd, ...input }) =>
  duck.query({
    query: gql`
      mutation updateSchool($input: SchoolUpdate){
        updateSchool(
          input: $input,
          id: "${id}",
          ${selectedBd ? `bdeConnectId: "${selectedBd}"` : ''}
        ){
          id
          name
          coordinatorName
          whiteLabel
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
          bde {
            id
            user {
              id
              name
            }
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
    type: 'schools/update',
    key: 'schools',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.user = []
      extractedData.schools = {
        ...get(originalData, 'updateSchool')
      }
      return { ...extractedData }
    },
  })

export default updateSchool
