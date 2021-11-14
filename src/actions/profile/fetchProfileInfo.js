import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const fetchProfileInfo = async (userIdArr) => duck.query({
  query: gql`
    query {
      userCurrentTopicComponentStatuses(filter:{
        user_some:{
          id_in: [${getIdArrForQuery(userIdArr)}]
        }
      }){
        id
        skillsLevel
        user {
          id
        }
        currentCourse{
          id
          title
        }
      }
      mentorMenteeSessions(filter: {
        menteeSession_some: {user_some: {id_in: [${getIdArrForQuery(userIdArr)}]}}
      }, orderBy: createdAt_DESC) {
        id
        course{
          id
          title
        }
        topic {
          id
          order
          title
        }
        menteeSession {
          id
          user {
            id
          }
          bookingDate
          ${getSlotNames()}
        }
        mentorSession {
          id
          user {
            id
          }
        }
        sessionStatus
        createdAt
      }
      courses(filter:{
        status: published
        }, orderBy:order_ASC
      ){
        id
        order
        title
        category
        status
        topics {
          id
          order
          title
        }
      }
      menteeSessions(filter:{
        user_some:{
          id_in: [${getIdArrForQuery(userIdArr)}]
        }
      }) {
        id
        course {
          id
          title
        }
        user {
          id
        }
        topic {
          id
        }
        bookingDate
        ${getSlotNames()}
      }
    }
  `,
  type: 'profileInfo/fetch',
  key: 'menteeProfile',
  changeExtractedData: (extractedData, originalData) => {
    if (
      (extractedData && get(extractedData, 'completedSession')) &&
      (originalData && get(originalData, 'mentorMenteeSessions'))
    ) {
      extractedData.completedSession.forEach((session, index) => {
        const filteredSession = originalData.mentorMenteeSessions.filter(s => get(s, 'menteeSession.id') === get(session, 'menteeSession.id')) || []
        if (filteredSession && filteredSession.length) {
          extractedData.completedSession[index].menteeId = get(filteredSession, '0.menteeSession.user.id')
          extractedData.completedSession[index].topicId = get(filteredSession, '0.topic.id')
          extractedData.completedSession[index].topicOrder = get(filteredSession, '0.topic.order')
          extractedData.completedSession[index].topicTitle = get(filteredSession, '0.topic.title')
          extractedData.completedSession[index].bookingDate = get(filteredSession, '0.menteeSession.bookingDate')
          extractedData.completedSession[index].mentorId = get(filteredSession, '0.mentorSession.user.id')
          extractedData.completedSession[index].course = get(filteredSession, '0.course')
        }
      })
      extractedData.menteeSession = get(originalData, 'menteeSessions', [])
      extractedData.course = get(originalData, 'courses', [])
    }
    return extractedData
  }
})


export default fetchProfileInfo
