import gql from 'graphql-tag'
import duck from '../../duck'

const deleteDiscount = (discountId) => {
  duck.query({
    query: gql`
        
mutation deleteDiscount{
  deleteDiscount(
    id:"${discountId}"
  ){
    id
  }
}

`,
    overrideAutoReducer: (state, action) => {
      const deletedDiscount = action.payload.getIn(['originalData', 'deleteDiscount', 'id'])
      const discounts = state.getIn(['discounts', 'data'])
      const oldDiscount = discounts.filter(discount => discount.get('id') !== deletedDiscount)
      state = state.setIn(['discounts', 'data'], oldDiscount)
      return state
    },
    type: 'discounts/delete',
    key: 'discounts'
  })
}

export default deleteDiscount
