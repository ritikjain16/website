import gql from 'graphql-tag'
import duck from '../../../duck'
import { isPythonCourse } from '../../../utils/data-utils'

const getQuizAndAssignmentQuery = (courseId) => {
  let query = ''
  if (isPythonCourse(courseId)) {
    query = `quiz: questions(
    filter: { assessmentType: quiz }
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
        blocksJSON
        initialXML
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
    assignmentQuestions(filter :{ isHomework: false }) {
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
    homeworkAssignment: assignmentQuestions(filter :{ isHomework: true }) {
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
    `
  } else {
    query = `quiz: topicQuestions {
      order
      question {
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
          blocksJSON
          initialXML
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
    assignmentQuestions: topicAssignmentQuestions {
      order
      assignmentQuestion {
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
    }
    homeworkAssignment: topicHomeworkAssignmentQuestion {
      order
      assignmentQuestion {
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
    }
    `
  }
  return query
}

const fetchTopicData = async (topicId, courseId) =>
  duck.query({
    query: gql`
    {
        ${
  topicId ? `
          topic(id: "${topicId}") {
            id
            chapter {
                id
            }
            topicComponentRule {
            componentName
            order
            video {
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
            learningObjective {
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
                filter: { assessmentType: practiceQuestion }
                ) {
                id
                order
                status
                statement
                hint
                questionType
                questionLayoutType
                difficulty
                answerCodeSnippet
                questionCodeSnippet
                explanation
                mcqOptions {
                    statement
                    isCorrect
                    blocksJSON
                    initialXML
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
            blockBasedProject {
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
            }
            ${getQuizAndAssignmentQuery(courseId)}
        }
          ` : ''
}
        chapters(filter: { courses_some: { id: "${courseId}" } }) {
            id
            title
        }
    }
    `,
    type: 'sessionTopic/fetch',
    key: 'sessionTopic',
    changeExtractedData: (extractedData, originalData) => {
      let data = {}
      extractedData.chapters = []
      extractedData.learningObjectives = []
      extractedData.messages = []
      extractedData.assignmentQuestion = []
      extractedData.topic = []
      if (originalData && originalData.topic) {
        data = originalData.topic
      }
      extractedData.sessionTopic = data
      return { ...extractedData }
    },
  })

export default fetchTopicData
