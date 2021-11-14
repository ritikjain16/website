// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

// userPaymentPlanConnectId:"${userPaymentPlanConnectId}"
// userPaymentLinkConnectId:"${userPaymentLinkConnectId}"
const updateUserPaymentInstallment = async (
  installmentConnectId,
  // userPaymentPlanConnectId,
  // userPaymentLinkConnectId,
  input,
) =>
  duck.query({
    query: gql`
      mutation(
        $input: UserPaymentInstallmentUpdate!
      ){
        updateUserPaymentInstallment(
          id:"${installmentConnectId}"
          input:$input
        ){
          id
          userPaymentPlan{
            id
            userPaymentInstallments{
              id
              amount
              dueDate
              paidDate
              lastPaymentRequestedDate
              paymentRequestedCount
              status
            }
          }
        }    
      }`,
    variables: {
      input
    },
    type: 'addUserPaymentPlan/update',
    key: 'addUserPaymentPlan'
  })

export default updateUserPaymentInstallment
