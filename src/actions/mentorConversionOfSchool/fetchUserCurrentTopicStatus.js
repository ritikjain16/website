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
            }
            currentCourse{
              id
              title
            }
            enrollmentType
        }
    }
    `,
    type: 'userCurrentTopicComponentStatuses/fetch',
    key: 'userCurrentTopicComponentStatuses'
  })

export default fetchUserCurrentTopicComponentStatuses
