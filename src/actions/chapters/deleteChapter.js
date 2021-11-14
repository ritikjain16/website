import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/chapters'

const DELETE_CHAPTER_QUERY = id => gql`
  mutation {
    deleteChapter(id: "${id}") {
      id
      title
    }
  }
`

const deleteChapterLoading = id => ({
  type: actions.DELETE_LOADING,
  id
})

const deleteChapterSuccess = id => ({
  type: actions.DELETE_SUCCESS,
  id
})

const deleteChapterFailure = error => ({
  type: actions.DELETE_FAILURE,
  error
})


const deleteChapter = id => async dispatch => {
  try {
    dispatch(deleteChapterLoading(id))
    const { data } = await requestToGraphql(DELETE_CHAPTER_QUERY(id))
    const { deleteChapter: chapter } = data
    if (chapter.id) {
      dispatch(deleteChapterSuccess(chapter.id))
      return chapter
    }
    dispatch(deleteChapterFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(deleteChapterFailure(error))
  }
  return {}
}

export default deleteChapter
