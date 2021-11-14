import gql from 'graphql-tag'
import { ASSIGNMENT, HOMEWORK_ASSIGNMENT, LEARNING_OBJECTIVE, PRACTICE, PROJECT, QUIZ, VIDEO } from '../../../constants/CourseComponents'
import duck from '../../../duck'

const removeComponentFromSession = async (topicId, componentId, type) => duck.query({
  query: gql`
    mutation {
        ${
  type === QUIZ ? `
        removeFromQuestionTopicQuestion(topicId: "${topicId}", questionBankId: "${componentId}") {
            topic {
            id
            }
        }` : ''
}
        ${
  type === VIDEO ? `
        removeFromTopicVideoContent(topicId: "${topicId}", videoId:"${componentId}"){
            topic{
            id
            }
        }` : ''
}
        ${
  type === ASSIGNMENT || type === HOMEWORK_ASSIGNMENT ? `
        removeFromAssignmentTopicAssignmentQuestion(topicId: "${topicId}", assignmentQuestionId: "${componentId}") {
            topic {
            id
            }
        }` : ''
}
        ${
  type === PROJECT || type === PRACTICE ? `
        removeFromTopicBlockBasedProject(topicId: "${topicId}", blockBasedProjectId: "${componentId}") {
            topic {
            id
            }
        }` : ''
}
        ${
  type === LEARNING_OBJECTIVE ? `
        removeFromTopicLearningObjective(topicId: "${topicId}", learningObjectiveId: "${componentId}") {
            topic {
            id
            }
        }` : ''
}
    }
  `,
  type: 'removeFromTopic/delete',
  key: 'removeFromTopic',
})

export default removeComponentFromSession
