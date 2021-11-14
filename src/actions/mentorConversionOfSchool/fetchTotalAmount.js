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
    // changeExtractedData: (extractedData, originalData) => {
    //   fetchUserPaymentLinks()
    //   let userIds = ''
    //   if (originalData.salesOperations) {
    //     filter(originalData.salesOperations, item =>
    // get(item, 'leadStatus') === 'won').forEach(data => {
    //       userIds += `"${get(data, 'client.id')}", `
    //     })
    //     fetchUserCurrentTopicStatus(userIds)
    //   }
    //   if (originalData.salesOperations.length === 0) {
    //     extractedData.salesOperation = []
    //   }
    //   return extractedData
    // },
  })

export default fetchTotalAmount
