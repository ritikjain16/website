import gql from 'graphql-tag'
import duck from '../../duck'

const addSalesProfile = async (id) => {
  duck.query({
    query: gql`
    mutation {
      addSalesExecutiveProfile(userConnectId: "${id}", input: {}){
        id
      }
    }
    `,
    type: 'salesExectiveProfile/add',
    key: 'salesExectiveProfile',
  })
}

export default addSalesProfile
