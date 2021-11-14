export const UPDATE_CONFIRM_NEW_PASSWORD = 'UPDATE_CONFIRM_NEW_PASSWORD'

const updateConfirmNewPassword = username => ({
  type: UPDATE_CONFIRM_NEW_PASSWORD,
  username
})

export default updateConfirmNewPassword
