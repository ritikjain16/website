import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/chapters'

const REMOVE_THUMBNAIL_CHAPTER_QUERY = (chapterId, thumbnailId) => gql`
  mutation {
    removeFromChapterThumbnail(
      chapterId: "${chapterId}",
      fileId:"${thumbnailId}"
    ) {
      chapter {
        id
      }
    }
  }
`

const removeThumbnailChapterLoading = id => ({
  type: actions.REMOVE_THUMBNAIL_LOADING,
  id
})

const removeThumbnailChapterSuccess = id => ({
  type: actions.REMOVE_THUMBNAIL_SUCCESS,
  id
})

const removeThumbnailChapterFailure = error => ({
  type: actions.REMOVE_THUMBNAIL_FAILURE,
  error
})

const removeThumbnailChapter = (chapterId, thumbnailId) => async dispatch => {
  try {
    dispatch(removeThumbnailChapterLoading(chapterId))
    const { data } = await requestToGraphql(
      REMOVE_THUMBNAIL_CHAPTER_QUERY(chapterId, thumbnailId)
    )
    const id = get(data, 'removeFromChapterThumbnail.fieldChapter.id', null)
    if (id) {
      dispatch(removeThumbnailChapterSuccess(id))
      return id
    }
    dispatch(removeThumbnailChapterFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(removeThumbnailChapterFailure(error))
  }
  return {}
}

export default removeThumbnailChapter
