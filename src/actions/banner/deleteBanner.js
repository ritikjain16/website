import gql from 'graphql-tag'
import duck from '../../duck'

const deleteBanner = async (id) => duck.query({
  query: gql`
      mutation {
      deleteBanner(id: "${id}") {
      id
    }
  }
  `,
  type: 'banners/delete',
  key: 'deleteBanner',
})

export default deleteBanner
