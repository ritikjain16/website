import gql from 'graphql-tag'
import duck from '../../../duck'

const deleteLearningObjective = async (id) => duck.query({
  query: gql`
    mutation {
        deleteLearningObjective(id: "${id}") {
            id
        }
    }
  `,
  type: 'learningObjectives/delete',
  key: 'learningObjectives',
})

export default deleteLearningObjective
