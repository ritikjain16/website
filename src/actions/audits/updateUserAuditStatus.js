import gql from 'graphql-tag'
import duck from '../../duck'

const updateUserAuditStatus = async ({ userId, isPreSalesAudit = false, auditType }) =>
  duck.query({
    query: gql`
    mutation{
      updateUser(id:"${userId}", input: { isPreSalesAudit: ${isPreSalesAudit} }) {
        id
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
    }
    `,
    type: 'user/update',
    key: `user/${auditType}`,
  })

export default updateUserAuditStatus
