// import { filter } from 'lodash'
// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { TRANSFORMATION_TEAM, TRANSFORMATION_ADMIN } from '../../constants/roles'
// salesOperation -> client -> call only id
// rest is for error handling

const dataPerPage = 20

const fetchMenteeSessionWithNoFeedBack = async (
  filterQuery,
  skipCount = 0,
  filterQueryDate,
  country = 'india',
  userId
) => {
  const savedRole = getDataFromLocalStorage('login.role')
  const transformationQuery = '{source: transformation}'
  const transformationQueryNot = '{source_not:school}'
  const filterStatement = `
  { or: [
    {salesOperation_exists:false}
    {leadStatus_exists: false}
    {leadStatus: unassigned}
  ]}
    {topic_some:{order: 1}}
    {sessionStatus: completed}
    {
      or: [
        {hasRescheduled_exists: false}
        {hasRescheduled: false}
      ]
    }
    ${(savedRole === TRANSFORMATION_TEAM || savedRole === TRANSFORMATION_ADMIN) ? transformationQuery : transformationQueryNot}
    ${!filterQuery ? '' : filterQuery}
    ${!filterQueryDate ? '' : filterQueryDate}`
  return duck.query({
    query: gql`
    query{
      users(
        filter:{
          role_in:[mentor]
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
            ${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : ''}
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
            ${userId ? `{ menteeSession_some: { user_some: { id: "${userId}" } } }` : ''}
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
    changeExtractedData: (extractedData, originalData) => ({
      ...extractedData,
      course: [],
      salesOperationForMentorSales: originalData.mentorMenteeSessions
    })
  })
}

export default fetchMenteeSessionWithNoFeedBack
