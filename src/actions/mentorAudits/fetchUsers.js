import { get } from 'lodash'
import gql from 'graphql-tag'
import duck from '../../duck'

const fetchUsers = async (filterQuery, salesUser, addSalesUser) =>
  duck.query({
    query: gql`
        query{
            users(
              filter:{
                and:[
                  {role_in: ${salesUser && addSalesUser ? [salesUser] : '[admin,umsAdmin,mentor,salesExecutive,auditAdmin,auditor]'}},
                  ${filterQuery}
                ]
              }
            ) {
                id
                role
                name
                email
                phone {
                  countryCode
                  number
                }
            }
        }
  `,
    type: 'users/fetch',
    key: 'users',
    changeExtractedData: (extractedData) => ({
      ...extractedData,
      usersForAudits: get(extractedData, 'user', [])
    })
  })

export default fetchUsers
