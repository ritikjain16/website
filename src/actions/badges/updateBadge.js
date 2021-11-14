import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { badgesFactory as actions } from '../../reducers/badges'
import uploadFile from '../utils/uploadFile'
import fileBucket from '../../constants/fileInput'

const EDIT_BADGE = id => gql`
    mutation($input:BadgeUpdate){
        updateBadge(id:"${id}",input:$input){
            id
            order
            name
            topic{
              id
              title
            }
            createdAt
            updatedAt
            status
            type
            description
            unlockPoint
        }
    }
`

const editBadgeLoading = (editingBadgeId) => ({
  type: actions.EDIT_LOADING,
  id: editingBadgeId
})

const editBadgeSuccess = (editedBadge) => ({
  type: actions.EDIT_SUCCESS,
  id: editedBadge.id,
  badge: editedBadge
})

const editBadgeFailure = (editingBadgeId, editingBadgeError) => ({
  type: actions.EDIT_FAILURE,
  id: editingBadgeId,
  error: editingBadgeError
})

const editBadge = ({ files, isThumbnails, id, input }) => async dispatch => {
  try {
    dispatch(editBadgeLoading(id))
    const { data } = await requestToGraphql(EDIT_BADGE(id), { input })
    const editedBadge = get(data, 'updateBadge', null)
    let editedBadgeWithFileInfo = { ...editedBadge }
    if (editedBadge && editedBadge.id) {
      // if file is present upload or just dispatch success with updated Badge
      const fileInput = {
        fileBucket: fileBucket.python
      }
      if (isThumbnails && isThumbnails[0] && files[0]) {
        const mappingInfo = {
          type: 'Badge',
          typeField: 'inactiveImage',
          typeId: editedBadge.id
        }
        // upload the file if new thumbnail is provided
        const uploadedFile = await uploadFile(files[0], fileInput, mappingInfo)
        if (uploadedFile && uploadedFile.id) {
          // add the thumbnail info to the updated Badge object
          editedBadgeWithFileInfo = { ...editedBadgeWithFileInfo, inactiveImage: uploadedFile }
        }
      }
      if (isThumbnails && isThumbnails[1] && files[1]) {
        const mappingInfo = {
          type: 'Badge',
          typeField: 'activeImage',
          typeId: editedBadge.id
        }
        // upload the file if new thumbnail is provided
        const uploadedFile = await uploadFile(files[1], fileInput, mappingInfo)
        if (uploadedFile && uploadedFile.id) {
          // add the thumbnail info to the updated Badge object
          editedBadgeWithFileInfo = { ...editedBadgeWithFileInfo, activeImage: uploadedFile }
        }
      }
      dispatch(editBadgeSuccess(editedBadgeWithFileInfo))
      return editedBadgeWithFileInfo
    }
    dispatch(editBadgeFailure(id, errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editBadgeFailure(id, error))
  }
  return {}
}

export default editBadge
