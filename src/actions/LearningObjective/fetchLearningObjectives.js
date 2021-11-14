import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import actions from '../../reducers/learningObjective'

const FETCH_LO_QUERY = (topicId) => gql`
  query {
    topic(id:"${topicId}"){
      learningObjectives{
        id,
        order,
        title,
        createdAt,
        updatedAt,
        status,
        videoStartTime,
        videoEndTime,
        videoThumbnail {
          id
          name
          uri
          signedUri  
        },
        messageStatus,
        pqStory
        topics {
          id
        }
        leftTextMessagesCount: messagesMeta(filter:{
          and:[
            {
              type: text
            },
            {
              alignment: left
            }
          ]
        }){
          count
        }
        rightTextMessagesCount: messagesMeta(filter:{
          and:[
            {
              type: text
            },
            {
              alignment: right
            }
          ]
        }){
          count
        }
        terminalMessagesCount: messagesMeta(filter:{
          type: terminal
        }){
          count
        }
        stickerMessagesCount: messagesMeta(filter:{
          type: sticker
        }){
          count
        }
        imageMessagesCount: messagesMeta(filter:{
          type: image
        }){
          count
        }
        messagesMeta {
          count
        }
        publishedPQCount: questionBankMeta(filter: {
          and:[
            {
              assessmentType: practiceQuestion
            },
            {
              status: published
            }
          ]
        }) {
          count
        }
        unpublishedPQCount: questionBankMeta(filter: {
          and:[
            {
              assessmentType: practiceQuestion
            },
            {
              status: unpublished
            }
          ]
        }) {
          count
        }
        publishedQuizCount: questionBankMeta(filter: {
          and:[
            {
              assessmentType: quiz
            },
            {
              status: published
            }
          ]
        }) {
          count
        }
        unpublishedQuizCount: questionBankMeta(filter: {
          and:[
            {
              assessmentType: quiz
            },
            {
              status: unpublished
            }
          ]
        }) {
          count
        }
        messages{
          emojiMessagesCount: emojiMeta(filter: {
            type: emoji
          }){
            count
          }
        }
        videoStartTime,
        videoEndTime,
        thumbnail{
          id,
          name,
          uri
          signedUri
        }
        pqStoryImage{
          id
          name
          uri
          signedUri
        }
      }
    }
  }
`
const fetchLearningObjectivesLoading = () => ({
  type: actions.FETCH_LOADING
})

const fetchLearningObjectivesSuccess = (learningObjectives) => ({
  type: actions.FETCH_SUCCESS,
  learningObjectives
})

const fetchLearningObjectivesFailure = error => ({
  type: actions.FETCH_FAILURE,
  error
})
const fetchLearningObjectives = (topicId) => async (dispatch) => {
  try {
    dispatch(fetchLearningObjectivesLoading())
    const { data } = await requestToGraphql(FETCH_LO_QUERY(topicId))
    const learningObjectives = get(data, 'topic.learningObjectives')
    if (Array.isArray(learningObjectives)) {
      dispatch(fetchLearningObjectivesSuccess(learningObjectives))
      return learningObjectives
    }
    dispatch(fetchLearningObjectivesFailure(errors.EmptyDataError))
    return {}
  } catch (e) {
    const error = getActionsError(e)
    dispatch(fetchLearningObjectivesFailure(error))
  }
  return {}
}
export default fetchLearningObjectives
