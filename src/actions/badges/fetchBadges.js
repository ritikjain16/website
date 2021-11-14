import gql from 'graphql-tag'
import { get } from 'lodash'
import requestToGraphql from '../../utils/requestToGraphql'
import errors from '../../constants/errors'
import getActionsError from '../../utils/getActionsError'
import { badgesFactory as actions } from '../../reducers/badges'

const fetchBadgesQuery = topicId => gql`
    query{
      badges(filter:{topic_some:{id:"${topicId}"}}){
          id
          order
          name
          type
          topic{
              id
              title
          }
          activeImage{
              id
              uri
              signedUri
          }
          inactiveImage{
            id
            uri
            signedUri  
          }
          status
          createdAt
          updatedAt
          description
          unlockPoint
      }
    }
`
const fetchBadgesLoading = () => ({
  type: actions.FETCH_LOADING
})

const fetchBadgesSuccess = (badges) => ({
  type: actions.FETCH_SUCCESS,
  badges
})

const fetchBadgesFailure = (error) => ({
  type: actions.FETCH_FAILURE,
  error
})

const fetchBadgesByTopic = topicId => async dispatch => {
  try {
    dispatch(fetchBadgesLoading())
    const { data } = await requestToGraphql(fetchBadgesQuery(topicId))
    // badges:array of badge objects
    const badges = get(data, 'badges', [])
    if (Array.isArray(badges)) {
      dispatch(fetchBadgesSuccess(badges))
      return badges
    }
    dispatch(fetchBadgesFailure(errors.EmptyDataError))
  } catch (e) {
    const error = getActionsError(e)
    dispatch(fetchBadgesFailure(error))
  }
  return {}
}
export default fetchBadgesByTopic
