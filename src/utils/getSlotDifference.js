import moment from 'moment'
import MAX_SLOT_DIFFERENCE from '../constants/slotDifference'


const getSlotDifference = (slot, date) => {
  slot = Number(slot)
  const currentTime = moment()
  const newtime = moment(date).set('hours', slot)
  const diff = moment(newtime).diff(moment(currentTime))
  const duration = moment.duration(moment(diff))
  const hoursValue = Math.floor(duration.asHours())
  return hoursValue < MAX_SLOT_DIFFERENCE
}

export default getSlotDifference

