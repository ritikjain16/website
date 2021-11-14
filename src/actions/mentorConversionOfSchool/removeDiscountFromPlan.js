// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'

const removeDiscountFromPlan = async (
  userPaymentPlanId,
  discountId
) =>
  duck.query({
    query: gql`
        mutation{
            removeFromUserPaymentPlanDiscount(
                userPaymentPlanId: "${userPaymentPlanId}",
                discountId: "${discountId}"
            ){
                userPaymentPlan{
                    id
                    salesOperation{
                      id
                    }
                    user{
                      id
                      name
                    }
                    userPaymentInstallments(
                      orderBy: dueDate_ASC
                    ){
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
                      product{
                        id
                      }
                    }
                    sessionsPerMonth
                    installmentType
                    installmentNumber
                    productPrice
                    finalSellingPrice
                    dateOfEnrollment
                  }
            }
        }
        `,
    type: 'userPaymentPlan/update',
    key: 'updateUserPaymentPlan'
  })

export default removeDiscountFromPlan
