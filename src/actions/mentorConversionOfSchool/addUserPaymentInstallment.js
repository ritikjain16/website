// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

// const dataPerPage = 20

const addUserPaymentInstallment = async (
  userConnectId,
  userPaymentPlanConnectId,
  userPaymentLinkConnectId,
  input,
) =>
  duck.query({
    query: gql`
      mutation(
        $input: UserPaymentInstallmentInput!
      ){
        addUserPaymentInstallment(
          userConnectId:"${userConnectId}"
          userPaymentPlanConnectId:"${userPaymentPlanConnectId}"
          userPaymentLinkConnectId:"${userPaymentLinkConnectId}"
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
              isPaymentRequested
            }
          }
        }    
      }`,
    variables: {
      input
    },
    type: 'addUserPaymentPlan/add',
    key: 'addUserPaymentPlan'
  })

export default addUserPaymentInstallment
