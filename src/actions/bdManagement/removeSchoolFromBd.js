import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const removeSchoolFromBd = async ({ schoolId, bdProfileId }) =>
  duck.query({
    query: gql`
    mutation {
      removeFromBDEProfileSchool(schoolId: "${schoolId}", bdeProfileId: "${bdProfileId}") {
        bdeProfile {
          id
          createdAt
          user {
            id
            name
            email
            phone {
              number
              countryCode
            }
          }
          schools {
            id
            name
            city
            country
            createdAt
            enrollmentType
            coordinatorName
            coordinatorEmail
            coordinatorPhone {
              number
              countryCode
            }
          }
        }
      }
    }
    `,
    type: 'bdeProfiles/update',
    key: 'bdeProfiles',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.schools = []
      extractedData.user = []
      extractedData.bdeProfiles = {
        ...get(originalData, 'removeFromBDEProfileSchool.bdeProfile'),
      }
      return { ...extractedData }
    },
  })

export default removeSchoolFromBd
