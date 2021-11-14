import gql from 'graphql-tag'
import duck from '../../duck'

const updateSkillLevel = async (id, input = {}) => duck.query({
  query: gql`
  mutation($input:UserCurrentTopicComponentStatusUpdate) {
      updateUserCurrentTopicComponentStatus(id: "${id}", input:$input) {
        id
        skillsLevel
        user {
          id
        }
      }
    }
  `,
  type: 'userCurrentTopicComponentStatus/update',
  key: `userCurrentTopicComponentStatus/${id}`,
  variables: {
    input
  }
})

export default updateSkillLevel
