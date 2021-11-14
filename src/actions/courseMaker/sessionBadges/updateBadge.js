import gql from 'graphql-tag'
import duck from '../../../duck'


const updateBadge = async ({ badgeId, input }) =>
  duck.query({
    query: gql`
    mutation($input: BadgeUpdate) {
        updateBadge(id: "${badgeId}", input: $input) {
            id
            order
            name
            type
            description
            activeImage {
            id
            uri
            }
            inactiveImage {
            id
            uri
            }
            unlockPoint
            status
            topic {
            id
            }
            createdAt
        }
        }
    `,
    variables: {
      input
    },
    type: 'badges/update',
    key: 'badges',
  })

export default updateBadge
