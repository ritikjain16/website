// import moment from 'moment'
import gql from 'graphql-tag'
import { filter, get } from 'lodash'
import moment from 'moment'
import duck from '../../duck'
import fetchUserPaymentLinks from './fetchUserPaymentLinks'
import fetchUserCurrentTopicStatus from './fetchUserCurrentTopicStatus'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
// const dataPerPage = 20


const overDueSessions = `{userPaymentPlan_some:{
  userPaymentInstallments_some:{
    and: [
      {dueDate_lt: "${moment().endOf('day').toDate().toISOString()}"}
      {status: pending}
    ]
  }
}}`

const fetchMentorConversionOfSchool = async (
  { perPageQueries, currentPage },
  mentorId,
  filterQuery,
  overDue = false
) =>
  duck.query({
    query: gql`
    query{
      salesOperationsMeta: salesOperationsMeta(
        filter:{
          and:[
            {leadStatus: won}
            ${mentorId ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorId)}]}}` : ''}
            ${overDue ? overDueSessions : ''}
            ${
  filterQuery && filterQuery.salesOperationFilter
    ? filterQuery.salesOperationFilter
    : ''
}
            ${
  filterQuery && filterQuery.userPaymentPlanFilter
    ? filterQuery.userPaymentPlanFilter
    : ''
}
{source:school}
${filterQuery && filterQuery.dateFilterQuery && filterQuery.dateFilterQuery.trim().length ? `{firstMentorMenteeSession_some: {and:[${filterQuery.dateFilterQuery}]}}` : ''}
          ]
        }
      ){
        count
      }
      salesOperations(filter:{
        and:[
          {leadStatus: won}
          ${mentorId ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorId)}]}}` : ''}
          ${overDue ? overDueSessions : ''}
          ${filterQuery && filterQuery.salesOperationFilter ? filterQuery.salesOperationFilter : ''}
          ${
  filterQuery && filterQuery.userPaymentPlanFilter
    ? filterQuery.userPaymentPlanFilter
    : ''
}
{source:school}
${filterQuery && filterQuery.dateFilterQuery && filterQuery.dateFilterQuery.trim().length ? `{firstMentorMenteeSession_some: {and:[${filterQuery.dateFilterQuery}]}}` : ''}
        ]
      }
      first: ${perPageQueries}
      skip: ${(currentPage - 1) * perPageQueries}
      orderBy: createdAt_DESC
      ){
        id
        createdAt
        leadStatus
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
      products(filter:{
        status: published
      }){
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
      fetchUserPaymentLinks()
      let userIds = ''
      if (originalData.salesOperations) {
        filter(originalData.salesOperations, item => get(item, 'leadStatus') === 'won').forEach(
          data => {
            userIds += `"${get(data, 'client.id')}", `
          }
        )
        fetchUserCurrentTopicStatus(userIds)
      }
      extractedData.products = originalData.products
      if (originalData.salesOperations.length === 0) {
        extractedData.salesOperation = []
      }
      return extractedData
    }
  })

export default fetchMentorConversionOfSchool
