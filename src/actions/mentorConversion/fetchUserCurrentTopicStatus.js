import gql from 'graphql-tag'
import duck from '../../duck'

const fetchUserCurrentTopicComponentStatuses = async (userIds) =>
  duck.query({
    query: gql`
    query{
        userCurrentTopicComponentStatuses(
            filter:{
                user_some:{
                    id_in:[${userIds}]
                }
            }
        ){
            id
            user{
              id
            }
            currentTopic{
              id
              title
              order
            }
            currentCourse {
              id
              title
            }
            enrollmentType
        }
    }
    `,
    type: 'userCurrentTopicComponentStatuses/fetch',
    key: 'fetchUserCurrentTopicComponentStatuses'
  })

export default fetchUserCurrentTopicComponentStatuses
