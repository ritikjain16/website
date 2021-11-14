import gql from 'graphql-tag'
import duck from '../../duck'

const fetchAllSchools = (id, key) =>
  duck.query({
    query: gql`
      query {
        schools(
          ${id ? `
          filter:{ admins_some: { id: "${id}" } }
          ` : ''}
          orderBy: createdAt_DESC) {
          id
          name
        }
      }
    `,
    type: `${!key ? 'schools' : key}/fetch`,
    key: `${!key ? 'schools' : key}`
  })

export default fetchAllSchools
