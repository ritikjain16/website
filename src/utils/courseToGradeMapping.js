import { get } from 'lodash'

const courseToGradeMappingForStaging = [
  {
    grade: [1, 2],
    course: {
      id: 'ckpwgsqpx00010txl9q1s19f2',
      title: 'Building logic and algorithmic thinking',
      minGrade: 1,
      maxGrade: 2
    }
  },
  {
    grade: [3, 4, 5],
    course: {
      id: 'ckpwvp8gb00000t06f78t6dbz',
      title: 'Intro to Coding concepts with Blockly',
      minGrade: 3,
      maxGrade: 5
    }
  },
  {
    grade: [6, 7, 8, 9, 10, 11, 12],
    course: {
      id: 'cjs8skrd200041huzz78kncz5',
      title: 'python',
      minGrade: 6,
      maxGrade: 12
    },
  }
]

const courseToGradeMapping = [
  {
    grade: [1, 2],
    course: {
      id: 'cks5y78w0000t0vwcauvc2rtm',
      title: 'Building logics and algorithmic thinking',
      secondaryCategory: 'BLOCK-BASED PROGRAMMING',
      color: { primary: '#E45C33', secondary: '#F9DBD2', backdrop: '#65DA7A' },
      minGrade: 1,
      maxGrade: 2
    },
  },
  {
    grade: [3, 4, 5],
    course: {
      id: 'cks94x3jq00fc0w24e92pb9ku',
      title: 'Intro to Coding with Blockly - I',
      secondaryCategory: 'BLOCK-BASED PROGRAMMING',
      color: { primary: '#E45C33', secondary: '#F9DBD2', backdrop: '#65DA7A' },
      minGrade: 3,
      maxGrade: 5
    },
  },
  {
    grade: [6, 7, 8, 9, 10, 11, 12],
    course: {
      id: 'cjs8skrd200041huzz78kncz5',
      title: 'python',
      secondaryCategory: 'PROGRAMME I',
      color: { primary: '#966CAB', secondary: '#E8DFEC', backdrop: '#D34B57' },
      minGrade: 6,
      maxGrade: 12
    },
  }
]

const getCourseForGrade = (grade) => {
  grade = grade.replace('grade', '')
  grade = Number(grade)
  let courseMapped = {}
  if (process.env.REACT_APP_NODE_ENV === 'production') {
    courseMapped = courseToGradeMapping.find(courseMap => courseMap.grade.includes(grade))
  } else {
    courseMapped = courseToGradeMappingForStaging.find(courseMap => courseMap.grade.includes(grade))
  }
  return get(courseMapped, 'course')
}

export { getCourseForGrade, courseToGradeMapping }
