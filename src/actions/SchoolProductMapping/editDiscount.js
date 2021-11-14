import gql from 'graphql-tag'
import duck from '../../duck'

const editDiscount = (input, discountId) => {
  duck.query({ query: gql`
    
    mutation editDiscount( $input:DiscountUpdate! ){
  updateDiscount(
    id:"${discountId}",
  
    input:$input
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
    input
  },
  overrideAutoReducer: (state, action) => {
    const updatedDiscount = action.payload.getIn(['originalData', 'updateDiscount'])
    const discounts = state.getIn(['discounts', 'data'])
    const oldDiscount = discounts.filter(discount => discount.get('id') !== action.payload.getIn(['originalData', 'updateDiscount', 'id']))
      .push(updatedDiscount.set('__keys', ['schools']))
    state = state.setIn(['discounts', 'data'], oldDiscount)
    return state
  },
  type: 'discounts/update',
  key: 'discounts'
  })
}

export default editDiscount
