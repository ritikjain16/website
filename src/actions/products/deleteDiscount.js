import gql from 'graphql-tag'
import duck from '../../duck'

const deleteDiscount = (id) =>
  duck.createQuery({
    query: gql`
      mutation {
        deleteDiscount(id: "${id}") {
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
    overrideAutoReducer: (state, action) => {
      const discountId = action.payload.getIn(['originalData', 'deleteDiscount', 'id'])
      let products = state.getIn(['products', 'data'])
      let productToChange = products.find(product => product.get('id') === action.payload.getIn(['originalData', 'deleteDiscount', 'product', 'id']))
      productToChange = productToChange.set('discounts', productToChange.get('discounts').filter(discount => discount.get('id') !== discountId))
      products = products
        .filter(product => product.get('id') !== action.payload.getIn(['originalData', 'deleteDiscount', 'product', 'id']))
        .push(productToChange)
      state = state.setIn(['products', 'data'], products)
      return state
    },
    type: 'products/delete',
    key: 'deleteDiscount'
  })

export default deleteDiscount
