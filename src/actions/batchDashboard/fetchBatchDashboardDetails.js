import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_BATCH_DASHBOARD_DETAILS = (salesId) => gql`
query {
  courses(filter: {status: published}) {
    id
    title
  }
  ${salesId ? `user(id:"${salesId}"){
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
    }` :
    'users(filter: { and: [{ role: mentor }] }) {id role name email }'}
}
`
const fetchBatchDashboardDetails = async (salesId) => duck.query({
  query: FETCH_BATCH_DASHBOARD_DETAILS(salesId),
  type: 'courses/fetch',
  key: 'course',
})

export default fetchBatchDashboardDetails
