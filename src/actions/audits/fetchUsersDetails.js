import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import fetchPreSalesAudit from './fetchPreSalesAudit'

const fetchUsersDetails = async ({ filterQuery, auditType, perPage, skip }) =>
  duck.query({
    query: gql`
        {
          users(filter: { and: [{ role: mentee } ${filterQuery}] }
            first: ${perPage},
            skip: ${perPage * skip}
            ){
            id
            role
            name
            createdAt
            updatedAt
            isPreSalesAudit
            studentProfile {
              id
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
              }
            }
          }
          usersMeta(filter: { and: [{ role: mentee } ${filterQuery}] }){
            count
          }
        }
    `,
    type: 'user/fetch',
    key: `user/${auditType}`,
    changeExtractedData: (extractedData, originalData) => {
      let user = []
      if (get(originalData, 'users', []).length > 0) {
        user = get(originalData, 'users', [])
        const userIds = []
        get(originalData, 'users', []).forEach(userData => {
          userIds.push(`"${userData.id}"`)
        })
        if (userIds.length > 0) {
          fetchPreSalesAudit(userIds)
        }
      }
      extractedData.user = user
      return { ...extractedData }
    }
  })

export default fetchUsersDetails

