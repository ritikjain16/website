// import { filter } from 'lodash'
import gql from 'graphql-tag'
import duck from '../../duck'
import fetchMentorSalesMetaData from './fetchMentorSalesMetaData'
// salesOperation -> client -> call only id
// rest is for error handling

const dataPerPage = 20

const fetchMentorSalesOfSchool = async (
  filterQuery,
  skipCount = 0,
  filterQuerySales,
  filterQueryLeadStatus,
  filterQueryNextDate,
  filterQueryDate) => {
  const filterStatement = `
  {topic_some:{order:1}}
  {source:school}
  {sessionStatus:completed}
  {salesOperation_exists: true}
  ${filterQueryLeadStatus && filterQueryLeadStatus.length > 0
    ? `{leadStatus_in:[${filterQueryLeadStatus}]}`
    : '{leadStatus_not_in:[unfit]}'}
  ${!filterQueryNextDate ? '' : `{salesOperation_some:{${filterQueryNextDate}}}`}
  ${!filterQuery ? '' : filterQuery}
  ${!filterQueryDate ? '' : filterQueryDate}`

  return duck.query({
    query: gql`
    query{
      users(
        filter:{
          and: [
            {role_in:[mentor, mentee]}
            {source:school}
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
          ]
        }
      ){
        count
      }
      mentorMenteeSessions(
        filter:{
          and:[
            ${filterStatement}
          ]
        }
        orderBy:sessionStartDate_DESC,
        first: ${dataPerPage},
        skip: ${dataPerPage * skipCount}
        ){
        id
        course{
          id
          title
        }
        sessionStartDate
        isSubmittedForReview
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
              school{
                name
              }
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
      fetchMentorSalesMetaData(filterQuerySales, filterQueryDate, filterQuery)
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
      //   countData[tags] = originalData[tags]
      // })
      // const mentors = filter(originalData.users, user => user.role === 'mentor')[0]
      // const mentee = filter(originalData.users, user => user.role === 'mentee')[0]
      return {
        ...extractedData,
        // countData: { ...originalData.mentorMenteeSessionsMeta, ...countData },
        salesOperationForMentorSales: changedData.mentorMenteeSessions,
      }
      // return { ...extractedData, countData }
    },
  })
}

export default fetchMentorSalesOfSchool
