import gql from 'graphql-tag'
import duck from '../../duck'

const removeFromLoQuiz = async (loId, quizId) => duck.query({
  query: gql`
    mutation {
        removeFromLearningObjectiveQuestionBank(
            learningObjectiveId: "${loId}"
            questionBankId: "${quizId}"
        ) {
            learningObjective {
                id
            }
        }
    }
  `,
  type: 'removeFromLearningObjectiveQuestionBank/delete',
  key: 'removeFromLearningObjectiveQuestionBank',
})

export default removeFromLoQuiz
