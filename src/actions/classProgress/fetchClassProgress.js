import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import duck from '../../duck'

const FETCH_CLASS_PROGRESS = (first, skip, filterQuery) => gql`
{
  salesOperations(
    filter: { and: [{ source_not: school }, { leadStatus: won },
      ${filterQuery}] }
    orderBy: createdAt_ASC
    first: ${first}
    skip: ${first * skip}
  ) {
    id
    client {
      id
      name
      gender
      studentProfile {
        id
        parents {
          id
          user {
            id
            name
            phone {
              countryCode
              number
            }
            email
          }
        }
      }
    }
    allottedMentor {
      id
      name
    }
    userPaymentPlan {
      lastSessionOn
      product {
        course {
          id
          title
          topicsMeta(filter: { status: published }) {
            count
          }
        }
      }
      lastSessionTopic {
        id
        order
        title
      }
      nextPaymentDate
      sessionVelocityStatus
      sessionsPerMonth
      enrollmentStatus
      avgDaysPerSession
      isPaid
      product {
        type
      }
    }
  }
  salesOperationsMeta(
    filter: { and: [{ source_not: school }, { leadStatus: won }, ${filterQuery}] }
  ) {
    count
  }
  total: userPaymentPlansMeta{
    count
  }
  ahead: userPaymentPlansMeta(filter:{
    sessionVelocityStatus:ahead
  }){
    count
  }
  delayed: userPaymentPlansMeta(filter:{
    sessionVelocityStatus:delayed
  }){
    count
  }
  onTime: userPaymentPlansMeta(filter:{
    sessionVelocityStatus:onTime
  }){
    count
  }
  active: userPaymentPlansMeta(filter:{
    enrollmentStatus:active
  }){
    count
  }
  dormant:userPaymentPlansMeta(filter:{
    enrollmentStatus:dormant
  }){
    count
  }
  downgraded:userPaymentPlansMeta(filter:{
    enrollmentStatus:downgraded
  }){
    count
  }
  paid: userPaymentPlansMeta(filter: { isPaid: true }) {
    count
  }
  pending: userPaymentPlansMeta(
    filter: { and: [{ isPaid: false }, { nextPaymentDate_gte: "${moment().format('l')}" }] }
  ) {
    count
  }
  overdue: userPaymentPlansMeta(
    filter: { and: [{ isPaid: false }, { nextPaymentDate_lt: "${moment().format('l')}" }] }
  ) {
    count
  }
}
`
function fetchClassProgress(first, skip, filterQuery) {
  return duck.query({
    query: FETCH_CLASS_PROGRESS(first, skip, filterQuery),
    type: 'salesOperation/fetch',
    key: 'classProgress',
    changeExtractedData: (originalData, extractedData) => {
      const classProgress = []
      if (extractedData && extractedData.salesOperations
        && extractedData.salesOperations.length > 0) {
        const { salesOperations } = extractedData
        salesOperations.forEach(({ allottedMentor, client,
          userPaymentPlan }, index) => {
          const topicCount = get(userPaymentPlan, 'product.course.topicsMeta.count', 0)
          let classType = ''
          let completedSession = 0
          let classStatus = ''
          let lastClassOn = ''
          let avgDayPerClass = ''
          let enrollmentStatus = ''
          let paymentStatus = ''
          let completedSessionPercent = 0
          let dateMsg = ''
          let topicTitle = ''
          if (userPaymentPlan) {
            if (get(userPaymentPlan, 'sessionsPerMonth') === 4) {
              classType = '1 class in 1 week'
            } else if (get(userPaymentPlan, 'sessionsPerMonth') === 6) {
              classType = '1 class in 5 days'
            } else if (get(userPaymentPlan, 'sessionsPerMonth') === 8) {
              classType = '1 class in 3-4 days'
            } else {
              classType = '-'
            }
            completedSession = get(userPaymentPlan, 'lastSessionTopic.order', 0)
            completedSessionPercent = ((completedSession / topicCount) * 100).toFixed(2)
            classStatus = get(userPaymentPlan, 'sessionVelocityStatus', '-')
            avgDayPerClass = get(userPaymentPlan, 'avgDaysPerSession', '-')
            lastClassOn = get(userPaymentPlan, 'lastSessionOn', '-')
            enrollmentStatus = get(userPaymentPlan, 'enrollmentStatus', '-')
            topicTitle = get(userPaymentPlan, 'lastSessionTopic.title', '-')
            const isPaid = get(userPaymentPlan, 'isPaid')
            if (isPaid) {
              paymentStatus = 'paid'
            } else {
              const nextInstallDate = get(userPaymentPlan, 'nextPaymentDate')
              if (nextInstallDate) {
                const today = new Date().toISOString()
                const nextDate = moment(nextInstallDate).toISOString()
                if (today > nextDate) {
                  paymentStatus = 'overDue'
                } else {
                  paymentStatus = 'pending'
                }
              } else {
                paymentStatus = '-'
              }
            }
            if (lastClassOn !== '-') {
              if (moment().diff(lastClassOn, 'd') === 1) dateMsg = `Last class ${moment().diff(lastClassOn, 'd')} days back`
              else dateMsg = `Last class ${moment().diff(lastClassOn, 'd')} days back`
            }
          } else {
            classType = '-'
            completedSession = 0
            classStatus = '-'
            avgDayPerClass = 0
            lastClassOn = '-'
            enrollmentStatus = '-'
            paymentStatus = '-'
            completedSessionPercent = 0
            dateMsg = '-'
            topicTitle = '-'
          }
          classProgress.push({
            srNo: index + 1,
            name: get(client, 'name'),
            id: get(client, 'id'),
            key: get(client, 'id'),
            classType,
            classStatus,
            avgDayPerClass,
            lastClassOn: lastClassOn === '-' ? lastClassOn : moment(lastClassOn)
              .format('DD-MM-YYYY'),
            enrollmentStatus,
            mentor: get(allottedMentor, 'name', '-'),
            paymentStatus,
            completedSession,
            completedSessionPercent: `${completedSessionPercent} %`,
            dateMsg,
            topicTitle
          })
        })
      }
      return {
        ...originalData,
        classProgress,
        classProgressData: {
          active: get(extractedData, 'active.count'),
          ahead: get(extractedData, 'ahead.count'),
          delayed: get(extractedData, 'delayed.count'),
          dormant: get(extractedData, 'dormant.count'),
          downgraded: get(extractedData, 'downgraded.count'),
          onTime: get(extractedData, 'onTime.count'),
          total: get(extractedData, 'total.count'),
          paid: get(extractedData, 'paid.count'),
          pending: get(extractedData, 'pending.count'),
          overdue: get(extractedData, 'overdue.count'),
        } }
    }
  })
}

export default fetchClassProgress
