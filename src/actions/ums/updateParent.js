import gql from 'graphql-tag'
import requestToGraphql from '../../utils/requestToGraphql'
// import { MENTEE } from '../../constants/roles'

const updateParent = async (id, data) => {
  const input = {
    name: data.parentName,
    email: data.parentEmail
  }
  await requestToGraphql(
    gql`
  mutation($input:UserUpdate){
     updateUser(id:"${id}",input:$input){
         id
     }
  }
`,
    {
      input
    }
  )
}

export default updateParent
