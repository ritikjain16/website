import gql from 'graphql-tag'
import duck from '../../duck'

const fetchSchoolList = async () =>
  duck.query({
    query: gql`
    {
      schools(orderBy: createdAt_DESC) {
        id
        name
      }
    }
    `,
    type: 'schools/fetch',
    key: 'schools',
  })

export default fetchSchoolList

