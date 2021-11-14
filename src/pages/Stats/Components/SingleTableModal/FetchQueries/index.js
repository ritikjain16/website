import getRegUsers from './RegisteredUsers'
import getRegNotBookedUsers from './RegisteredNotBookedUsers'
import getBookedAndMissedSessions from './SessionsBookedAndMissed'
import getFutureBookedSessions from './FutureSessionsBooked'
import getPaidUsers from './PaidUsers'

const fetchData = {
  getRegUsers,
  getRegNotBookedUsers,
  getFutureBookedSessions,
  getPaidUsers,
  getBookedAndMissedSessions
}

export default fetchData