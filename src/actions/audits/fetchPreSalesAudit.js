import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const fetchPreSalesAudit = async (userIds, filterQuery) => duck.query({
  query: gql`
      {
        preSalesAudits(filter: { and: [ ${userIds ? `{ client_some: { id_in: [${userIds}] } }` : ''} ${filterQuery || ''} ] }) {
          id
          preSalesUser {
          id
          name
          }
          auditor {
          id
          name
          email
          role
          }
          client {
          id
          name
          studentProfile{
            id
            parents{
              id
              user{
                id
                name
              }
            }
          }
          }
          status
          score
          customScore
          totalScore
          createdAt
          updatedAt
        }
        ${filterQuery ? `preSalesAuditsMeta(filter: { and: [ ${filterQuery || ''} ] }) {
          count
        }` : ''}
      }
    `,
  type: 'preSalesAudits/fetch',
  key: 'preSalesAudits',
  changeExtractedData: (extractedData, originalData) => {
    extractedData.user = []
    const preSalesAudits = get(originalData, 'preSalesAudits', [])
    extractedData.preSalesAudits = preSalesAudits
    // if (filterQuery) {
    //   extractedData.userMeta = get(originalData, 'preSalesAuditsMeta')
    // }
    return { ...extractedData }
  }
})

export default fetchPreSalesAudit

