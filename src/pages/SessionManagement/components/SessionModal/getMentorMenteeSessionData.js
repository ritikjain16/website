import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../../../utils/requestToGraphql'
import getSlotNames from '../../../../utils/slots/slot-names'

const getMentorMenteeSessionData = async (date) => {
  const data = await requestToGraphql(gql`
    {
    availableSlots(filter: { and: [{ date: "${date}" }] }, orderBy: date_ASC) {
      date
      ${getSlotNames()}
    }
    }`)
  return data
}

export const getMentorSessions = async (date, sessionType, userId) => {
  const data = await requestToGraphql(gql`
    {
    mentorSessions(
      filter: { and: [
      { availabilityDate: "${date}" },
      { sessionType: ${sessionType} }
      { user_some: { id: "${userId}" } }] }
    ) {
      id
    }
  }
  `)
  return get(data, 'data.mentorSessions')
}


export default getMentorMenteeSessionData
