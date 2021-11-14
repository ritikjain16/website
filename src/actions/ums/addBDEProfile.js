import gql from 'graphql-tag'
import duck from '../../duck'

const addBDEProfile = async (id) => duck.query({
  query: gql`
    mutation {
      addBDEProfile(input: {}, userConnectId: "${id}") {
        id
      }
    }
    `,
  type: 'BDErofile/add',
  key: 'BDEProfile',
})

export default addBDEProfile
