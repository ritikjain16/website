export const UPDATE_OLD_PASSWORD = 'UPDATE_OLD_PASSWORD'

const updateOldPassword = oldPassword => ({
  type: UPDATE_OLD_PASSWORD,
  oldPassword
})

export default updateOldPassword
