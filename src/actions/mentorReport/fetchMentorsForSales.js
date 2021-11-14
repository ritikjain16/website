import gql from 'graphql-tag'
// import { get } from 'lodash'
import duck from '../../duck'

const FETCH_MENTORS_FORSALES = (id, mentor) => gql`
query{
  ${mentor ? `
  user(id:"${id}"){
    id
    name
    mentorProfile{
      salesExecutive{
        user{
          name
        }
      }
    }
    }
  ` : `
  user(id:"${id}"){
    id
    name
    salesExecutiveProfile{
      id
      mentors(orderBy:createdAt_DESC){
        id
        user{
          id
          name
          email
          phone{
            countryCode
            number
        }
        }
      }
    }
    }`}
  }
`

function fetchMentorforSales(id, mentor) {
  return duck.query({
    query: FETCH_MENTORS_FORSALES(id, mentor),
    type: 'users/fetch',
    key: 'usersData',
    changeExtractedData: (originalData, extractedData) => (
      { ...originalData, usersData: extractedData }
    )
  })
}

export default fetchMentorforSales
