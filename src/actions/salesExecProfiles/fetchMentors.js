import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const FETCH_MENTORS_QUERY = ({ first, skip, salesExecFilter }) => gql`
  query {
  salesExecutiveProfiles: salesExecutiveProfiles(
    filter: {and: [${!salesExecFilter ? '' : salesExecFilter}]},
    orderBy: createdAt_DESC,
    first: ${first},
    skip: ${skip * first}
  ){
    id
    user {
      id
      username
      phone {
        number
      }
      email
    }
    mentors {
      id
      user{
        id
        username
        name
        email
        phone {
          number
        }
      }
      status
      isMentorActive
    }
    createdAt
    updatedAt
    mentorsMeta {
      count
    }
  }
  salesExecutiveProfilesMeta(filter: {and: [${!salesExecFilter ? '' : salesExecFilter}]}){
    count
  }
}
`

const fetchMentors = async ({ first, skip, salesExecFilter }) =>
  duck.query({
    query: FETCH_MENTORS_QUERY({ first, skip, salesExecFilter }),
    type: 'salesExecutiveMentors/fetch',
    key: 'salesExecutiveMentor',
    changeExtractedData: (extractedData, originalData) => ({
      salesExecutiveProfiles: originalData.salesExecutiveProfiles,
      salesExecutiveProfilesMeta: get(originalData, 'salesExecutiveProfilesMeta')
    })
  })

export default fetchMentors
