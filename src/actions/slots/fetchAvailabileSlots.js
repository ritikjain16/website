import gql from 'graphql-tag'
import duck from '../../duck'
import getSlotNames from '../../utils/slots/slot-names'

const fetchAvailableSlots = (date) => duck.query({
  query: gql`
            query {
                availableSlots(filter:{
                date:" ${date}"
                }) {
                    id
                    date
                    ${getSlotNames()}
                }
            }
    `,
  type: 'availableSlot/fetch',
  key: `availableSlot/${new Date(date).setHours(0, 0, 0, 0)}`
})

export default fetchAvailableSlots
