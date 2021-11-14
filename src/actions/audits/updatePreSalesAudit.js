import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const updatePreSalesAudit = async ({ auditId, auditorConnectId, preSalesUserid, input = {} }) =>
  duck.query({
    query: gql`
    mutation($input: PreSalesAuditUpdate) {
        updatePreSalesAudit(id: "${auditId}",
        ${auditorConnectId || ''},
        ${preSalesUserid ? `preSalesUserConnectId: "${preSalesUserid}"` : ''}
        input: $input
        ) {
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
            }
            status
            score
            customScore
            totalScore
            createdAt
            updatedAt
        }
    }
    `,
    variables: {
      input
    },
    type: 'preSalesAudits/update',
    key: 'preSalesAudits',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.preSalesAudits = {
        ...get(originalData, 'updatePreSalesAudit')
      }
      return { ...extractedData }
    }
  })

export default updatePreSalesAudit
