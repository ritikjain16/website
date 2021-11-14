import getSlotLabel from './slot-label'
import getSelectedSlotsStringArray from './slots-sting-array'

// to get the slot time for the sessions

const getSlotTime = (menteeSessions, returnEndTime = false) => {
  const slotTimeStringArray = getSelectedSlotsStringArray(menteeSessions)
  if (slotTimeStringArray && slotTimeStringArray.length) {
    const slotNumber = slotTimeStringArray[0].split('slot')[1]
    const label = getSlotLabel(slotNumber)
    if (returnEndTime) return label
    return label.startTime
  }
  return '-'
}

export default getSlotTime
