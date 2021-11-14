import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const getIdsArr = (menteeSessionsIds) => {
  let idArr = ''
  menteeSessionsIds.forEach((id, index) => {
    if (index === 0) {
      idArr = `${idArr}"${id}"`
    } else {
      idArr = `${idArr},"${id}"`
    }
  })
  return idArr
}

const fetchAssignMentorInfo = async (date, time, menteeSessionsIds,
  loadSessionLogs = false) => duck.query({
  query: gql`
    query {
    mentorSessions(filter: {
      and:[
        {availabilityDate: "${new Date(date)}"}
        {slot${time}: true}
      ]
      }) {
      id
      sessionType
      user {
        mentorProfile {
          sessionLink
        }
        id
        name
        email
        country
        phone {
          countryCode
          number
        }
        username
        createdAt
        role
      }
      mentorMenteeSessions {
        id
        menteeSession {
          id
          user {
            id
            name
            role
          }
          ${getSlotNames()}
        }
      }
      batchSessions {
        id
        batch {
          id
          code
          studentsMeta {
            count
          }
        }
        ${getSlotNames()}
      }
    }
    mentorMenteeSessions(filter: {
        menteeSession_some:{
          id_in:[${getIdsArr(menteeSessionsIds)}]
        }
      }) {
      id
      sessionStatus
      sendSessionLink
      mentorSession{
        id
        user {
          id
          name
          username
          createdAt
          role
          mentorProfile {
            sessionLink
          }
        }
      }
      menteeSession {
        id
        createdAt
      }
      topic{
        id
        title
        order
      }
    }
    ${loadSessionLogs ? `sessionLogs(
      filter: {
        and: [
          { slot${time}: true }
          {
            sessionDate: "${new Date(date)}"
          }
          { action: deleteMentorMenteeSession }
        ]
      }
      orderBy: createdAt_DESC
    ) {
      id
      createdAt
      sessionStartDate
      client{
        id
        role
        name
        username
        country
        gender
        verificationStatus
        studentProfile {
          id
          grade
          parents{
            id
            user{
              id
              name
              email
              phone{
                number
                countryCode
              }
            }
          }
        }
      }
      course{
        id
        title
      }
      mentor {
        id
        name
        username
        createdAt
        role
      }
    }` : ''}
  }
  `,
  type: 'mentorSession/fetch',
  key: `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}/${time}`,
  changeExtractedData: (extractedData, originalData) => {
    if (extractedData && originalData) {
      const originalMentorSessionIds = []
      if (originalData.mentorSessions) {
        originalData.mentorSessions.forEach(_s => originalMentorSessionIds.push(get(_s, 'user.id')))
      }
      if (extractedData.user) {
        extractedData.user.forEach((data, index) => {
          const allMentorSessions = get(originalData, 'mentorSessions', []).filter(mSession => get(mSession, 'user.id') === get(data, 'id'))
          const batchSessions = []
          allMentorSessions.forEach(mentorSession => {
            get(mentorSession, 'batchSessions', []).forEach(batchSession => {
              batchSessions.push(batchSession)
            })
          })
          const menteeSessions = []
          allMentorSessions.forEach(mentorSession => {
            get(mentorSession, 'mentorMenteeSessions', []).forEach(menteeSession => {
              menteeSessions.push(get(menteeSession, 'menteeSession'))
            })
          })
          extractedData.user[index].batchSessions = batchSessions
          extractedData.user[index].existMenteeSession = menteeSessions
          const session = extractedData.session ? extractedData.session.filter(
            (_s) => get(_s, 'user.id') === data.id && get(_s, 'sessionType') === 'trial'
          )[0] : {}
          if (session) {
            data.sessionId = session.id
            data.sessionType = session.sessionType
          } else {
            data.sessionType = 'paid'
          }
          if (originalMentorSessionIds.includes(data.id)) {
            data.fromMentorMenteeSession = false
          } else {
            data.fromMentorMenteeSession = true
          }
        })
      }
      if (extractedData.completedSession && extractedData.menteeSession) {
        extractedData.completedSession.forEach(_s => {
          const menteeSession = extractedData.menteeSession
            ? extractedData.menteeSession.filter(
              _m => _m.id === get(_s, 'menteeSession.id')
            ) : []
          if (menteeSession) {
            _s.menteeSessionCreatedAt = get(menteeSession, '0.createdAt')
          }
        })
      }
      if (loadSessionLogs) extractedData.sessionLogs = get(originalData, 'sessionLogs', [])
    }
    return extractedData
  }
})

export default fetchAssignMentorInfo
