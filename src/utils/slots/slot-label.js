const getSlotLabel = (slotNum) => {
  const slotNumber = Number(slotNum)
  let startTime = ''
  let endTime = ''

  if (slotNumber < 12) {
    if (slotNumber === 0) {
      startTime = '12 am'
    } else {
      startTime = `${slotNumber} am`
    }
    if (slotNumber === 11) {
      endTime = '12 pm'
    } else {
      endTime = `${slotNumber + 1} am`
    }
  } else if (slotNumber === 12) {
    startTime = '12 pm'
    endTime = '1 pm'
  } else if (slotNumber > 12) {
    startTime = `${slotNumber - 12} pm`
    if (slotNumber === 23) {
      endTime = '12 am'
    } else {
      endTime = `${slotNumber - 11} pm`
    }
  }

  return {
    startTime,
    endTime
  }
}

export default getSlotLabel
