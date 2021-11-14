import { get, sortBy } from 'lodash'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import getFullPath from '../../../../../../utils/getFullPath'
import parseStatement from '../../../../../../utils/parseStatement'
import { MessageContainer, MessageLeft, MessageRight } from './MessageView.styles'

const MessageView = (props) => {
  const renderMessages = (message) => {
    if (!message) return <></>
    let messageComponent = <></>
    const { type } = message


    if (type === 'text') {
      if (get(message, 'alignment', '') === 'left') {
        messageComponent = (
          <MessageLeft>
            {parseStatement({
              statement: get(message, 'statement', ''),
              emojis: get(message, 'emoji', '')
            })}
          </MessageLeft>
        )
      } else {
        messageComponent = (
          <MessageRight>
            {parseStatement({
              statement: get(message, 'statement', ''),
              emojis: get(message, 'emoji', '')
            })}
          </MessageRight>
        )
      }
    }

    if (type === 'image') {
      if (get(message, 'alignment', '') === 'left') {
        messageComponent = (
          <MessageLeft>
            <img src={getFullPath(get(message, 'image.uri'))} alt='' />
          </MessageLeft>
        )
      } else {
        messageComponent = (
          <MessageRight>
            <img src={getFullPath(get(message, 'image.uri'))} alt='' />
          </MessageRight>
        )
      }
    }

    if (type === 'terminal') {
      if (get(message, 'alignment', '') === 'left') {
        messageComponent = (
          <MessageLeft>
            {get(message, 'terminalInput', '') && (
              <SyntaxHighlighter
                language='python'
                style={dracula}
                customStyle={{
                  padding: 10,
                  margin: 0,
                }}
              >
                {get(message, 'terminalInput')}
              </SyntaxHighlighter>
            )}
            {get(message, 'terminalOutput') && (
              <div >{get(message, 'terminalOutput', '').split('\n').map((outputLine) => <div>{outputLine}</div>)}</div>
            )}
          </MessageLeft>
        )
      } else {
        messageComponent = (
          <MessageRight>
            {get(message, 'terminalInput', '') && (
              <SyntaxHighlighter
                language='python'
                style={dracula}
                customStyle={{
                  padding: 10,
                  margin: 0,
                }}
              >
                {get(message, 'terminalInput')}
              </SyntaxHighlighter>
            )}
            {get(message, 'terminalOutput') && (
              <div >{get(message, 'terminalOutput', '').split('\n').map((outputLine) => <div>{outputLine}</div>)}</div>
            )}
          </MessageRight>
        )
      }
    }

    if (type === 'sticker') {
      if (get(message, 'alignment', '') === 'left') {
        messageComponent = (
          <MessageLeft sticker>
            <img src={getFullPath(get(message, 'sticker.image.uri'))} alt='' />
          </MessageLeft>
        )
      } else {
        messageComponent = (
          <MessageRight sticker>
            <img src={getFullPath(get(message, 'sticker.image.uri'))} alt='' />
          </MessageRight>
        )
      }
    }
    return messageComponent
  }
  return (
    <MessageContainer>
      {sortBy(get(props, 'messages', []), 'order').map(renderMessages)}
    </MessageContainer>
  )
}

export default MessageView
