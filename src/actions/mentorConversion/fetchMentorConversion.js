import moment from 'moment'
import gql from 'graphql-tag'
import { filter, get } from 'lodash'
import duck from '../../duck'
import fetchUserCurrentTopicStatus from './fetchUserCurrentTopicStatus'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import fetchTotalAmount from './fetchTotalAmount'
// const dataPerPage = 20

const overDueSessions = `{userPaymentPlan_some:{
  and: [{ isPaid: false }, { nextPaymentDate_lt: "${moment().endOf('day').toDate().toISOString()}" }]
}}`

// ${(input && !userId) ? `
//       getTotalAmountCollected(input: {${input.fromDate ? `fromDate:"${input.fromDate}"` : ''},
//       ${input.toDate ? `toDate:"${input.toDate}"` : ''}
//     }) {
//         totalAmount
//         totalAmountCollected
//       }
//       ` : ''}

const fetchMentorConversion = async (
  { perPageQueries, currentPage },
  mentorId,
  filterQuery,
  overDue = false,
  userId,
  input,
  country = 'india'
) =>

  duck.query({
    query: gql`
    query{
      salesOperationsMeta: salesOperationsMeta(
        filter:${userId ? `{ client_some: { id: "${userId}" } }` : `{
          and:[
            {leadStatus: won}
            {source_not: school}
            ${country && country !== 'all' ? `{ country: ${country} }` : ''}
            ${mentorId ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorId)}]}}` : ''}
            ${overDue ? overDueSessions : ''}
            ${filterQuery && filterQuery.salesOperationFilter ? filterQuery.salesOperationFilter : ''}
            ${filterQuery && filterQuery.userPaymentPlanFilter ? filterQuery.userPaymentPlanFilter : ''}
            ${filterQuery && filterQuery.dateFilterQuery && filterQuery.dateFilterQuery.trim().length ?
    `{firstMentorMenteeSession_some: {and:[${filterQuery.dateFilterQuery}]}}` : ''}
          ]
        }`}
      ){
        count
      }
      salesOperations(filter:${userId ? `{ client_some: { id: "${userId}" } }` : `
      {
        and:[
          {leadStatus: won}
          {source_not: school}
          ${country && country !== 'all' ? `{ country: ${country} }` : ''}
          ${mentorId ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorId)}]}}` : ''}
          ${overDue ? overDueSessions : ''}
          ${filterQuery && filterQuery.salesOperationFilter ? filterQuery.salesOperationFilter : ''}
          ${filterQuery && filterQuery.userPaymentPlanFilter ? filterQuery.userPaymentPlanFilter : ''}
          ${filterQuery && filterQuery.dateFilterQuery && filterQuery.dateFilterQuery.trim().length
    ? `{firstMentorMenteeSession_some: {and:[${filterQuery.dateFilterQuery}]}}` : ''}
        ]
      }
      `}
      ${!userId ? `
      first: ${perPageQueries}
      skip: ${(currentPage - 1) * perPageQueries}
      orderBy: createdAt_DESC
      ` : ''}
      ){
        id
        createdAt
        leadStatus
        enrollmentType
        course{
          id
          title
        }
        client{
          id
          name
          gender
          studentProfile{
            id
            grade
            parents{
              id
              user{
                id
                name
                phone{
                  countryCode
                  number
                }
                email
              }
            }
          }
        }
        allottedMentor{
          name
        }
        oneToOne
        oneToTwo
        oneToThree
        firstMentorMenteeSession{
          id
          isSubmittedForReview
          rating
          friendly
          motivating
          engaging
          helping
          enthusiastic
          patient
          conceptsPerfectlyExplained
          distracted
          rude
          slowPaced
          fastPaced
          notPunctual
          average
          boring
          poorExplanation
          averageExplanation
          comment
          sessionStartDate
        }
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
            isPaymentRequested
          }
          product{
            id
            title
            price{
              amount
              currency
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
          comment
        }
      }
      products(filter: { and: [{ status: published },
        ${country && country !== 'all' ? `{ country: ${country} }` : ''}] }){
        id
        title
        description
        price{
          amount
          currency
        }
        status
        type
        isDemoPack
        userRole
        discounts{
          id
          percentage
          isDefault
          code
          expiryDate
        }
      }
    }
    `,
    type: 'mentorConversion/fetch',
    key: 'completedSession',
    changeExtractedData: (extractedData, originalData) => {
      let userIds = ''
      if (originalData.salesOperations) {
        filter(originalData.salesOperations, item => get(item, 'leadStatus') === 'won').forEach(
          data => {
            userIds += `"${get(data, 'client.id')}", `
          }
        )
        if (userIds !== '') fetchUserCurrentTopicStatus(userIds)
      }
      extractedData.products = originalData.products
      const userPaymentPlans = []
      get(originalData, 'salesOperations', []).forEach(salesOp => {
        if (get(salesOp, 'userPaymentPlan')) {
          userPaymentPlans.push(get(salesOp, 'userPaymentPlan'))
        }
      })
      extractedData.userPaymentPlans = userPaymentPlans
      if (originalData.salesOperations.length === 0) {
        extractedData.salesOperation = []
      }
      if (!userId) {
        fetchTotalAmount(input)
      }
      return extractedData
    }
  })

export default fetchMentorConversion
