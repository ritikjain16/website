import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const bookedFirstSessions = async () => duck.query({
  query: gql`
    query{
        menteeSessions(filter:{
            and: [
              {topic_some:{order:1}}
              {source_not:school}
            ]
        }){
          id
          bookingDate
          user{
            id
          }
          ${getSlotNames()}
        }
    }
  `,
  type: 'session/fetch',
  key: 'bookedSessions'
})

export default bookedFirstSessions
