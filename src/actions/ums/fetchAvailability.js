import gql from 'graphql-tag'
import moment from 'moment'
import duck from '../../duck'
import getSlotsName from '../../utils/slots/slot-names'

const fetchAvailability = async () =>
  duck.query({
    query: gql`{
    availableSlots(
      filter: {
        and: [
          {date_gte: "${moment()
    .startOf('day')
    .toDate()
    .toISOString()}"}
          {date_lte: "${moment()
    .add(14, 'days')
    .startOf('days')
    .toDate()
    .toISOString()}"}
        ]
      }
    ){
      id
      date
      ${getSlotsName()}
    }
    topics(
      filter:{order: 1}
    ){
      id
      title
      order
    }
  }
  `,
    type: 'availability/fetch',
    key: 'availability'
  })

export default fetchAvailability
