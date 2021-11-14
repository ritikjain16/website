// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

const updateDiscount = (id, input, productId, shouldUpdateProduct) =>
  duck.createQuery({
    query: gql`
      mutation($input:DiscountUpdate!){
        updateDiscount(id: "${id}", input: $input, ${shouldUpdateProduct ? `productConnectId: "${productId}"` : ''}) {
          id
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
          }
        }
      }
    `,
    variables: {
      input
    },
    overrideAutoReducer: (state, action) => {
      const discount = action.payload.getIn(['originalData', 'updateDiscount', 'product', 'discounts'])
      const discountId = action.payload.getIn(['originalData', 'updateDiscount', 'id'])
      let products = state.getIn(['products', 'data'])
      let productToChange = products.find(product => product.get('id') === action.payload.getIn(['originalData', 'updateDiscount', 'product', 'id']))
      const discountToChange = discount.find(d => d.get('id') === discountId)
      productToChange = productToChange.set('discounts', discount.filter(dis => dis.get('id') !== discountId).push(discountToChange))
      products = products.filter(product => product.get('id') !== action.payload.getIn(['originalData', 'updateDiscount', 'product', 'id'])).push(productToChange)
      state = state.setIn(['products', 'data'], products)
      return state
    },
    type: 'products/update',
    key: 'updateDiscount'
  })

export default updateDiscount
