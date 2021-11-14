import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../../components/MainModal'
import getFullPath from '../../../../utils/getFullPath'
import Main from './ProjectForm.style'

const ProjectCardContent = (props) => {
  const { projectContent: { image,
    statement, terminalInput, terminalOutput, type } } = props
  const rendertext = () => (
    <MainModal.FormItem>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h3>{statement}</h3>
      </div>
    </MainModal.FormItem>
  )
  const renderTerminal = () => (
    <React.Fragment>
      <MainModal.FormItem marginBottom='15px'>
        <h3>Terminal Input : {terminalInput}</h3>
      </MainModal.FormItem>
      <MainModal.FormItem marginBottom='15px'>
        <h3>Terminal Output : {terminalOutput || ''}</h3>
      </MainModal.FormItem>
    </React.Fragment>
  )
  const renderImage = () => (
    <Main.ImageContainer imageUrl={getFullPath(get(image, 'uri'))} />
  )
  const renderBody = () => {
    const render = {
      text: rendertext,
      terminal: renderTerminal,
      image: renderImage,
    }
    const renderFunction = render[type]
      ? render[type]
      : render.text
    return renderFunction()
  }
  return (
    <Main.FormWrapper>
      {renderBody()}
    </Main.FormWrapper>
  )
}

export default ProjectCardContent
