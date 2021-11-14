import gql from 'graphql-tag'
// import { get } from 'lodash'
import duck from '../../duck'

const FETCH_MENTORS_FORSALES = (id, role) => gql`
query{
  ${role ? `
  users(filter: { and: [{ role: ${role} }] }) {
    id
    name
  }
  ` : `
  user(id:"${id}"){
    salesExecutiveProfile{
      mentors(orderBy:createdAt_DESC){
        user{
          id
          name
        }
      }
    }
  }`}
  }
`

function fetchMentorforSales(id, role) {
  return duck.query({
    query: FETCH_MENTORS_FORSALES(id, role),
    type: 'users/fetch',
    key: 'usersData',
    changeExtractedData: (originalData, extractedData) => (
      { ...originalData, usersData: extractedData }
    )
  })
}

export default fetchMentorforSales
