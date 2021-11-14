// import moment from 'moment'
import { get } from 'lodash'
import gql from 'graphql-tag'
import duck from '../../duck'

// const dataPerPage = 20

const addUserPaymentPlan = async (
  userConnectId,
  productConnectId,
  salesOperationConnectId,
  input,
  discountConnectID
) =>
  duck.query({
    query: gql`
        mutation($input: UserPaymentPlanInput!){
            addUserPaymentPlan(
              userConnectId: "${userConnectId}",
              productConnectId: "${productConnectId}",
              salesOperationConnectId: "${salesOperationConnectId}",
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
    type: 'addUserPaymentPlan/add',
    key: 'addUserPaymentPlan',
    changeExtractedData: (extractedData, originalData) => ({
      ...extractedData,
      userPaymentPlans: {
        ...get(originalData, 'addUserPaymentPlan')
      }
    })
  })

export default addUserPaymentPlan
