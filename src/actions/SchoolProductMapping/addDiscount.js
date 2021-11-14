import gql from 'graphql-tag'
import duck from '../../duck'

const addDiscount = (input, productId) => {
  duck.query({
    query: gql`
        
mutation addDiscount($input:DiscountInput!){
    addDiscount(
      input:$input,
      productConnectId:"${productId}"
    ){
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
  }
  `,
    variables: {
      input,
    },
    overrideAutoReducer: (state, action) => {
      const updatedDiscount = action.payload.getIn(['originalData', 'addDiscount'])
      const discounts = state.getIn(['discounts', 'data'])
      const oldDiscount = discounts.push(updatedDiscount.set('__keys', ['schools']))
      state = state.setIn(['discounts', 'data'], oldDiscount)
      return state
    },
    type: 'discounts/add',
    key: 'discounts'
  })
}

export default addDiscount
