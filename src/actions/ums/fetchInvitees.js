import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const getQuery = (invitedBy, perPage, skip, filterQuery) => gql`{
  totalUserInvites: userInvitesMeta(
    filter:{
      and: [
        {
          invitedBy_some:{
            id: "${invitedBy}"
          }
        }
        ${!filterQuery ? '' : `{acceptedBy_some: ${filterQuery}}`}
      ]
    }
  ){
    count
  },
  userInvites(filter:{
    and: [
        {
          invitedBy_some:{
            id: "${invitedBy}"
          }
        }
        ${!filterQuery ? '' : `{acceptedBy_some: ${filterQuery}}`}
      ]
  },
  orderBy: createdAt_DESC,
  first: ${perPage},
  skip: ${(skip - 1) * perPage}
  ){
    id
    acceptedBy{
      id
      name
      studentProfile{
        id
        grade
        parents{
          id
          user{
            id
            email
            name
            phone{
              number
              countryCode
            }
          }
        }
      }
      fromReferral
    }
  }
}`

const fetchUsers = async ({ invitedBy, perPage, skip, filterQuery }) =>
  duck.query({
    query: getQuery(invitedBy, perPage, skip, filterQuery),
    type: 'userInvites/fetch',
    key: 'userInvites',
    changeExtractedData: (extractedData, originalData) => ({
      userInvites: {
        invites: get(originalData, 'userInvites'),
        count: get(originalData, 'totalUserInvites')
      }
    })
  })

export default fetchUsers
