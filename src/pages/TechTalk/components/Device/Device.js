import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Icon, Progress } from 'antd'
import PropTypes from 'prop-types'
import { sortBy, get } from 'lodash'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import Main from './Device.style'
import { getDataById } from '../../../../utils/data-utils'
import getFullPath from '../../../../utils/getFullPath'

/**
 * creates a portal.
 * More: https://reactjs.org/docs/portals.html
 *
 * We are using 2 libraries react-beautiful-dnd and interact.js
 * interact.js uses transform properties to drag an element
 * In react-beautiful-dnd -- while dragging -- it adds position fixed.
 * Which creates the conflict because fixed elements messes up with the
 * positioning logic when any of their parent elements uses transform properties
 * But react portal solves this problem with mounting childrens somewhere else
 * on dom node instead of fixed parent.
 */
const portal = document.createElement('div')
document.body.classList.add('emulator-drag-portal')
if (document.body) {
  document.body.appendChild(portal)
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const Device = props => {
  const [messages, setMessages] = useState([])
  const [selectedLearningObjective, setSelectedLearingObjectiveId] = useState('')
  const [isDragDisabled, setIsDragDisabled] = useState(true)

  const setDefaultMessages = () => {
    setSelectedLearingObjectiveId(
      getDataById(props.learningObjectives, props.selectedLearningObjectiveId)
    )
    const messagesOfSelectedLearningObjective = props.messagesUI.filter(
      message => message.learningObjectiveId === props.selectedLearningObjectiveId
    )
    const messagesWithoutAdd = messagesOfSelectedLearningObjective
      .filter(message => message.order !== 'add')

    const sortedMessages =
      sortBy(messagesWithoutAdd, 'order')
    setMessages(sortedMessages)
    props.setReOrderedMessages(sortedMessages)
  }

  useEffect(() => {
    setIsDragDisabled(props.isDragDisabled)
  }, [props.isDragDisabled])

  useEffect(() => {
    if (props.cancelClickedFlag === true) {
      setDefaultMessages()
    }
  }, [props.cancelClickedFlag])

  useEffect(() => {
    setDefaultMessages()
  }, [
    props.learningObjectives,
    props.selectedLearningObjectiveId,
    props.messagesUI
  ])

  const onDragEnd = result => {
    if (!result.destination) return
    const reorderedMessages = reorder(
      messages,
      result.source.index,
      result.destination.index
    )

    setMessages(reorderedMessages)
    props.setReOrderedMessages(reorderedMessages)
  }

  const renderWithBold = (text, maximumNested) => {
    const textNodes = []
    let lastIndex = 0
    maximumNested = maximumNested - 1 // eslint-disable-line operator-assignment
    const boldRe = /<bold>(.+)<\/bold>/g
    let match
    while (match = boldRe.exec(text)) { // eslint-disable-line no-cond-assign
      const statement = text.slice(lastIndex, match.index)
      lastIndex = match.index + match[0].length
      if (statement) {
        textNodes.push(
          <span>
            {
              renderWithLink(/* eslint-disable-line no-use-before-define */
                statement,
                maximumNested
            )}
          </span>
        )
      }
      textNodes.push(<span style={{ fontWeight: 'bold' }}>{renderWithLink(match[1], maximumNested)}</span>) // eslint-disable-line no-use-before-define
    }
    if (maximumNested < 0) {
      textNodes.push(<span>{text.slice(lastIndex)}</span>)
    } else {
      textNodes.push(
        <span>
          {
            renderWithLink(/* eslint-disable-line no-use-before-define */
              text.slice(lastIndex),
              maximumNested
          )}
        </span>)
    }
    return textNodes
  }

  const renderWithLink = (text, maximumNested) => {
    const textNodes = []
    let lastIndex = 0
    const linkRe = /<a href=("|')(.*)("|')>(.*)<\/a>/g
    let match
    while (match = linkRe.exec(text)) { // eslint-disable-line no-cond-assign
      // console.log(match)
      const statement = text.slice(lastIndex, match.index)
      lastIndex = match.index + match[0].length
      if (statement) {
        textNodes.push(<span>{renderWithBold(statement, maximumNested)}</span>)
      }
      textNodes.push(<a href={match[2]} target='_blank' rel='noopener noreferrer'>{renderWithBold(match[4], maximumNested)}</a>)
    }
    textNodes.push(<span>{renderWithBold(text.slice(lastIndex), maximumNested)}</span>)
    return textNodes
  }

  const renderText = text => {
    const maximumNested = 3
    const textNodes = []
    const emojis = props.stickerEmojis.filter(stickerEmoji => stickerEmoji.type === 'emoji')
    let lastIndex = 0
    const re = /::([^ :]+)::/g
    let match
    if (!text) return ''
    const isEmoji = emojiCode => emojis.find(emoji => emoji.code === emojiCode)
    while (match = re.exec(text)) { // eslint-disable-line no-cond-assign
      const emoji = isEmoji(match[0])
      if (emoji) {
        const statement = text.slice(lastIndex, match.index)
        const emojiLastIndex = match.index + match[0].length
        // const emoji = text.slice(match.index, emojiLastIndex)
        if (statement) {
          textNodes.push(<span>{renderWithBold(statement, maximumNested)}</span>)
        }
        textNodes.push(<span style={{
          width: 15,
          height: 15,
          display: 'inline-block',
          backgroundImage: `url("${getFullPath(get(emoji, 'image.signedUri'))}")`,
          backgroundSize: 'cover',
          marginRight: 1,
          marginLeft: 1
        }}
        />)
        lastIndex = emojiLastIndex
      }
    }
    textNodes.push(<span>{renderWithBold(text.slice(lastIndex), maximumNested)}</span>)
    return textNodes
  }

  const renderMessage = message => {
    if (!message) return <div />
    if (message.messageType === 'text') {
      return renderText(message.statement)
    } else if (message.messageType === 'terminal') {
      const terminalInputList = message.terminalInput
        ? message.terminalInput.split('\n')
        : []
      return (
        <React.Fragment>
          {terminalInputList.map(input => (
            <div style={{ display: 'flex' }}>
              <div>&gt;&gt;&gt; </div>
              <div style={{ marginLeft: 4 }}>{input}</div>
            </div>
            ))}
          <div>{message.terminalOutput}</div>
        </React.Fragment>
      )
    } else if (message.messageType === 'image') {
      return (
        <Main.ImageWrapper source={message.imageURI} />
      )
    } else if (message.messageType === 'sticker') {
      if (!message.stickerCode) return <div />
      const sticker = props.stickerEmojis.find(stickerEmoji =>
        stickerEmoji.code === message.stickerCode
      )
      const image = getFullPath(get(sticker, 'image.signedUri'))
      return (
        <img
          src={image}
          alt='ds'
        />
      )
    }
    return <div>No message type</div>
  }

  const messageInPortal = (provided, snapshopt, message) => {
    const usePortal = snapshopt.isDragging
    const child = (
      <Main.ChatItem
        alignmentType={message.alignmentType}
        messageType={message.messageType}
        innerRef={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        inPortal={usePortal}
      >
        {renderMessage(message)}
      </Main.ChatItem>
    )
    if (!usePortal) return child
    return createPortal(child, portal)
  }

  const addMessage = props.messagesUI
    .find(message => message.order === 'add')
  const isInFullScreen = props.type === 'fullScreen'
  const shouldDragDisabled = !isInFullScreen
    ? true
    : isDragDisabled
  return (
    <Main>
      <Main.Header>
        <Main.Title>
          <div>
            <Icon type='arrow-left' />
          </div>
          <div>{selectedLearningObjective.title}</div>
        </Main.Title>
        <Main.ProgressWrapper>
          <Progress percent={30} showInfo={false} width='70%' strokeWidth={10} />
        </Main.ProgressWrapper>
      </Main.Header>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable' isDropDisabled={shouldDragDisabled}>
          {provided => (
            <Main.Body
              innerRef={provided.innerRef}
            >
              {messages.map((message, index) => (
                <Draggable
                  key={message.id}
                  draggableId={message.id}
                  index={index}
                  isDragDisabled={shouldDragDisabled}
                >
                  {(providedDrag, snapshotDrag) => (
                    messageInPortal(providedDrag, snapshotDrag, message)
                  )}
                </Draggable>
                ))}
              {(addMessage && !props.noAddMessage) &&
                <Main.ChatItem
                  alignmentType={addMessage.alignmentType}
                  messageType={addMessage.messageType}
                >
                  {renderMessage(addMessage, props.stickerEmojis)}
                </Main.ChatItem>
              }
            </Main.Body>
            )}
        </Droppable>
      </DragDropContext>
    </Main>
  )
}

Device.propTypes = {
  learningObjectives: PropTypes.arrayOf({}).isRequired,
  messagesUI: PropTypes.arrayOf({}).isRequired,
  selectedLearningObjectiveId: PropTypes.string.isRequired,
  isDragDisabled: PropTypes.bool.isRequired,
  cancelClickedFlag: PropTypes.bool.isRequired,
  noAddMessage: PropTypes.bool.isRequired,
  setReOrderedMessages: PropTypes.func,
  type: PropTypes.string.isRequired,
  stickerEmojis: PropTypes.arrayOf({}).isRequired
}
Device.defaultProps = {
  setReOrderedMessages: () => { }
}

export default Device
