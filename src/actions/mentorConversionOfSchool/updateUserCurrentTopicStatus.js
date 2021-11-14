import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'

const updateUserCurrentTopicComponentStatus = async (
  userCurrentTopicComponentStatusId,
  input
) =>
  duck.query({
    query: gql`
      mutation(
        $input: UserCurrentTopicComponentStatusUpdate!
      ){
        updateUserCurrentTopicComponentStatus(
          id:"${userCurrentTopicComponentStatusId}"
          input:$input
        ){
          id
          user{
            id
          }
          currentTopic{
            id
            title
          }
          enrollmentType
        }    
      }`,
    variables: {
      input
    },
    type: 'userCurrentTopicComponentStatuses/update',
    key: 'userCurrentTopicComponentStatus',
    changeExtractedData: (original, extracted) => ({
      userCurrentTopicComponentStatus: [get(extracted, 'updateUserCurrentTopicComponentStatus')]
    })
  })

export default updateUserCurrentTopicComponentStatus
