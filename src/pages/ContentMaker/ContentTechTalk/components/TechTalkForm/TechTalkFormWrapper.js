import { Button } from 'antd'
import { get, sortBy } from 'lodash'
import React from 'react'
import gql from 'graphql-tag'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import Main from './TechTalkFormWrapper.style'
import TechTalkForm from './TechTalkForm'
import { getOrderAutoComplete, getOrdersInUse, getSuccessStatus } from '../../../../../utils/data-utils'
import TechTalkCard from './TechTalkCard'
import colors from '../../../../../constants/colors'
import { fetchStickers, fetchTechTalk } from '../../../../../actions/contentMaker'
import requestToGraphql from '../../../../../utils/requestToGraphql'

class TechTalkFormWrapper extends React.Component {
  state = {
    messages: [],
    isDisabled: true,
    questions: []
  }
  componentDidMount = () => {
    fetchStickers()
    this.fetchQuestions(this.props.learningObjectiveId)
  }
  componentDidUpdate = (prevProps) => {
    const { messageFetchingStatus } = this.props
    if (getSuccessStatus(messageFetchingStatus, prevProps.messageFetchingStatus)) {
      this.setMessages()
    }
  }
  setMessages = () => {
    const { messages, learningObjectiveId } = this.props
    const messagesData = messages && messages.toJS() ? messages.toJS() : []
    this.setState({
      messages: sortBy(messagesData.filter(message =>
        get(message, 'learningObjective.id') === learningObjectiveId), 'order')
    }, () => {
      if (document.querySelector('#addForm')) {
        document.querySelector('#addForm')
          .scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    })
  }
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  rowStyle = (isDragging, dragglePropsStyle) => (
    {
      maxWidth: '500px',
      margin: '0 auto',
      border: isDragging ? `1px solid ${colors.loPage.tableBorder}` : '',
      background: isDragging ? 'lightgray' : 'white',
      ...dragglePropsStyle
    }
  )
  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const data = [...this.state.messages]
    const draggedMessage = this.reorder(
      data,
      result.source.index,
      result.destination.index
    )
    this.setState({
      messages: draggedMessage
    })
  }
  onCancel = () => {
    this.setState({
      isDisabled: true,
      messages: sortBy(this.props.messages.toJS(), 'order')
    })
  }
  onSave = async () => {
    const { messages } = this.state
    const { learningObjectiveId } = this.props
    const input = messages.map((msg, index) => ({
      id: msg.id,
      fields: {
        order: index + 1
      }
    }))
    if (input.length > 0) {
      await this.props.editMessages(input)
      fetchTechTalk(learningObjectiveId)
      this.setState({ isDisabled: true })
    } else {
      this.setState({ isDisabled: false })
    }
  }
  addMessages = async (value) => {
    const { learningObjectiveId, addMessage } = this.props
    const { file, stickerConnectId, emojiConnectIds,
      questionConnectId, resetForm, ...input } = value
    const data = await addMessage({
      file,
      stickerConnectId,
      emojiConnectIds,
      learningObjectiveId,
      questionConnectId,
      ...input
    })
    const newMessages = [...this.state.messages, data]
    this.setState({
      messages: sortBy(newMessages, 'order')
    })
    resetForm()
  }

  deleteMessages = async (id) => {
    const { deleteMessage } = this.props
    const data = await deleteMessage(id)
    const newMessages = [...this.state.messages]
    this.setState({
      messages: sortBy(newMessages.filter(msg => get(msg, 'id') !== get(data, 'id')), 'order')
    })
  }

  editMessages = async (value) => {
    const { file, id, stickerConnectId, emojiConnectIds, questionConnectId, ...input } = value
    const { editMessage } = this.props
    const data = await editMessage({
      file,
      stickerConnectId,
      emojiConnectIds,
      id,
      questionConnectId,
      ...input
    })
    const messages = [...this.state.messages]
    const newMessages = messages.filter(msg => get(msg, 'id') !== get(data, 'id'))
    this.setState({
      messages: sortBy([...newMessages, data], 'order')
    })
  }
  fetchQuestions = async (loId, searchTerm, callback) => {
    const filter = `and: [
          {
            learningObjectives_some: {
              id: "${loId}"
            }   
          }
          { assessmentType: practiceQuestion }
          ${searchTerm && searchTerm.length > 0 ? `{ statement_startsWith: "${searchTerm}" }` : ''}
        ]`
    const questionsBank = await requestToGraphql(gql`{
      questionBanks(
        orderBy : createdAt_DESC
        filter: {
          ${filter} 
        }
      ) {
        id
        statement
      }
    }`)
    const questions = get(questionsBank, 'data.questionBanks', [])
    if (callback) {
      callback(questions)
    } else {
      this.setState({
        questions
      })
    }
  }
  render() {
    const { messages, isDisabled, questions } = this.state
    const { stickerEmojis } = this.props
    const orders = getOrdersInUse(messages)
    const orderAutoComplete = getOrderAutoComplete(orders)
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
              <Button type='primary' onClick={() => this.setState({ isDisabled: false })} >Re-order</Button>
            ) : (
              <>
                <Button type='dashed' style={{ marginRight: '10px' }} onClick={this.onCancel} >Cancel</Button>
                <Button type='primary' onClick={this.onSave} >Save</Button>
              </>
            )
        }
        </div>
        <DragDropContext onDragEnd={this.onDragEnd} >
          <Droppable droppableId='droppable' isDropDisabled={isDisabled} >
            {provided => (
              <div ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ width: '100%', height: 'max-content' }}
              >
                {
                  messages.map((message, i) => (
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
                            style={this.rowStyle(snapshot.isDragging,
                              provid.draggableProps.style)}
                          >
                            {
                                isDisabled ? (
                                  <TechTalkForm {...this.props}
                                    order={message.order}
                                    message={message}
                                    formType='edit'
                                    formId={message.id}
                                    questionBank={questions}
                                    stickerEmojis={stickerEmojis && stickerEmojis.toJS()}
                                    deleteMessages={this.deleteMessages}
                                    editMessages={this.editMessages}
                                    fetchQuestions={this.fetchQuestions}
                                    i={i}
                                  />
                                ) : (
                                  <TechTalkCard {...this.props}
                                    order={message.order}
                                    message={message}
                                    formType='edit'
                                    questionBank={questions}
                                    formId={message.id}
                                    stickerEmojis={stickerEmojis && stickerEmojis.toJS()}
                                    fetchQuestions={this.fetchQuestions}
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
          <TechTalkForm {...this.props}
            formType='add'
            formId='addForm'
            i='add'
            stickerEmojis={stickerEmojis && stickerEmojis.toJS()}
            order={orderAutoComplete}
            addMessages={this.addMessages}
            questionBank={questions}
            fetchQuestions={this.fetchQuestions}
          />
        </div>
      </Main>
    )
  }
}

export default TechTalkFormWrapper
