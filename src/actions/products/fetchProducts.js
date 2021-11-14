// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'


const fetchProducts = (country = 'india') =>
  duck.createQuery({
    query: gql`
       query {
        products(  
          filter:{
            and:[
              ${country === 'all' ? '' : `{country:${country}}`},
              {targetUserType:b2c}
            ]
          }
        ){
          id
          course {
            id
            title
          }
          title
          description
          features {
            statement
            order
          }
          showOnWebsite
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
            isDefault
            percentage
            expiryDate
            createdAt
            code
          }
          country
        }
      }
    `,
    type: 'products/fetch',
    key: 'product',
    changeExtractedData: (extractedData, originalData) => {
      let product = []
      if (originalData && originalData.products && originalData.products.length > 0) {
        product = originalData.products
      }
      extractedData.products = product
      return { ...extractedData }
    }
  })

export default fetchProducts
