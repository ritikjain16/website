import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { badgesFactory as actions } from '../../reducers/badges'
import uploadFile from '../utils/uploadFile'
import fileBucket from '../../constants/fileInput'

const ADD_BADGE = gql`
    mutation($input: BadgeInput!,$topicConnectId:ID){
        addBadge(input:$input,topicConnectId:$topicConnectId){
            id
            order
            name
            type
            topic{
              id
              title
            }
            status
            createdAt
            updatedAt
            description
            unlockPoint
        }
    }
`
const addBadgeLoading = () => ({
  type: actions.ADD_LOADING
})
const addBadgeSuccess = (badge) => ({
  type: actions.ADD_SUCCESS,
  badge
})
const addBadgeFailure = (error) => ({
  type: actions.ADD_FAILURE,
  error
})
const addBadge = ({ files, input, topicConnectId }) => async dispatch => {
  try {
    dispatch(addBadgeLoading())
    const { data } = await requestToGraphql(ADD_BADGE, { input, topicConnectId })
    const addedBadge = get(data, 'addBadge', null)
    let addedBadgeWithFileInfo = { ...addedBadge }
    if (addedBadge.id) {
      // if thumbnail is present upload
      const fileInput = {
        fileBucket: fileBucket.python
      }
      if (files[0]) {
        const mappingInfoInactive = {
          type: 'Badge',
          typeField: 'inactiveImage',
          typeId: addedBadge.id
        }
        // upload file and connect to badge
        const uploadedFile = await uploadFile(files[0], fileInput, mappingInfoInactive)
        if (uploadedFile && uploadedFile.id) {
          // Adding the file info the badge object
          addedBadgeWithFileInfo = { ...addedBadgeWithFileInfo, inactiveImage: uploadedFile }
        }
      }
      if (files[1]) {
        const mappingInfoInactive = {
          type: 'Badge',
          typeField: 'activeImage',
          typeId: addedBadge.id
        }
        // upload file and connect to badge
        const uploadedFile = await uploadFile(files[1], fileInput, mappingInfoInactive)
        if (uploadedFile && uploadedFile.id) {
          // Adding the file info the badge object
          addedBadgeWithFileInfo = { ...addedBadgeWithFileInfo, activeImage: uploadedFile }
        }
      }
      // if thumbnail is not present
      dispatch(addBadgeSuccess(addedBadgeWithFileInfo))
      return addedBadgeWithFileInfo
    }
    dispatch(addBadgeFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addBadgeFailure(error))
  }
  return {}
}

export default addBadge
