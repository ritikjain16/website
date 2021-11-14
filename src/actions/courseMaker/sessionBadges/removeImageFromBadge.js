import gql from 'graphql-tag'
import duck from '../../../duck'

const removeImageFromBadge = async (badgeId, fileId, typeField) => duck.query({
  query: gql`
  mutation {
    ${
  typeField === 'activeImage' ? `
    removeFromBadgeActiveImage(badgeId: "${badgeId}", fileId: "${fileId}") {
    badge {
      id
    }
  }
    ` : ''
}
${
  typeField === 'inactiveImage' ? `
    removeFromBadgeInactiveImage(badgeId: "${badgeId}", fileId: "${fileId}") {
    badge {
      id
    }
  }
    ` : ''
}
}
  `,
  type: 'badges/delete',
  key: 'removeFromBadge',
})

export default removeImageFromBadge
