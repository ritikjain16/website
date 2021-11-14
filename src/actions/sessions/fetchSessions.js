import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const getFilters = (id, date, sessionType, fromDate, toDate, isFiltering) => {
  let filter = ''
  if (isFiltering) {
    filter = `and:[{sessionType:${sessionType}},`
    filter = id && id !== null ? `${filter}{user_some:{id:"${id}"}},` : filter
    filter = fromDate && fromDate != null ? `${filter}{availabilityDate_gt:"${fromDate}"},` : filter
    filter = toDate && toDate != null ? `${filter}{availabilityDate_lt:"${toDate}"},` : filter
    filter += ']'
  } else if (id && sessionType) {
    filter = `
       and: [
          {user_some:{id:"${id}"}},
          {sessionType:${sessionType}}
       ]
    `
  } else if (id) {
    filter = `
      and: [
        {user_some:{id:"${id}"}}
      ]
    `
  } else if (sessionType) {
    filter = `
      and: [
        {sessionType:${sessionType}}
      ]
    `
  } else if (date) {
    filter = `
      and: [
        {availabilityDate:"${date}"}
      ]
    `
  }

  return filter
}

const getKey = (date, sessionType) => {
  if (date) {
    return `mentorSession/${new Date(date).setHours(0, 0, 0, 0)}`
  } else if (sessionType) {
    return `mentorSession/${sessionType}`
  }

  return 'session'
}

const fetchSessions = async (
  skipCount,
  id,
  date,
  sessionType,
  fromDate,
  toDate,
  isFiltering
) => duck.query({
  query: gql`
    query {
        mentorSessions(first:20, skip: ${skipCount},
        filter: {${getFilters(id, date, sessionType, fromDate, toDate, isFiltering)}
    }, orderBy:availabilityDate_DESC) {
        id
        course {
          id
        }
        createdAt
        updatedAt
        availabilityDate
        sessionType
        user {
          id
          name
          email
          username
          phone {
            countryCode
            number
          }
        }
        ${getSlotNames()}
    }
    mentorSessionsMeta(filter:{
      ${getFilters(id, date, sessionType, fromDate, toDate, isFiltering)}
    }){
      count
    }
  }
  `,
  type: 'session/fetch',
  key: getKey(date, sessionType),
  changeExtractedData: (extractedData, originalData) => {
    if (get(originalData, 'mentorSessions') && get(extractedData, 'session')) {
      extractedData.session.forEach((session, index) => {
        const originalSessionData = originalData.mentorSessions.filter(
          originalSession => originalSession.id === session.id
        )
        if (get(originalSessionData, '0')) {
          extractedData.session[index].mentorName = get(originalSessionData, '0.user.name') ||
              get(originalSessionData, '0.user.username')
        }
      })
    }

    if (get(originalData, 'mentorSessions').length === 0) {
      extractedData.session = []
    }

    return extractedData
  }
})

export {
  getFilters
}

export default fetchSessions
