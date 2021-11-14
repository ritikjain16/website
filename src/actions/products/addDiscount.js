// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'


const addDiscount = (input, productId) =>
  duck.createQuery({
    query: gql`
      mutation($input:DiscountInput!){
        addDiscount(input: $input, productConnectId: "${productId}") {
          product {
            id
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
            createdAt
            userRole
            discounts {
              id
              isDefault
              percentage
              expiryDate
              createdAt
              code
            }
          }
        }
      }
    `,
    variables: {
      input
    },
    overrideAutoReducer: (state, action) => {
      const discount = action.payload.getIn(['originalData', 'addDiscount', 'product', 'discounts'])
      let products = state.getIn(['products', 'data'])
      let productToChange = products.find(product => product.get('id') === action.payload.getIn(['originalData', 'addDiscount', 'product', 'id']))
      productToChange = productToChange.set('discounts', discount)
      products = products.filter(product => product.get('id') !== action.payload.getIn(['originalData', 'addDiscount', 'product', 'id'])).push(productToChange)
      state = state.setIn(['products', 'data'], products)
      return state
    },
    type: 'discount/add',
    key: 'addDiscount',
  })

export default addDiscount
