import gql from 'graphql-tag'
import duck from '../../duck'
import {
  QUIZ, VIDEO, ASSIGNMENT, PROJECT,
  PRACTICE, LEARNING_OBJECTIVE, HOMEWORK_ASSIGNMENT
} from '../../constants/CourseComponents'

const removeFromCourseComponent = async (courseId, componentId, type) => duck.query({
  query: gql`
    mutation {
        ${type === QUIZ ? `
        removeFromCourseQuestionBank(courseId: "${courseId}", questionBankId: "${componentId}") {
            course {
                id
            }
        }` : ''}
        ${type === VIDEO ? `
        removeFromCourseVideo(courseId: "${courseId}", videoId: "${componentId}") {
            course {
                id
            }
        }` : ''}
        ${type === ASSIGNMENT || type === HOMEWORK_ASSIGNMENT ? `
        removeFromCourseAssignmentQuestion(courseId: "${courseId}", assignmentQuestionId: "${componentId}") {
            course {
                id
            }
        }` : ''}
        ${type === PROJECT || type === PRACTICE ? `
        removeFromCourseBlockBasedProject(courseId: "${courseId}", blockBasedProjectId: "${componentId}") {
            course {
                id
            }
        }` : ''}
        ${type === LEARNING_OBJECTIVE ? `
        removeFromCourseLearningObjective(courseId: "${courseId}", learningObjectiveId: "${componentId}") {
            course {
                id
            }
        }` : ''}
    }
  `,
  type: 'removeFromCourse/delete',
  key: 'removeFromCourse',
})

export default removeFromCourseComponent
