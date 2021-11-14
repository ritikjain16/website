import gql from 'graphql-tag'
import duck from '../../duck'


const fetchSchools = async ({ perPage, page }, searchQuery, fromDate, toDate) =>
  duck.query({
    query: gql`
    {
    schools(filter: { and: [
      ${!searchQuery ? '' : searchQuery}
      ${fromDate ? `{createdAt_gt: "${fromDate}"} ` : ''}
      ${toDate ? `{createdAt_lt:"${toDate}"}` : ''}
    ] }, orderBy: createdAt_DESC,
      first:${perPage},
      skip:${perPage * (page - 1)}
    ) {
      id
      name
      enrollmentType
      whiteLabel
      coordinatorName
      code
      hubspotId
      logo {
        id
        uri
      }
      schoolPicture {
        id
        uri
      }
      admins {
        id
        name
        email
        createdAt
        username
        phone {
          countryCode
          number
        }
      }
      bde {
        id
        user {
          id
          name
        }
      }
      coordinatorEmail
      coordinatorPhone {
        countryCode
        number
      }
      coordinatorRole
      city
      createdAt
    }
    schoolsMeta(filter: { and: [
      ${!searchQuery ? '' : searchQuery}
      ${fromDate ? `{createdAt_gt:"${fromDate}"}` : ''}
      ${toDate ? `{createdAt_lt:"${toDate}"}` : ''}
    ] }) {
      count
    }
  }
        `,
    type: 'schools/fetch',
    key: 'schools',
  })

export default fetchSchools
