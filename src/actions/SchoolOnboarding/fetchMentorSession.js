import gql from 'graphql-tag'
import { get, sortBy } from 'lodash'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchMentorSession = async (date) =>
  duck.query({
    query: gql`
    {
      mentorSessions(
        filter: {
          and: [
            { sessionType: trial }
            { availabilityDate: "${date}" }
          ]
        }
      ) {
        id
        availabilityDate
        user {
          id
          name
        }
        batchSessions {
          id
          bookingDate
          ${getSlotNames()}
          mentorSession {
            id
            user {
              id
              name
            }
          }
        }
        mentorMenteeSessions {
          id
          mentorSession {
            id
            user {
              id
              name
            }
          }
          menteeSession {
            id
            bookingDate
            ${getSlotNames()}
          }
        }
        ${getSlotNames()}
      }
    }
    `,
    type: 'mentorSessions/fetch',
    key: 'mentorSessions',
    changeExtractedData: (extractedData, originalData) => {
      let slots = []
      for (let i = 0; i < 24; i += 1) {
        const slot = {
          [`slot${i}`]: 0,
          mentors: [],
          id: i,
          sName: `slot${i}`,
          // limit: get(originalData, 'availableSlots[0]', {})[`slot${i}`]
        }
        slots.push(slot)
      }
      const getMentorsList = (mentors) => {
        const mentorsList = []
        mentors.forEach(mentor => {
          if (mentor) {
            const isExist = mentorsList.find((ment) => get(ment, 'id') === mentor.id)
            if (!isExist) {
              mentorsList.push(mentor)
            }
          }
        })
        return mentorsList
      }
      let finalSlots = []
      get(originalData, 'mentorSessions', []).forEach(session => {
        const sessionSlots = []
        for (const property1 in session) {
          if (property1.startsWith('slot')) {
            if (session[property1] === true) {
              sessionSlots.push(property1)
              const data = slots.find(slot => slot.sName === property1)
              if (data) {
                data[property1] += 1
                const batchAndMenteeSession = get(session, 'batchSessions', [])
                get(session, 'mentorMenteeSessions', []).forEach(menteeSession => {
                  batchAndMenteeSession.push(get(menteeSession, 'menteeSession'))
                })
                if (batchAndMenteeSession.length > 0) {
                  let isExist = false
                  batchAndMenteeSession.forEach(bSession => {
                    for (const pro in bSession) {
                      if (pro.startsWith('slot')) {
                        if (bSession[property1] === true) {
                          isExist = true
                        }
                      }
                    }
                  })
                  if (!isExist) {
                    data.mentors.push({ ...get(session, 'user'), mentorSessionConnectId: get(session, 'id') })
                  }
                } else {
                  data.mentors.push({ ...get(session, 'user'), mentorSessionConnectId: get(session, 'id') })
                }
              }
              const newSlots = slots.filter(({ sName }) => sName !== property1)
              data.mentors = getMentorsList(data.mentors)
              slots = [...newSlots, data]
            }
          }
        }
        const batchSlots = []
        if (get(session, 'batchSessions', []).length > 0) {
          get(session, 'batchSessions', []).forEach(bSession => {
            for (const property2 in bSession) {
              if (property2.startsWith('slot')) {
                if (bSession[property2] === true) {
                  batchSlots.push(property2)
                }
              }
            }
          })
        }
        const mentorMenteeSlots = []
        const batchAndMenteeSession = get(session, 'batchSessions', [])
        get(session, 'mentorMenteeSessions', []).forEach(menteeSession => {
          batchAndMenteeSession.push(get(menteeSession, 'menteeSession'))
        })
        if (get(session, 'mentorMenteeSessions', []).length > 0 && get(session, 'mentorMenteeSessions.menteeSession')) {
          get(session, 'mentorMenteeSessions', []).forEach(mmSession => {
            const mSession = get(mmSession, 'menteeSession')
            for (const property3 in mSession) {
              if (property3.startsWith('slot')) {
                if (mSession[property3] === true) {
                  mentorMenteeSlots.push(property3)
                }
              }
            }
          })
        }
        const newFinalSlots = sessionSlots.filter(slot =>
          ![...new Set(batchSlots)].includes(slot)
          && ![...new Set(mentorMenteeSlots)].includes(slot))
        finalSlots = [...finalSlots, ...newFinalSlots]
      })
      const slotsToReturn = slots.filter(({ sName }) => finalSlots.includes(sName))
      extractedData.mentorSessions = sortBy(slotsToReturn, 'id')
      return { ...extractedData }
    }
  })

export default fetchMentorSession

