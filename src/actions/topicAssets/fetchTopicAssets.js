import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'


export const TOPIC_ASSETS_LOADING = 'TOPIC_ASSETS_LOADING'
export const TOPIC_ASSETS_SUCCESS = 'TOPIC_ASSETS_SUCCESS'
export const TOPIC_ASSETS_FAILURE = 'TOPIC_ASSETS_FAILURE'

const TOPIC_ASSETS_QUERY = topicId => gql`
  query{
    learningObjectives(filter: {topic_some: {id: "${topicId}"}}) {
      id
      title
      order
      imageMessageCount: techTalk {
        messagesMeta(filter: {type: image}) {
          count
        }
      }
      textMessageCount: techTalk {
        messagesMeta(filter: {type: text}) {
          count
        }
      }
      terminalInputMessageCount: techTalk {
        messagesMeta(filter: {type: terminalInput}) {
          count
        }
      }
      terminalOutputMessageCount: techTalk {
        messagesMeta(filter: {type: terminalOutput}) {
          count
        }
      }
      quizCount: questionBankMeta(filter: {assessmentType: quiz}) {
        count
      }
      practiceQuestionCount: questionBankMeta(filter: {assessmentType: practiceQuestion}) {
        count
      }
    }
  }
`

const topicAssetsLoading = () => ({
  type: TOPIC_ASSETS_LOADING
})

const topicAssetsSuccess = (topicAssets) => ({
  type: TOPIC_ASSETS_SUCCESS,
  topicAssets
})

const topicAssetsFailure = error => ({
  type: TOPIC_ASSETS_FAILURE,
  error
})

const isObject = obj => obj === Object(obj)

const fetchTopicAssets = (topicId) => async (dispatch) => {
  try {
    dispatch(topicAssetsLoading())
    const { data } = await requestToGraphql(TOPIC_ASSETS_QUERY(topicId))
    if (isObject(data)) {
      const topicAssets = data.learningObjectives
      if (Array.isArray(topicAssets)) {
        dispatch(topicAssetsSuccess(topicAssets))
        return topicAssets
      }
    }
    dispatch(topicAssetsFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    if (error) {
      dispatch(topicAssetsFailure(error))
    } else {
      dispatch(topicAssetsFailure(errors.UnexpectedError))
    }
  }
  return {}
}

export default fetchTopicAssets
