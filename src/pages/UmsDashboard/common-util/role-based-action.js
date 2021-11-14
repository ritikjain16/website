import fetchUsers from '../../../actions/ums/fetchUsers'
import fetchUsersCount from '../../../actions/ums/fetchUserCount'
import hasUserAcces from './users-access'

const getRoleBasedUserAndCount = async (userId, userRole, fetchLimits) => {
  if (hasUserAcces(userRole)) {
    await fetchUsers(fetchLimits)
    fetchUsersCount(fetchLimits)
  }
}

export default getRoleBasedUserAndCount
