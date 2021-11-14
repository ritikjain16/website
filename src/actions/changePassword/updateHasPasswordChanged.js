export const UPDATE_HAS_PASSWORD_CHANGED = 'UPDATE_HAS_PASSWORD_CHANGED'

const updateHasPasswordChanged = hasPasswordChanged => ({
  type: UPDATE_HAS_PASSWORD_CHANGED,
  hasPasswordChanged
})

export default updateHasPasswordChanged
