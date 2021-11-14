import React, { useEffect, useState, memo } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import Main from './TechTalkForm.style'
import TechTalkForm from './TechTalkForm'
import { getOrdersInUse, getOrderAutoComplete } from '../../../../utils/data-utils'
import colors from '../../../../constants/colors'
import TechTalkCard from './TechTalkCard'

const TechTalkFormWrapper = ({ messages, ...props }) => {
  const orders = getOrdersInUse(messages)
  const orderAutoComplete = getOrderAutoComplete(orders)
  const [isDisabled, setIsDisabled] = useState(true)
  const [messagesData, setMessages] = useState([])
  useEffect(() => {
    setMessages(messages)
  }, [messages])
  React.useEffect(() => {
    if (props.hasDeletedMessage) {
      props.deleteMessageUI(props.deletedMessageId)
    }
  }, [props.hasDeletedMessage])

  React.useEffect(() => {
    setTimeout(() => {
      if (document.querySelector('#addForm')) {
        document.querySelector('#addForm')
          .scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 1000)
  }, [props.learningObjectiveId])

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const data = [...messagesData]
    const draggedMessage = reorder(
      data,
      result.source.index,
      result.destination.index
    )
    setMessages(draggedMessage)
  }
  const rowStyle = (isDragging, dragglePropsStyle) => (
    {
      maxWidth: '500px',
      margin: '0 auto',
      border: isDragging ? `1px solid ${colors.loPage.tableBorder}` : '',
      background: isDragging ? 'lightgray' : 'white',
      ...dragglePropsStyle
    }
  )
  const onCancel = () => {
    setIsDisabled(true)
    setMessages(messages)
  }
  const onSave = async () => {
    const input = messagesData.map((msg, index) => ({
      id: msg.id,
      fields: {
        order: index + 1
      }
    }))
    if (input.length > 0) {
      await props.editMessages(input)
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }
  return (
    <Main id='tech-talk-form-wrapper'>
      <div
        style={{
          position: 'sticky',
          top: '5px',
          width: '100%',
          textAlign: 'right',
          zIndex: 10
        }}
      >{
          isDisabled ? (
            <Button type='primary' onClick={() => setIsDisabled(false)} >Re-order</Button>
          ) : (
            <>
              <Button type='dashed' style={{ marginRight: '10px' }} onClick={onCancel} >Cancel</Button>
              <Button type='primary' onClick={onSave} >Save</Button>
            </>
          )
      }
      </div>
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId='droppable' isDropDisabled={isDisabled} >
          {provided => (
            <div ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ width: '100%', height: 'max-content' }}
            >
              {
                messagesData.map((message, i) => (
                  <Draggable index={i}
                    draggableId={message.id}
                    key={message.id}
                    isDragDisabled={isDisabled}
                  >
                    {
                      (provid, snapshot) => (
                        <div
                          ref={provid.innerRef}
                          {...provid.draggableProps}
                          {...provid.dragHandleProps}
                          style={rowStyle(snapshot.isDragging,
                            provid.draggableProps.style)}
                        >
                          {
                            isDisabled ? (
                              <TechTalkForm {...props}
                                order={message.order}
                                message={message}
                                formType='edit'
                                formId={message.id}
                                i={i}
                              />
                            ) : (
                              <TechTalkCard {...props}
                                order={message.order}
                                message={message}
                                formType='edit'
                                formId={message.id}
                                i={i}
                              />
                            )
                          }
                        </div>
                      )
                    }
                  </Draggable>
                ))
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }} >
        <TechTalkForm {...props}
          formType='add'
          formId='addForm'
          i='add'
          order={orderAutoComplete}
        />
      </div>
    </Main>
  )
}


TechTalkFormWrapper.propTypes = {
  messages: PropTypes.arrayOf({}).isRequired,
  deleteMessageUI: PropTypes.func.isRequired,
  hasDeletedMessage: PropTypes.string.isRequired,
  deletedMessageId: PropTypes.string.isRequired,
  learningObjectiveId: PropTypes.string.isRequired,
  hasMessagesFetched: PropTypes.string.isRequired
}
export default memo(TechTalkFormWrapper)
