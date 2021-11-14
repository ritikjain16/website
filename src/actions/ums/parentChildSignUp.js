import gql from 'graphql-tag'
import duck from '../../duck'

const parentChildSignUp = async (input, schoolId) => {
  duck.query({
    query: gql`
     mutation($input: ParentChildSignUpInput!){
        parentChildSignUp(input:$input,
          ${schoolId ? `schoolId: "${schoolId}"` : ''}
          ){
            id
        }
     }
  `,
    variables: {
      input,
      tokenType: 'appTokenOnly'
    },
    type: 'parentChildSignUp/add',
    key: 'addParentSignUp'
  })
}

export default parentChildSignUp
