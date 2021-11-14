import gql from 'graphql-tag'
// import { get } from 'lodash'
import duck from '../../duck'

const updateStatus = async (id, input) => duck.query({
  query: gql`
    mutation($input:BannerUpdate!) {
      updateBanner (input: $input, id: "${id}" ) {
        id
        title
      }
    }
  `,
  variables: {
    input
  },
  type: 'banners/update',
  key: 'updateBanner'
})

export default updateStatus
