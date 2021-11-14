// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

// const dataPerPage = 20

const updateUserPaymentPlan = async (
  planId,
  productConnectId,
  input,
  discountConnectID
) =>
  duck.query({
    query: gql`
        mutation($input: UserPaymentPlanUpdate!){
            updateUserPaymentPlan(
              id: "${planId}",
              ${!productConnectId ? '' : `productConnectId: "${productConnectId}"`}
              ${!discountConnectID ? '' : `discountConnectId: "${discountConnectID}",`}
              input:$input
            ){
              id
              salesOperation{
                id
              }
              user{
                id
                name
              }
              userPaymentInstallments{
                id
                userPaymentPlan{
                  id
                }
                userPaymentLink{
                  id
                }
                amount
                dueDate
                paidDate
                lastPaymentRequestedDate
                paymentRequestedCount
                status
              }
              product{
                id
                title
                price{
                  amount
                }
                type
                isDemoPack
                discounts{
                  percentage
                  isDefault
                }
              }
              discount{
                id
                percentage
                code
              }
              sessionsPerMonth
              installmentType
              installmentNumber
              productPrice
              finalSellingPrice
              dateOfEnrollment
              comment
            }
        }
        `,
    variables: {
      input
    },
    type: 'userPaymentPlan/update',
    key: 'updateUserPaymentPlan'
  })

export default updateUserPaymentPlan
