import gql from 'graphql-tag'
import duck from '../../../duck'

const fetchBadges = async (topicId) =>
  duck.query({
    query: gql`
    {
        badges(filter: { topic_some: { id: "${topicId}" } }) {
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
        badgesMeta(filter: { topic_some: { id: "${topicId}" } }) {
            count
        }
    }
    `,
    type: 'badges/fetch',
    key: 'badges',
  })

export default fetchBadges

