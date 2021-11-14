import gql from 'graphql-tag'
import duck from '../../duck'


const fetchSchoolProduct = (pageQueries, searchQuery, fromDate, toDate, schools) => {
  const { perPage, page } = pageQueries

  duck.query({
    query: gql`
        query fetchSchools {
  schools(filter:
    {and: [
      ${!searchQuery ? '' : searchQuery}
      ${schools}
      ${fromDate ? `{createdAt_gt: "${fromDate}"} ` : ''}
        ${toDate ? `{createdAt_lt:"${toDate}"}` : ''}
    ]},
    
    orderBy: createdAt_DESC, 
    first:${perPage},
    skip:${perPage * (page - 1)}
  ) {
    name
    id
    products{
      id
      school{
        id
      }
      course {
        id
        title
      }
      title
      description
      price {
        amount
        currency
      }
      status
      type
      userRole
      createdAt
      discounts {
        id
        product{
          id
        }
        createdAt
        isDefault
        percentage
        expiryDate
        createdAt
        code
      }
      country
    }
  }
}
        `,
    type: 'schools/fetch',
    key: 'schools',
  })
}

export default fetchSchoolProduct
