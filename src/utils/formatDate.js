import { format } from 'date-fns'

const getMinutes = (date) => {
  if (date.getMinutes() && date.getMinutes().toString().length === 1) {
    return `0${date.getMinutes()}`
  }

  return date.getMinutes()
}

const formatDate = date => {
  const d = new Date(date)
  return {
    date: format(date, 'DD-MM-YY'),
    time: format(date, 'HH:mm:ss'),
    formattedTime: `${d.getHours()}:${getMinutes(d)}`,
    timeHM: format(date, 'HH:mm')
  }
}

export default formatDate
