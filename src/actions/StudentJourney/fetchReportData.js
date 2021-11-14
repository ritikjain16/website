import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const FETCH_REPORT_DATA = ({ studentId, fromDate, toDate, financeReport = false }) => gql`
{
  salesOperations(
    filter: {
      and: [
        { source_not: school }
        { leadStatus: won }
        ${studentId ? `{ client_some: { id: "${studentId}" } }` : ''}
      ]
    }
    orderBy: createdAt_ASC
  ) {
    id
    client {
      id
      name
      gender
      city
      region
      state
      country
      studentProfile {
        id
        grade
      }
    }
    allottedMentor {
      id
      name
    }
    userPaymentPlan {
      id
      product {
        id
        type
        course {
          id
          title
          topicsMeta(filter: { status: published }) {
            count
          }
        }
      }
      userPaymentInstallments {
        id
        paidDate
        dueDate
        amount
        status
      }
      finalSellingPrice
      collectedAmount
      lastSessionTopic {
        id
        order
      }
      installmentNumber
      dateOfEnrollment
      installmentNumber
      dateOfEnrollment
    }
  }
  ${!financeReport ? `
    mentorMenteeSessions(
      filter: {
        and: [
          {
            menteeSession_some: { user_some: { id: "${studentId}" } }
          }
          { sessionStatus: completed }
          { sessionStartDate_gte: "${fromDate}" }
          { sessionStartDate_lte: "${toDate}" }
        ]
      }
    ) {
      id
      menteeSession {
        id
        bookingDate
        user {
          id
        }
      }
      sessionStatus
      sessionStartDate
      sessionEndDate
    }
    ` : ''}
}
`

function fetchReportData({ studentId, fromDate, toDate, financeReport }) {
  return duck.query({
    query: FETCH_REPORT_DATA({ studentId, fromDate, toDate, financeReport }),
    type: 'studentReport/fetch',
    key: 'studentReport',
    changeExtractedData: (extractedData, originalData) => {
      const salesOperation = get(originalData, 'salesOperations')
      extractedData.salesOperation = salesOperation
      return { ...extractedData }
    }
  })
}

export default fetchReportData
