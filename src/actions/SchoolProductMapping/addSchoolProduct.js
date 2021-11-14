import gql from 'graphql-tag'
import duck from '../../duck'


const addSchoolProduct = (query) => {
  duck.query({
    query: gql`
       mutation {
        ${query}
       }
        `,
    type: 'products/add',
    key: 'products'
  })
}

export default addSchoolProduct
