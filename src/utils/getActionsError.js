import { get } from 'lodash'
import errors from '../constants/errors'

const getActionsError = e => {
  console.error(e) // eslint-disable-line no-console
  const errorMessage = get(e, 'errors[0].message') || get(e, 'status')
  if (errorMessage) {
    return errorMessage
  }
  return errors.UnexpectedError
}

export default getActionsError
