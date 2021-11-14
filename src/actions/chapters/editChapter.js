import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import transformChapter from './utils/transformChapter'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/chapters'

const EDIT_CHAPTER_QUERY = (id) => gql`
  mutation updateChapter (
    $input: ChapterUpdate!,
    $courseMapping:[ID]
  ){
    updateChapter(
      id: "${id}"
      input: $input,
      coursesConnectIds:$courseMapping
    ) {
      id
      order
      title
      description
      status
      createdAt
      updatedAt
      courses{
        id,
        title
      }
      topics {
        id
      }
    }
  }
`

const editChapterLoading = (id) => ({
  type: actions.EDIT_LOADING,
  id
})

const editChapterSuccess = (id, chapter) => ({
  type: actions.EDIT_SUCCESS,
  id,
  chapter
})

const editChapterFailure = error => ({
  type: actions.EDIT_FAILURE,
  error
})


const editChapter = ({ id, file, courseMapping, ...input }) => async dispatch => {
  try {
    dispatch(editChapterLoading(id))
    const { data } = await requestToGraphql(
      EDIT_CHAPTER_QUERY(id), {
        input,
        courseMapping
      }
    )
    const { updateChapter: chapter } = data
    if (chapter.id) {
      const transformedChapter = transformChapter(chapter)
      if (file) {
        const mappingInfo = {
          typeId: chapter.id,
          type: 'Chapter',
          typeField: 'thumbnail'
        }
        const fileInfo = {
          fileBucket: 'python'
        }
        const uploadedFileInfo = await uploadFile(file, fileInfo, mappingInfo)
        if (uploadedFileInfo.id) {
          const transformChapterWithFileInfo = {
            ...transformedChapter,
            thumbnail: { ...uploadedFileInfo } }
          dispatch(editChapterSuccess(id, transformChapterWithFileInfo))
          return transformChapterWithFileInfo
        }
      }
      dispatch(editChapterSuccess(id, transformedChapter))
      return transformedChapter
    }
    dispatch(editChapterFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(editChapterFailure(error))
  }
  return {}
}

export default editChapter
