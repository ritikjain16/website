import { Checkbox } from 'antd'
import { get } from 'lodash'
import React from 'react'
import getFullPath from '../../../../../../utils/getFullPath'
import parseChatStatement from '../../../../../../utils/parseStatement'
import { CloseIcon } from '../../../../AddSessions.styles'
import ProjectCard from './Project.styles'

const PracticeView = ({ project, onDelete }) => {
  const imageStyle = { height: '150px', width: '150px', objectFit: 'contain' }
  return (
    <ProjectCard>
      <CloseIcon onClick={onDelete} />
      <h3 style={{ width: '80%' }}>{parseChatStatement({ statement: get(project, 'title', '-') })}</h3>
      {get(project, 'externalPlatformLogo.id') &&
        <div><h4>Platform Logo</h4> <img style={imageStyle} src={getFullPath(get(project, 'externalPlatformLogo.uri'))} alt='platformLogo' /></div>}
      <h4>Platform Link: {get(project, 'externalPlatformLink', '-')}</h4>
      <h4>Can kids submit this practice? <Checkbox checked={get(project, 'isSubmitAnswer', false)} /></h4>
      <h4>Project Creation Description: {get(project, 'projectCreationDescription', '-')}</h4>
      <h4>Project Description: {get(project, 'projectDescription', '-')}</h4>
      <h4>Answer Description: {get(project, 'answerDescription', '-')}</h4>
    </ProjectCard>
  )
}

export default PracticeView
