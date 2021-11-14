// import { filter } from 'lodash'
// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'
import fetchMentorSalesMetaData from './fetchMentorSalesMetaData'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { TRANSFORMATION_TEAM, TRANSFORMATION_ADMIN } from '../../constants/roles'
// salesOperation -> client -> call only id
// rest is for error handling

const dataPerPage = 20

const fetchMentorSales = async (
  filterQuery,
  skipCount = 0,
  filterQuerySales,
  filterQueryLeadStatus,
  filterQueryNextDate,
  filterQueryDate,
  filterQueryEnrollmentType,
  country = 'india',
  userId,
) => {
  const savedRole = getDataFromLocalStorage('login.role')
  const transformationQuery = '{source: transformation}'
  const transformationQueryNot = '{source_not:school}'
  const filterStatement = `
  {topic_some:{ order:1 }}
  ${(savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN) ? transformationQuery : transformationQueryNot}
  { sessionStatus:completed}
  ${!filterQueryEnrollmentType ? '' : `{salesOperation_some: {enrollmentType: ${filterQueryEnrollmentType}}}`}
  ${!filterQueryLeadStatus || filterQueryLeadStatus.length === 0 ? '{leadStatus_not:unfit}' : `{leadStatus_in: [${filterQueryLeadStatus}]}`}
  ${!filterQuery ? '' : `${userId ? '' : filterQuery}`}
  ${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : ''}
  ${!filterQueryNextDate ? `${!filterQueryDate ? '' : filterQueryDate}` : `{salesOperation_some:{or: [
    ${filterQueryNextDate}
  ]}}`}
  {
    and: [
      {salesOperation_exists:true}
      {leadStatus_exists: true}
      {leadStatus_not: unassigned}
    ]
  }
  `
  return duck.query({
    query: gql`
    query{
      users(
        filter:{
          and: [
            {role: mentor}
            ${(savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN) ? transformationQuery : transformationQueryNot}
          ]
        }
      ){
        id
        name
        role
      }
      totalCompletedSessions: mentorMenteeSessionsMeta(
        filter:{
          and:[
            ${filterStatement}
            ${country === 'all' ? '' : `{country:${country}}`}
          ]
        }
      ){
        count
      }
      mentorMenteeSessions(
        filter:{
          and:[
            ${filterStatement}
            ${country === 'all' ? '' : `{country:${country}}`}
          ]
        }
        orderBy:sessionStartDate_DESC,
        first: ${dataPerPage},
        skip: ${dataPerPage * skipCount}
        ){
        id
        sessionStartDate
        isSubmittedForReview
        leadStatus
        source
        course{
          id
          title
        }
        mentorSession{
          id
            user{
            id
            name
            username
          }
        }
        topic{
          id
          title
          order
        }
        salesOperation{
          id
          enrollmentType
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
          monitoredBy{
            id
          }
          salesOperationActivities{
            id
            actionOn
            currentData
            oldData
            createdAt
          }
          courseInterestedIn
          leadStatus
          nextCallOn
          nextSteps
          otherReasonForNextStep
          oneToOne
          oneToTwo
          oneToThree
          knowCoding
          lookingForAdvanceCourse
          ageNotAppropriate
          notRelevantDifferentStream
          noPayingPower
          notInterestedInCoding
          learningAptitudeIssue
        }
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
        sessionCommentByMentor
        menteeSession{
          id
          bookingDate
          user{
            id
            name
            email
            gender
            studentProfile{
              grade
              parents{
                user{
                  name
                  email
                  phone{
                    number
                  }
                }
              }
            }
          }
        }
      }
    }
    `,
    type: 'mentorSales/fetch',
    key: 'completedSession',
    changeExtractedData: (extractedData, originalData) => {
      fetchMentorSalesMetaData(filterQuerySales, filterQueryDate, filterQuery, country, userId)
      const changedData = originalData
      extractedData.course = []
      if (originalData.mentorMenteeSessions) {
        originalData.mentorMenteeSessions.forEach((data, index) => {
          if (data.salesOperation && data.salesOperation.salesOperationLog) {
            changedData.mentorMenteeSessions[index].salesOperation.log
              = data.salesOperation.salesOperationLog
          }
        })
      }
      // const countData = {}
      // const countLabels = ['actionDueToday', 'dueLater', 'needAttention']
      // countLabels.forEach((tags) => {
      //   countData[tags] = 0
      //   // countData[tags] = originalData[tags]
      // })
      return {
        ...extractedData,
        // countData: { ...originalData.salesOperationsMeta, ...countData },
        salesOperationForMentorSales: changedData.mentorMenteeSessions,
      }
    },
  })
}

export default fetchMentorSales
