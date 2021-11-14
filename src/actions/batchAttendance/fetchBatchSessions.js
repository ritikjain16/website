import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import { MENTOR, SALES_EXECUTIVE } from '../../constants/roles'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'
import getSlotNames from '../../utils/slots/slot-names'

const getFilters = (filterQuery) => {
  if (filterQuery) {
    return filterQuery
  }
  return ''
}
const getBatchCodeFilter = (batchCodeFilter) => {
  if (batchCodeFilter) {
    return batchCodeFilter
  }
  return ''
}
const getBatchDates = (fromDate, toDate) => {
  let filterDate = ''
  if (fromDate && toDate) {
    filterDate += `{bookingDate_gte:"${moment(fromDate)
      .startOf('day')
      .toDate()
      .toISOString()}"}`
    filterDate += `{bookingDate_lte:"${moment(toDate)
      .endOf('day')
      .toDate()
      .toISOString()}"}`
  } else if (fromDate && !toDate) {
    filterDate += `{bookingDate_gte:"${moment(fromDate)
      .startOf('day')
      .toDate()
      .toISOString()}"}`
  } else if (!fromDate && toDate) {
    filterDate += `{bookingDate_lte:"${moment(toDate)
      .endOf('day')
      .toDate()
      .toISOString()}"}`
  } else if (!fromDate && !toDate) {
    filterDate = ''
  }
  if (filterDate) {
    return filterDate
  }
  return ''
}

const fetchBatchSessions = async ({
  filterQuery, mentorsId, role, batchCodeFilter, perPage, skip,
  fromDate, toDate, key
}) =>
  duck.query({
    query: gql`
          query{
        batchSessions(
            filter:{and:[
              {
                batch_some: {
                  and: [
                    ${getBatchCodeFilter(batchCodeFilter)}
                    ${getFilters(filterQuery)}
                     ${role === SALES_EXECUTIVE || role === MENTOR ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}` : ''}
                  ]
                }
              }
              {mentorSession_exists:true}
              ${getBatchDates(fromDate, toDate)}
            ]}
            orderBy : createdAt_DESC
            first: ${perPage}
            skip: ${perPage * skip}
          ){
          id
          sessionStatus
          bookingDate
          createdAt
          sessionStartDate
          sessionEndDate
          sessionAllotmentDate
          sessionRecordingLink
          sessionCommentByMentor
          mentorPaymentJustification
          attendance {
            student {
              id
              user {
                id
                username
                name
              }
              parents {
                user {
                  username
                  name
                  email
                  phone {
                    number
                  }
                }
              }
            }
            isPresent
            status
            absentReason
          }
          topic {
            id
            title
          }
          mentorSession {
            user {
              id
              name
            }
          }
          batch {
            id
            code
            school {
              id
              name
            }
            course {
              title
            }
            allottedMentor {
              id
              username
              name
              email
              inviteCode
              phone {
                number
              }
            }
            students {
              id
              user {
                id
              }
            }
            description
            studentsMeta {
              count
            }
          }
          ${getSlotNames()}
        }
        
        batchSessionsMeta(
          filter:{and:[
              {
                batch_some: {
                  and: [
                    ${getBatchCodeFilter(batchCodeFilter)}
                    ${getFilters(filterQuery)}
                     ${role === SALES_EXECUTIVE || role === MENTOR ? `{allottedMentor_some:{id_in:[${getIdArrForQuery(mentorsId)}]}}` : ''}
                  ]
                }
              }
              {mentorSession_exists:true}
              ${getBatchDates(fromDate, toDate)}
            ]}
        ){
          count
        }
    }
    `,
    type: 'batchSessions/fetch',
    key: key ? `batchSessions/${key}` : 'batchSessions',
    changeExtractedData: (extractedData, originalData) => {
      extractedData.batchSessions = get(originalData, 'batchSessions', [])
      extractedData.batchSessionsMeta = get(originalData, 'batchSessionsMeta', 0)
      return { ...extractedData }
    }
  })

export default fetchBatchSessions
