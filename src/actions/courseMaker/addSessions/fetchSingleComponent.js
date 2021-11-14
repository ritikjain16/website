import gql from 'graphql-tag'
import {
  ASSIGNMENT, HOMEWORK_ASSIGNMENT, LEARNING_OBJECTIVE, PRACTICE,
  PROJECT, QUIZ, VIDEO
} from '../../../constants/CourseComponents'
import requestToGraphql from '../../../utils/requestToGraphql'

const fetchSingleComponent = async (componentId, type) => requestToGraphql(gql`{
      ${
  type === ASSIGNMENT || type === HOMEWORK_ASSIGNMENT ? `
      assignmentQuestion(id: "${componentId}") {
          id
          order
          hint
          statement
          questionCodeSnippet
          answerCodeSnippet
          explanation
          topic {
          id
          }
        }
      ` : ''
}
      ${
  type === LEARNING_OBJECTIVE ? `
      learningObjective(id: "${componentId}") {
        id
        order
        title
        status
        comicStrips {
          id
          title
          description
          comicImages {
            id
            image {
              id
              uri
            }
            order
          }
        }
        messages {
          id
          order
          type
          statement
          sticker {
            id
            code
            image {
              id
              uri
            }
          }
          emoji {
            id
            image {
              id
              uri
            }
          }
          image {
            id
            uri
          }
          terminalInput
          terminalOutput
          alignment
        }
        questionBank(
          filter: {
            and: [{ assessmentType: practiceQuestion }, { status: published }]
          }
        ) {
          id
          order
          status
          statement
          hint
          questionType
          assessmentType
          questionLayoutType
          difficulty
          answerCodeSnippet
          questionCodeSnippet
          explanation
          mcqOptions {
            statement
            isCorrect
          }
          fibBlocksOptions {
            displayOrder
            statement
            correctPositions
          }
          fibInputOptions {
            correctPosition
            answers
          }
          arrangeOptions {
            displayOrder
            statement
            correctPosition
          }
        }
      }
      ` : ''
}
      ${
  type === VIDEO ? `
      video(id: "${componentId}") {
        id
        videoFile {
          id
          uri
        }
        title
        description
        thumbnail {
          id
          uri
        }
      }
      ` : ''
}
      ${
  type === QUIZ ? `
      questionBank(id: "${componentId}") {
        id
        order
        status
        statement
        hint
        questionType
        assessmentType
        questionLayoutType
        difficulty
        answerCodeSnippet
        questionCodeSnippet
        explanation
        learningObjectives {
          id
          title
        }
        mcqOptions {
          statement
          isCorrect
        }
        fibBlocksOptions {
          displayOrder
          statement
          correctPositions
        }
        fibInputOptions {
          correctPosition
          answers
        }
        arrangeOptions {
          displayOrder
          statement
          correctPosition
        }
      }
      ` : ''
}
      ${
  type === PRACTICE || type === PROJECT ? `
        blockBasedProject(id: "${componentId}") {
        id
        title
        order
        difficulty
        status
        projectCreationDescription
        externalPlatformLink
        type
        isSubmitAnswer
        externalPlatformLogo {
          id
          uri
        }
        projectThumbnail {
          id
          uri
        }
        projectDescription
        answerDescription
      }
      ` : ''
}
${type === 'QuestionsFromLo' ? `questionBanks(
    filter: {
      and: [{ assessmentType: quiz }, { learningObjectives_some: { id: "${componentId}" } }]
    }
  ) {
    id
    order
    status
    statement
    hint
    questionType
    assessmentType
    questionLayoutType
    difficulty
    answerCodeSnippet
    questionCodeSnippet
    explanation
    learningObjectives {
      id
      title
    }
    mcqOptions {
      statement
      isCorrect
    }
    fibBlocksOptions {
      displayOrder
      statement
      correctPositions
    }
    fibInputOptions {
      correctPosition
      answers
    }
    arrangeOptions {
      displayOrder
      statement
      correctPosition
    }
  }` : ''}
    }`)

export default fetchSingleComponent
