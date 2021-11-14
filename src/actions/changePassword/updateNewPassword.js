export const UPDATE_NEW_PASSWORD = 'UPDATE_NEW_PASSWORD'

const updateNewPassword = newPassword => ({
  type: UPDATE_NEW_PASSWORD,
  newPassword
})

export default updateNewPassword
