import React from 'react'
import {
  AimOutlined, FormOutlined,
  ReadOutlined, VideoCameraOutlined
} from '@ant-design/icons'
import {
  ASSIGNMENT, COMICSTRIP, HOMEWORK_ASSIGNMENT, LEARNING_OBJECTIVE,
  PRACTICE, PROJECT, QUIZ, VIDEO
} from '../../../../constants/CourseComponents'
import mapIcon from '../../../../assets/mapIcon.png'
import brushIcon from '../../../../assets/brushIcon.png'
import codeIcon from '../../../../assets/codeIcon.png'
import quizIcon from '../../../../assets/quizIcon.png'
import selectedMap from '../../../../assets/selectedMap.png'
import selectedProject from '../../../../assets/selectedProject.png'
import selectedAssign from '../../../../assets/selectedAssign.png'
import selectedQuiz from '../../../../assets/selectedQuiz.png'

const ComponentIcon = ({ componentName, selected }) => {
  const imgStyle = { height: '15px', width: '15px', objectFit: 'contain' }
  if (componentName === LEARNING_OBJECTIVE) {
    return <img style={imgStyle} src={selected ? selectedMap : mapIcon} alt='Icons' />
  }
  if (componentName === VIDEO) return <VideoCameraOutlined />
  if (componentName === COMICSTRIP) return <ReadOutlined />
  if (componentName === ASSIGNMENT) {
    return <img style={imgStyle} src={selected ? selectedAssign : codeIcon} alt='Icons' />
  }
  if (componentName === QUIZ) {
    return <img style={imgStyle} src={selected ? selectedQuiz : quizIcon} alt='Icons' />
  }
  if (componentName === PROJECT) {
    return <img style={imgStyle} src={selected ? selectedProject : brushIcon} alt='Icons' />
  }
  if (componentName === PRACTICE) return <AimOutlined />
  if (componentName === HOMEWORK_ASSIGNMENT) return <FormOutlined />
  return null
}

export default ComponentIcon
