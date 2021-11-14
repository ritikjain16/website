import moment from 'moment'

const dateFormat = (date, format) => (moment(date)).format(format)
// eslint-disable-next-line no-unused-vars
const formatDate = (date) => {
  let dd = date.getDate()
  let mm = date.getMonth() + 1
  const yyyy = date.getFullYear()
  if (dd < 10) { dd = `0${dd}` }
  if (mm < 10) { mm = `0${mm}` }
  date = `${dd}-${mm}-${yyyy}`
  return date
}
export const lastNdates = (n) => [...Array(n)].map((_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i - 1)
  return moment(d).format('DD MMM YYYY')
})

export default dateFormat
