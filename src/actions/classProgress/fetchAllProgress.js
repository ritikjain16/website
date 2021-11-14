import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import duck from '../../duck'

const FETCH_CLASS_PROGRESS = (filterQuery) => gql`
{
  salesOperations(
    filter: { and: [{ source_not: school }, { leadStatus: won },
      ${filterQuery}] }
    orderBy: createdAt_ASC
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
        title
        order
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
}
`
function fetchAllProgress(filterQuery) {
  return duck.query({
    query: FETCH_CLASS_PROGRESS(filterQuery),
    type: 'salesOperation/fetch',
    key: 'classProgressAll',
    changeExtractedData: (originalData, extractedData) => {
      const classProgressAll = []
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
            const isPaid = get(userPaymentPlan, 'isPaid')
            topicTitle = get(userPaymentPlan, 'lastSessionTopic.title', '-')
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
          }
          classProgressAll.push({
            srNo: index + 1,
            name: get(client, 'name'),
            parentName: get(client, 'studentProfile.parents[0].user.name', '-'),
            parentEmail: get(client, 'studentProfile.parents[0].user.email', '-'),
            parentNumber: `${get(client, 'studentProfile.parents[0].user.phone.countryCode', '')} ${get(client, 'studentProfile.parents[0].user.phone.number', '')}`,
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
        classProgressAll, }
    }
  })
}

export default fetchAllProgress
