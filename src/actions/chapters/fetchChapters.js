import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import transformChapters from './utils/transformChapters'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/chapters'

const FETCH_CHAPTERS_QUERY = gql`
  {
    chapters {
      id
      title
      description
      status
      order
      createdAt
      updatedAt
      topics {
        id
      }
      thumbnail {
        id
        name
        uri
        signedUri
      }
      courses{
        title,
        id
      }
    }
  }
`

const fetchChaptersLoading = () => ({
  type: actions.FETCH_LOADING
})

const fetchChaptersSuccess = chapters => ({
  type: actions.FETCH_SUCCESS,
  chapters
})

const fetchChaptersFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const fetchChapters = () => async dispatch => {
  try {
    dispatch(fetchChaptersLoading())
    const { data } = await requestToGraphql(FETCH_CHAPTERS_QUERY)
    const { chapters } = data
    if (Array.isArray(chapters)) {
      const transformedChapters = transformChapters(chapters)
      dispatch(fetchChaptersSuccess(transformedChapters))
      return transformChapters
    }
    dispatch(fetchChaptersFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(fetchChaptersFailure(error))
  }
  return {}
}

export default fetchChapters
