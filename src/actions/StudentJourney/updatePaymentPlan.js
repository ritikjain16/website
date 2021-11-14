import gql from 'graphql-tag'
import duck from '../../duck'

const updatePaymentPlan = async (input, id) =>
  duck.query({
    query: gql`
    mutation {
    updateUserPaymentPlan(
        id: "${id}"
        input: { enrollmentStatus: ${input} }
    ) {
        id
    }
    }
    `,
    variables: {
      input
    },
    type: 'userPaymentPlan/update',
    key: 'updateUserPaymentPlan',
  })

export default updatePaymentPlan
