// import { filter } from 'lodash'
// import moment from 'moment'
import gql from 'graphql-tag'
import duck from '../../duck'
// salesOperation -> client -> call only id
// rest is for error handling

const dataPerPage = 20

const fetchMenteeSessionWithNoFeedBack = async (
  filterQuery,
  skipCount = 0,
  filterQueryDate) => {
  const filterStatement = `{salesOperation_exists:false}
    {topic_some:{order: 1}}
    {sessionStatus: completed}
    {source:school}
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
      salesOperationForMentorSales: originalData.mentorMenteeSessions,
    }),
  })
}

export default fetchMenteeSessionWithNoFeedBack
