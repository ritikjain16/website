import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteBadge = async (id) => duck.query({
  query: gql`
    mutation {
    deleteBadge(id: "${id}") {
        id
    }
    }
  `,
  type: 'badges/delete',
  key: 'badges',
})

export default deleteBadge
