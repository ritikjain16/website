// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'


const updateProduct = (id, input, courseConnectId) =>
  duck.createQuery({
    query: gql`
      mutation($input:ProductUpdate!){
        updateProduct(
          id: "${id}"
          input: $input
          ${courseConnectId ? `courseConnectId: "${courseConnectId}"` : ''}
        ) {
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
    variables: {
      input
    },
    overrideAutoReducer: (state, action) => {
      const updatedProduct = action.payload.getIn(['originalData', 'updateProduct'])
      let products = state.getIn(['products', 'data'])
      products = products.filter(product => product.get('id') !== action.payload.getIn(['originalData', 'updateProduct', 'id'])).push(updatedProduct)
      state = state.setIn(['products', 'data'], products)
      return state
    },
    type: 'products/update',
    key: 'product'
  })

export default updateProduct
