import gql from 'graphql-tag'
import { get } from 'lodash'
import duck from '../../duck'
import getIdArrForQuery from '../../utils/getIdArrForQuery'

const fetchRatingAndComments = (userIdArr, filter = '') => duck.createQuery({
  query: gql`
      query {
        countData: netPromoterScoresMeta(groupBy:score, ${filter}){
          count
          groupByFieldName
          groupByData{
            count
            groupByFieldValue
          }
        }
        mentorMenteeSessions(filter:{
          and: [
            {
              menteeSession_some:{
                user_some: {
                  id_in: [${getIdArrForQuery(userIdArr)}]
                }
              }
            }
            {
              topic_some: {order:1}
            }
          ]
        }) {
          id
          mentorSession {
            id
            user {
              id
              name
            }
          }
          menteeSession {
            id
            user {
              id
            }
          }
          rating
          comment
        }
      }
    `,
  type: 'mentorMenteeSession/fetch',
  key: 'rating/comment',
  changeExtractedData: (extractedData, originalData) => {
    if (get(originalData, 'mentorMenteeSessions') && get(extractedData, 'completedSession')) {
      originalData.mentorMenteeSessions.forEach((session, index) => {
        if (get(session, 'id') === get(extractedData.completedSession[index], 'id')) {
          extractedData.completedSession[index].mentorName = get(session, 'mentorSession.user.name')
          extractedData.completedSession[index].menteeId = get(session, 'menteeSession.user.id')
        }
      })
    }
    return extractedData
  }
})

export default fetchRatingAndComments
