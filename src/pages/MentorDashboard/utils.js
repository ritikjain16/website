import gql from 'graphql-tag'
import moment from 'moment'
import appConfig from '../../config/appConfig'
import requestToGraphql from '../../utils/requestToGraphql'
import getSlotNames from '../../utils/slots/slot-names'

export const withHttps = (url) => url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) => schemma ? match : `https://${nonSchemmaUrl}`)

const getSelectedSlotsStringArray = (slots = {}) => {
  const slotTimeStringArray = []
  Object.keys(slots).forEach(slot => {
    if (slot.includes('slot')) {
      if (slots[slot]) {
        slotTimeStringArray.push(slot)
      }
    }
  })
  return slotTimeStringArray
}

export const getSlotLabel = (slotNumberString, isCapital = true) => {
  const slotNumber = Number(slotNumberString)
  let AM = 'AM'
  let PM = 'PM'
  if (!isCapital) {
    AM = 'am'
    PM = 'pm'
  }
  let startTime = ''
  let endTime = ''
  if (slotNumber < 12) {
    if (slotNumber === 0) {
      startTime = `12:00 ${AM}`
    } else {
      startTime = `${slotNumber}:00 ${AM}`
    }
    if (slotNumber === 11) {
      endTime = `12:00 ${PM}`
    } else {
      endTime = `${slotNumber + 1}:00 ${AM}`
    }
  } else if (slotNumber > 12) {
    startTime = `${slotNumber - 12}:00 ${PM}`
    if (slotNumber === 23) {
      endTime = `12:00 ${AM}`
    } else {
      endTime = `${slotNumber - 11}:00 PM`
    }
  } else {
    startTime = `12:00 ${PM}`
    endTime = `1:00 ${PM}`
  }
  return {
    startTime,
    endTime
  }
}

export const getSlotTime = (batchSession, newLogic = false) => {
  const slotTimeStringArray = getSelectedSlotsStringArray(batchSession)
  if (newLogic) {
    const slotArr = slotTimeStringArray.map(slots => {
      const label = getSlotLabel(slots.split('slot')[1])
      return label
    })
    return slotArr
  }
  if (slotTimeStringArray && slotTimeStringArray.length) {
    const slotNumber = slotTimeStringArray[0].split('slot')[1]
    const label = getSlotLabel(slotNumber)
    return label
  }
  return null
}

export const getMentorMenteeSessionData = async (date) => {
  const data = await requestToGraphql(gql`
    {
    availableSlots(filter: { and: [{ date: "${date}" }] }, orderBy: date_ASC) {
      date
      ${getSlotNames()}
    }
    }`)
  return data
}

export const getMentorSessionData = async (date, mentorId, sessionType) => {
  const data = await requestToGraphql(gql`
    {
    mentorSessions(
      filter: { and: [
      { availabilityDate: "${date}" },
      ${sessionType ? `{ sessionType: ${sessionType} }` : '{ sessionType: trial }'}
      ${mentorId ? `{ user_some: { id: "${mentorId}" } }` : ''}
    ] }
    ) {
      id
      ${getSlotNames()}
    }
  }
  `)
  return data
}

export const getSelectedSlots = (slotsObj, checkCount = false) => {
  const selectedSlots = []
  for (let i = 0; i < appConfig.timeSlots.length; i += 1) {
    if (checkCount) {
      if (slotsObj[`slot${appConfig.timeSlots[i]}`] > 1) {
        const slotObj = {}
        slotObj[`slot${appConfig.timeSlots[i]}`] = slotsObj[`slot${appConfig.timeSlots[i]}`]
        selectedSlots.push(slotObj)
      }
      /* eslint-disable no-lonely-if */
    } else {
      if (slotsObj[`slot${appConfig.timeSlots[i]}`]) {
        selectedSlots.push(appConfig.timeSlots[i])
      }
    }
  }
  return selectedSlots
}


export const getDates = (startDate, stopDate) => {
  const dateArray = []
  let currentDate = moment(startDate).endOf('day')
  while (currentDate <= moment(stopDate).endOf('day')) {
    dateArray.push({
      date: new Date(moment(currentDate).endOf('day')),
      month: moment(currentDate).month()
    })
    currentDate = moment(currentDate).add(1, 'day')
  }
  return dateArray
}


export default { getSlotTime }
