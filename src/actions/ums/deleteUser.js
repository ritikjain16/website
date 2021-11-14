import { get } from 'lodash'
import gql from 'graphql-tag'
import duck from '../../duck'

const deleteUser = async (id) => duck.query({
  query: gql`
    mutation{
        deleteUser(id:"${id}") {
            id
        }
    }
  `,
  type: 'user/delete',
  key: 'user',
  changeExtractedData: (extractedData) => ({
    ...extractedData,
    userForDashBoard: get(extractedData, 'user')
  })
})

export default deleteUser
