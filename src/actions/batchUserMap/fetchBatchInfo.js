import gql from 'graphql-tag'
import { MENTOR, SALES_EXECUTIVE } from '../../constants/roles'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const fetchBatchInfo = async ({ first, skip, filter, typeFilter, role, mentorsId }) =>
  duck.query({
    query: gql`
      query {
         batchesMeta(filter: {and: [${!filter ? '' : filter}${!typeFilter ? '' : typeFilter},
        ${role === SALES_EXECUTIVE || role === MENTOR ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}` : ''}]}){
          count
          }
          batches(
          filter: {and: [${!filter ? '' : filter}${!typeFilter ? '' : typeFilter},
        ${role === SALES_EXECUTIVE || role === MENTOR ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}` : ''}]},
    first: ${first}, skip:${skip * first},
      orderBy:createdAt_DESC) {
          id
          code
          type
          createdAt
          students {
            id
            grade
            user {
              id
              name
            }
            parents {
              id
              user {
                name
                email
                phone {
                  number
                }
              }
            }
          }
          currentComponent {
            id
            currentTopic {
              id
              order
              title
            }
          }
          allottedMentor {
            id
            username
            email
          }
        }
      }
    `,
    type: 'fetchBatchInfo/fetch',
    key: 'fetchBatchInfo',
  })
export default fetchBatchInfo
