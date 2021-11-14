import gql from 'graphql-tag'
import { get } from 'lodash'
import moment from 'moment'
import requestToGraphql from '../../../../../utils/requestToGraphql'

export const getSelectedSlots = (session) => {
  const selectedSlots = []
  for (const property in session) {
    if (property.startsWith('slot')) {
      if (session[property] === true) {
        selectedSlots.push(property)
      }
    }
  }
  return selectedSlots
}

export const getMentorFromBatch = (batchSessions, time) => {
  let showMentor = true
  let batchExistWithEmptyStudent = null
  if (batchSessions && batchSessions.length > 0) {
    batchSessions.forEach(bSession => {
      const selectedSlots = getSelectedSlots(bSession)
      if (selectedSlots.length > 0 && selectedSlots.includes(`slot${time}`)) {
        const slotTime = moment().set('hours', time).set('minutes', 0)
        let slotTimeDiff = 0
        if (moment(slotTime).isAfter(moment(new Date()))) {
          slotTimeDiff = moment(slotTime).diff(moment(new Date()))
        }
        const duration = moment.duration(moment(slotTimeDiff))
        const hoursValue = Math.floor(duration.asHours())
        if (hoursValue > 2
          || (hoursValue < 2 && get(bSession, 'batch.studentsMeta.count', 0) > 0)) {
          showMentor = false
        } else if (hoursValue < 2 && get(bSession, 'batch.studentsMeta.count', 0) === 0) {
          batchExistWithEmptyStudent = bSession
        }
      }
    })
  }
  return { showMentor, batchExistWithEmptyStudent }
}

export const getMentorMenteeSession = async (id) => {
  const response = await requestToGraphql(gql`
  {
    mentorMenteeSessions(
      filter: {
        and: [
          { menteeSession_some: { id: "${id}" } },
          { topic_some: { order: 1 } },
        ]
      }
    ) {
      mentorSession {
        user {
          id
          name
        }
      }
    }
  }
  `)
  return response
}

export const checkIfNotOldSlot = (date, time) => (
  new Date(date).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ||
  (
    new Date(date).setHours(0, 0, 0, 0) ===
    new Date().setHours(0, 0, 0, 0) &&
    time > new Date().getHours()
  )
)
