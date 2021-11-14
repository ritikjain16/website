import React from 'react'
import PropTypes from 'prop-types'
import interact from 'interactjs'
import { Button, Popconfirm } from 'antd'
import dimensions from '../../../../constants/dimensions'
import Main from './FullScreenOverlay.style'
import options from './interact-options'
import Device from '../Device'
import EmulatorMain from '../Emulator/Emulator.style'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../../constants/questionBank'

const resizeContainerInteract = interact('.tek-talk-resize-container')

const dragMoveListener = event => {
  const { target } = event
  // keep the dragged position in the data-x/data-y attributes
  const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
  const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

  // translate the element
  target.style.webkitTransform = `translate(${x}px, ${y}px)`
  target.style.transform = `translate(${x}px, ${y}px)`

  // update the posiion attributes
  target.setAttribute('data-x', x)
  target.setAttribute('data-y', y)
}

const FullScreenOverlay = props => {
  const [isReOrdering, setIsReOrdering] = React.useState(false)
  const [cancelClickedFlag, setCancelClickedFlag] = React.useState(false)
  const [reOrderedMessages, setReOrderedMessages] = React.useState([])
  const resizeContainerTarget = document.querySelector('.tek-talk-resize-container')
  const onReOrderingClick = () => {
    resizeContainerInteract
      .draggable(false)
      .resizable(false)
    setIsReOrdering(true)
    setCancelClickedFlag(false)
  }

  const onCancelClick = () => {
    resizeContainerInteract
      .draggable(true)
      .resizable(true)
    setIsReOrdering(false)
    setCancelClickedFlag(true)
  }

  const onSave = async () => {
    const input = reOrderedMessages.map((message, index) => ({
      id: message.id,
      fields: {
        order: index + 1
      }
    }))
    const messages = await props.editMessages(input)
    props.addMessageUI(messages)
    onCancelClick()
  }

  React.useEffect(() => {
    resizeContainerInteract
      .draggable(options.draggable(dragMoveListener))
      .resizable(options.resizable)
      .on('resizemove', event => {
        const { target } = event
        let x = parseFloat(target.getAttribute('data-x')) || 0
        let y = parseFloat(target.getAttribute('data-y')) || 0

        // update the element's style
        target.style.width = `${event.rect.width}px`
        target.style.height = `${event.rect.height}px`
        x += event.deltaRect.left
        y += event.deltaRect.top

        target.style.webkitTransform = `translate(${x}px,${y}px)`
        target.style.transform = `translate(${x}px,${y}px)`

        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      })
  }, [])

  const resetPosition = () => {
    resizeContainerTarget.style.transition = '0.3s all ease-in-out'
    resizeContainerTarget.setAttribute('data-x', 0)
    resizeContainerTarget.setAttribute('data-y', 0)
    resizeContainerTarget.style.transform = 'translate(0px, 0px)'
    resizeContainerTarget.addEventListener('transitionend', () => {
      resizeContainerTarget.style.transition = 'none'
    })
  }

  const resetSize = () => {
    resizeContainerTarget.style.transition = '0.3s all ease-in-out'
    resizeContainerTarget.style.width = dimensions.phone.width
    resizeContainerTarget.style.height = dimensions.phone.height
    resizeContainerTarget.addEventListener('transitionend', () => {
      resizeContainerTarget.style.transition = 'none'
    })
  }

  const messagesOfSelectedLO = () => {
    const messagesRes = props.messagesUI.filter(message =>
      message.learningObjectiveId === props.selectedLearningObjectiveId &&
      message.id !== 'addForm'
    )
    return messagesRes
  }
  const renderReOrderToolbar = () => (
    <React.Fragment>
      <Main.CancelButton onClick={onCancelClick}>
        <Main.Icon type='close' />
          cancel
      </Main.CancelButton>
      <Main.ButtonsContainer>
        <Button type='primary' onClick={onSave}>Save</Button>
      </Main.ButtonsContainer>
    </React.Fragment>
  )

  const renderToolbar = () => (
    <React.Fragment>
      <Main.BackButton onClick={props.exit}>
        <Main.Icon type='arrow-left' />
        back
      </Main.BackButton>
      <Main.ButtonsContainer>
        <Button type='dashed' onClick={resetPosition}>Reset Position</Button>
        <Button type='dashed' onClick={resetSize}>Reset Size</Button>
        <Button type='primary' onClick={onReOrderingClick} disabled={!messagesOfSelectedLO().length}>Re-order Talks</Button>
        {props.learningObjective.messageStatus === PUBLISHED_STATUS
          ? (
            <Popconfirm
              title='Do you want to unpublish chats?'
              placement='bottomLeft'
              onConfirm={() => {
                props.editLearningObjective({
                  id: props.selectedLearningObjectiveId,
                  messageStatus: UNPUBLISHED_STATUS
                })
              }}
              okText='Yes'
              cancelText='Cancel'
              key='unpublish'
            >
              <Button type='primary' disabled={!messagesOfSelectedLO().length}>Unpublish</Button>
            </Popconfirm>
          )
          : (
            <Popconfirm
              title='Do you want to publish chats?'
              placement='bottomLeft'
              onConfirm={() => {
                props.editLearningObjective({
                  id: props.selectedLearningObjectiveId,
                  messageStatus: PUBLISHED_STATUS
                })
              }}
              okText='Yes'
              cancelText='Cancel'
              key='publish'
            >
              <Button type='primary' disabled={!messagesOfSelectedLO().length}>Publish</Button>
            </Popconfirm>
          )
        }
      </Main.ButtonsContainer>
    </React.Fragment>
  )

  return (
    <Main {...props}>
      <Main.NavBarWrapper>
        <Main.NavBar>
          {isReOrdering ? renderReOrderToolbar() : renderToolbar()}
        </Main.NavBar>
      </Main.NavBarWrapper>
      <Main.Body>
        <Main.DragContainer>
          <EmulatorMain.Phone className='tek-talk-resize-container'>
            <Device
              isDragDisabled={!isReOrdering}
              cancelClickedFlag={cancelClickedFlag}
              resetPosition={resetPosition}
              setReOrderedMessages={setReOrderedMessages}
              noAddMessage={isReOrdering}
              type='fullScreen'
            />
          </EmulatorMain.Phone>
        </Main.DragContainer>
      </Main.Body>
    </Main>
  )
}
FullScreenOverlay.propTypes = {
  exit: PropTypes.func.isRequired,
  editMessages: PropTypes.func.isRequired,
  addMessageUI: PropTypes.func.isRequired,
  editLearningObjective: PropTypes.func.isRequired,
  selectedLearningObjectiveId: PropTypes.string.isRequired,
  learningObjective: PropTypes.shape({
    messageStatus: PropTypes.string.isRequired
  }).isRequired,
  messagesUI: PropTypes.arrayOf({}).isRequired
}

export default FullScreenOverlay
