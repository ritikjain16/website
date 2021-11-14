import {
  ASSIGNMENT, COMICSTRIP,
  HOMEWORK_ASSIGNMENT,
  LEARNING_OBJECTIVE, PRACTICE, PROJECT, QUIZ, VIDEO
} from '../constants/CourseComponents'

const getComponentName = (name) => {
  if (name === ASSIGNMENT) return 'Coding Assignment'
  if (name === VIDEO) return 'Video'
  if (name === LEARNING_OBJECTIVE) return 'Learning Objective'
  if (name === QUIZ) return 'Quiz'
  if (name === COMICSTRIP) return 'Comic'
  if (name === PROJECT) return 'Project'
  if (name === PRACTICE) return 'Practice'
  if (name === HOMEWORK_ASSIGNMENT) return 'Homework Assignment'
  return name
}

export default getComponentName
