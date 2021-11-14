import gql from 'graphql-tag'
import duck from '../../duck'

const fetchTotalAmount = async (input) =>
  duck.query({
    query: gql`
      query($input: TotalAmountCollectedInput) {
        getTotalAmountCollected(input: $input) {
          totalAmount
          totalAmountCollected
        }
      }
    `,
    variables: {
      input
    },
    type: 'totalAmount/fetch',
    key: 'mentorConversionTotalAmount'
  })

export default fetchTotalAmount
