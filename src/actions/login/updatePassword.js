export const UPDATE_PASSWORD = 'UPDATE_PASSWORD'

const updatePassword = password => ({
  type: UPDATE_PASSWORD,
  password
})

export default updatePassword
