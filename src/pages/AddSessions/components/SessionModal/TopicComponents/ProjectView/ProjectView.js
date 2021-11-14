import { ThunderboltFilled } from '@ant-design/icons'
import { get } from 'lodash'
import React from 'react'
import getFullPath from '../../../../../../utils/getFullPath'
import parseChatStatement from '../../../../../../utils/parseStatement'
import { CloseIcon, TopContainer } from '../../../../AddSessions.styles'
import ProjectCard from './Project.styles'

const ProjectView = ({ project, onDelete }) => {
  const newSelected = []
  const difficultyVal = get(project, 'difficulty', 1)
  if (difficultyVal === 1) newSelected.push('One')
  if (difficultyVal === 2) newSelected.push('One', 'Two')
  if (difficultyVal === 3) newSelected.push('One', 'Two', 'Three')
  const imageStyle = { height: '150px', width: '150px', objectFit: 'contain' }
  return (
    <ProjectCard>
      <CloseIcon onClick={onDelete} />
      {get(project, 'projectThumbnail.id') &&
        <div><img style={imageStyle} src={getFullPath(get(project, 'projectThumbnail.uri'))} alt='platformLogo' /></div>}
      <h3 style={{ width: '80%' }}>{parseChatStatement({ statement: get(project, 'title', '-') })}</h3>
      <h3>Difficulty:
        <TopContainer justify='center'>
          <ThunderboltFilled style={{ color: newSelected.includes('One') ? '#FFDD09' : 'lightgray', fontSize: '35px' }} />
          <ThunderboltFilled style={{ color: newSelected.includes('Two') ? '#FFDD09' : 'lightgray', fontSize: '35px' }} />
          <ThunderboltFilled style={{ color: newSelected.includes('Three') ? '#FFDD09' : 'lightgray', fontSize: '35px' }} />
        </TopContainer>
      </h3>
      {get(project, 'externalPlatformLogo.id') &&
        <div><h3>Platform Logo</h3> <img style={imageStyle} src={getFullPath(get(project, 'externalPlatformLogo.uri'))} alt='platformLogo' /></div>}
      <h3>Platform Link: {get(project, 'externalPlatformLink', '-')}</h3>
      <h3>Project Creation Description: {get(project, 'projectCreationDescription', '-')}</h3>
      <h4>Project Description: {get(project, 'projectDescription', '-')}</h4>
      <h4>Answer Description: {get(project, 'answerDescription', '-')}</h4>
    </ProjectCard>
  )
}

export default ProjectView
