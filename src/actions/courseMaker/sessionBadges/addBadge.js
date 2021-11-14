import gql from 'graphql-tag'
import duck from '../../../duck'


const addBadge = async ({ input, topicId }) =>
  duck.query({
    query: gql`
    mutation($input: BadgeInput!) {
    addBadge(input: $input, topicConnectId: "${topicId}") {
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
    type: 'badges/add',
    key: 'badges',
  })

export default addBadge
