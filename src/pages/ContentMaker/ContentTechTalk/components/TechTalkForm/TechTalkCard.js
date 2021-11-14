import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../../../components/MainModal'
import getFullPath from '../../../../../utils/getFullPath'
import Main from './TechTalkFormWrapper.style'

const TechTalkCard = (props) => {
  const { message: { image,
    statement, terminalInput, sticker, terminalOutput,
    type, question } } = props
  const renderSticker = () => (
    <div>
      <Main.SelectedStickerContainer>
        <img
          src={getFullPath(get(
            props.stickerEmojis.find(stickerEmoji =>
            stickerEmoji.code === get(sticker, 'code', '')
            ), 'image.uri')
          )}
          alt='Alt prop'
        />
      </Main.SelectedStickerContainer>
    </div>
  )
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

  const renderQuestion = () => (
    <MainModal.FormItem marginBottom='15px'>
      <h3>Question : {get(question, 'statement')}</h3>
    </MainModal.FormItem>
  )
  const renderBody = () => {
    const render = {
      text: rendertext,
      terminal: renderTerminal,
      image: renderImage,
      sticker: renderSticker,
      question: renderQuestion,
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

export default TechTalkCard
