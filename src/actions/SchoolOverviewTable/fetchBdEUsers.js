import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'


const fetchBDEUsers = async () =>
  duck.query({
    query: gql`
    {
      users(filter: { and: [ { role: BDE }{ bdeProfile_exists: true }] }) {
        id
        name
        bdeProfile {
          id
        }
      }
    }`,
    type: 'users/fetch',
    key: 'bdUsers',
    changeExtractedData: (extractedData, originalData) => {
      const user = []
      get(originalData, 'users', []).forEach(userData => {
        user.push({
          ...userData,
          bdeId: get(userData, 'bdeProfile.id')
        })
      })
      extractedData.user = user
      return { ...extractedData }
    },
  })

export default fetchBDEUsers
