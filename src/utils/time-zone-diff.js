import ct from 'countries-and-timezones'
import { get } from 'lodash'
import getSlotLabel from './slots/slot-label'

const getIntlDateTime = (date, istTime, targetTimezone) => {
  const timezone = ct.getTimezone(targetTimezone)
  const indianOffset = get(ct.getTimezone('Asia/Kolkata'), 'dstOffset')
  const intlOffset = get(timezone, 'dstOffset')
  const timeDiffInMs = (indianOffset - intlOffset) * 60 * 1000
  const offsetedSelectedDateInMs =
    new Date(date).setHours(0, 0, 0, 0) - timeDiffInMs
  const dateAfterSlotOffset = new Date(
    offsetedSelectedDateInMs + (istTime * 60 * 60 * 1000)
  )
  const intlDate = `${dateAfterSlotOffset.getDate()}-${dateAfterSlotOffset.getMonth() + 1}-${dateAfterSlotOffset.getFullYear()}`
  const hourAfterOffset = getSlotLabel(dateAfterSlotOffset.getHours()).startTime.split(' ')[0]
  const minAfterOffset = dateAfterSlotOffset.getMinutes() < 10
    ? `0${dateAfterSlotOffset.getMinutes()}`
    : dateAfterSlotOffset.getMinutes()
  const meridian = getSlotLabel(dateAfterSlotOffset.getHours()).startTime.split(' ')[1]
  const intlTime = `${hourAfterOffset}:${minAfterOffset} ${meridian}`

  return {
    intlDate,
    intlTime
  }
}

export default getIntlDateTime
