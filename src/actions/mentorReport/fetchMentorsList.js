import gql from 'graphql-tag'
// import { get } from 'lodash'
import duck from '../../duck'

const FETCH_MENTORS_LIST = (first, skip, roles, status) => gql`
query{
  users(
  ${!roles ? 'orderBy: createdAt_DESC' : ''},
  ${first ? `first:${first}` : ''},
  ${skip ? `skip:${first * skip}` : ''},
  filter:{
            and: [
              ${!roles ? '{role: mentor}' : `{role: ${roles}}`}
              ${!status ? '' : status}
            ]
}){
        id
        role
        name
        email
        phone{
            countryCode
            number
        }
     },
     ${!roles ? `usersMeta(filter:{
       and:[
         {role: mentor}
         ${!status ? '' : status}
       ]
     }){count}` : ''}
}
`

function fetchMentorsList(first, skip, roles, status) {
  return duck.query({
    query: FETCH_MENTORS_LIST(first, skip, roles, status),
    type: 'users/fetch',
    key: 'usersData',
    changeExtractedData: (originalData, extractedData) => (
      { ...originalData, usersData: extractedData }
    )
  })
}

export default fetchMentorsList
