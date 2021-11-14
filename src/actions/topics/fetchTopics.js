import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/topics'

const FETCH_TOPICS_QUERY = gql`
  query{
    topics {
      id
      title
      description
      status
      order
      isTrial
      createdAt
      updatedAt
      videoStatus
      isQuestionInMessageEnabled
      chapter {
        id
        title
        order
        courses {
          id
          title
        }
      }
      thumbnail {
        id
        name
        uri
        signedUri
      }
      thumbnailSmall {
        id
        name
        uri
        signedUri
      }
      publishedLOCount : learningObjectivesMeta(filter:{
        status:published
      }){
        count
      }
      unPublishedLOCount : learningObjectivesMeta(filter:{
        status:unpublished
      }){
        count
      }
      publishedPQCount : questionsMeta(filter:{
        and:[
          {
            assessmentType:practiceQuestion
          },
          {
            status:published
          }
        ]
      }){
        count
      }
      unPublishedPQCount : questionsMeta(filter:{
        and:[
          {
            assessmentType:practiceQuestion
          },
          {
            status:unpublished
          }
        ]
      }){
        count
      }
      publishedQuizCount : questionsMeta(filter:{
        and:[
          {
            assessmentType:quiz
          },
          {
            status:published
          }
        ]
      }){
        count
      }
      unPublishedQuizCount : questionsMeta(filter:{
        and:[
          {
            assessmentType:quiz
          },
          {
            status:unpublished
          }
        ]
      }){
        count
      }
      publishedBadgesCount : badgesMeta(filter:{
        status:published
      }){
        count
      }
      unPublishedBadgesCount : badgesMeta(filter:{
        status:unpublished
      }){
        count
      }
    }
  }
`

const fetchTopicsLoading = () => ({
  type: actions.FETCH_LOADING
})

const fetchTopicsSuccess = topics => ({
  type: actions.FETCH_SUCCESS,
  topics
})

const fetchTopicsFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})

const fetchTopics = () => async dispatch => {
  try {
    dispatch(fetchTopicsLoading())
    const { data } = await requestToGraphql(FETCH_TOPICS_QUERY)
    const { topics } = data

    if (Array.isArray(topics)) {
      dispatch(fetchTopicsSuccess(topics))
      return topics
    }

    dispatch(fetchTopicsFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(fetchTopicsFailure(error))
  }
  return {}
}

export default fetchTopics
