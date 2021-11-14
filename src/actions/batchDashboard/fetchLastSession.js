import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_LASTSESSION = (id) => gql`
{
  batchSessions(
    filter:{
      and:[
        {
          sessionStatus:completed
        },
        {
          batch_some:{
            id: "${id}"
          }
        }
      ]
    },
    orderBy:bookingDate_DESC,
    first: 1,
    skip:0
  ){
    id
    bookingDate
  }
}
`
const fetchLastSession = async (id) => duck.query({
  query: FETCH_LASTSESSION(id),
  type: 'batchSessions/fetch',
  key: 'batchSessions',
})

export default fetchLastSession
