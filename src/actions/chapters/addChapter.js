import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import transformChapter from './utils/transformChapter'
import getActionsError from '../../utils/getActionsError'
import uploadFile from '../utils/uploadFile'
import actions from '../../reducers/chapters'

const ADD_CHAPTER_QUERY = gql`
  mutation addChapter(
    $input: ChapterInput!,
    $connectIds:[ID]
  ) {
    addChapter(
      input: $input,
      coursesConnectIds:$connectIds
    ) {
      id
      title
      description
      status
      order
      createdAt
      updatedAt
      courses{
        id
        title
        description
      }
      topics {
        id
      }
    }
  }
`

const addChapterLoading = () => ({
  type: actions.ADD_LOADING
})

const addChapterSuccess = chapter => ({
  type: actions.ADD_SUCCESS,
  chapter
})

const addChapterFailure = error => ({
  type: actions.ADD_FAILURE,
  error
})

const addChapter = ({ file, isThumbnail, thumbnailUrl,
  courseMapping, ...input }) => async dispatch => {
  try {
    dispatch(addChapterLoading(courseMapping))
    const { data } = await requestToGraphql(
      ADD_CHAPTER_QUERY, {
        input, connectIds: courseMapping
      }
    )
    const { addChapter: chapter } = data
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
          dispatch(addChapterSuccess(transformChapterWithFileInfo))
          return transformChapterWithFileInfo
        }
      }
      dispatch(addChapterSuccess(transformedChapter))
      return transformedChapter
    }
    dispatch(addChapterFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(addChapterFailure(error))
  }
  return {}
}

export default addChapter
