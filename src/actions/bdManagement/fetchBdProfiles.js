/* eslint-disable max-len */
import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchBdprofiles = async ({ filterQuery, perPage = 10, skip = 0 }) =>
  duck.query({
    query: gql`
      {
      bdeProfiles(filter:{ and: [ ${filterQuery || ''} ] }
      first: ${perPage}
      skip: ${perPage * skip}
      ) {
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
          studentsMeta {
            count
          }
        }
      }
      bdeProfilesMeta(filter:{ and: [ ${filterQuery || ''} ] }) {
        count
      }
    }
    `,
    type: 'bdeProfiles/fetch',
    key: 'bdeProfiles',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.schools = []
      extractedData.user = []
      extractedData.bdeProfiles = get(originalData, 'bdeProfiles', [])
      return { ...extractedData }
    },
  })

export default fetchBdprofiles

