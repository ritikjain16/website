import React from 'react'
import PropTypes from 'prop-types'
import { Spin, Icon, Button, Tooltip } from 'antd'
import { get, sortBy } from 'lodash'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import colors from '../../../constants/colors'
import Body from './QuestionsBody.style'
import ActionsPanel from '../../../components/ActionsPanel'
import formatDate from '../../../utils/formatDate'
import { PUBLISHED_STATUS } from '../../../constants/questionBank'

export default class QuestionsBody extends React.Component {
  state = {
    dragDisableState: null,
    questionBanks: [],
    draggedQuestions: [],
    activeQuestionGroup: null
  }
  componentDidMount() {
    if (!this.state.dragDisableState) {
      const dragState = []
      for (let i = 0; i < this.props.learningObjectives.length * 2; i += 1) {
        dragState.push(true)
      }
      this.setState({
        dragDisableState: dragState,
        questionBanks: this.props.questionBanks
      })
    }
  }
  componentDidUpdate(prevprops) {
    if (prevprops.learningObjectives !== this.props.learningObjectives ||
      this.state.dragDisableState === null
    ) {
      const dragState = []
      for (let i = 0; i < this.props.learningObjectives.length * 2; i += 1) {
        dragState.push(true)
      }
      this.setState({
        dragDisableState: dragState
      })
    }
    if (prevprops.questionBanks !== this.props.questionBanks) {
      this.setState({
        questionBanks: this.props.questionBanks
      })
    }
  }
  onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const draggedQuestions = this.reorder(
      this.state.draggedQuestions,
      result.source.index,
      result.destination.index
    )
    this.setState({
      draggedQuestions
    })
  }
  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  dragsetState = (e, index, questions) => {
    let oldDragState = this.state.dragDisableState
    oldDragState = oldDragState.map((value, position) => {
      if (position === index) {
        return !value
      }
      return value
    })
    this.setState({
      dragDisableState: oldDragState,
      draggedQuestions: questions,
      activeQuestionGroup: index
    })
  }
  handleCancel = (e, index) => {
    let oldDragState = this.state.dragDisableState
    oldDragState = oldDragState.map((value, position) => {
      if (position === index) {
        return !value
      }
      return value
    })
    this.setState({
      dragDisableState: oldDragState,
      activeQuestionGroup: null
    })
  }
  updateQuestions = async (e, position) => {
    let oldDragState = this.state.dragDisableState
    const input = this.state.draggedQuestions.map((question, index) => ({
      id: question.id,
      fields: {
        order: index + 1
      }
    }))
    if (input.length > 0) {
      await this.props.editQuestions(input)
    }
    oldDragState = oldDragState.map((value, index) => {
      if (position === index) {
        return !value
      }
      return value
    })
    this.setState({
      dragDisableState: oldDragState,
      draggedQuestions: [],
      activeQuestionGroup: null
    })
  }
  getPQforLO = (questionBank, learningObjectives) => learningObjectives.map(loObj => {
    const tempList = []
    questionBank.forEach(question => {
      if (question.assessmentType === 'practiceQuestion' &&
        get(question, 'learningObjectives', []).map(lo => get(lo, 'id')).includes(loObj.id)) {
        tempList.push(question)
      }
    })
    return { id: loObj.id, practiceQuestions: tempList }
  })

  getQuizforLO = (questionBank, learningObjectives) => learningObjectives.map(loObj => {
    const tempList = []
    questionBank.forEach(question => {
      if (question.assessmentType === 'quiz' &&
        get(question, 'learningObjectives', []).map(lo => get(lo, 'id')).includes(loObj.id)) {
        tempList.push(question)
      }
    })
    return { id: loObj.id, quiz: tempList }
  })
  getPracticeQuestions = (practiceQuestions, loId) => {
    /** loObj is of form {learningObjectiveId,practiceQuestions} */
    const loObj = practiceQuestions.filter(pq =>
      pq.id === loId && pq.practiceQuestions.length > 0)[0]
    return loObj
      ? loObj.practiceQuestions
      : []
  }
  getQuizQuestions = (quiz, loId) => {
    /** loObj is of form {learningObjectiveId,quizQuestions} */
    const loObj = quiz.filter(pq => pq.id === loId && pq.quiz.length > 0)[0]
    return loObj
      ? loObj.quiz
      : []
  }
  rowStyle = (isDragging, dragglePropsStyle) => (
    {
      display: 'grid',
      gridTemplateColumns: '55px minmax(auto,100%) 130px 100px 125px 125px 80px 180px',
      borderLeft: isDragging ? `1px solid ${colors.loPage.tableBorder}` : '',
      borderRight: isDragging ? `1px solid ${colors.loPage.tableBorder}` : '',
      background: isDragging ? 'white' : '',
      ...dragglePropsStyle
    }
  )

  /** common Grid SessionTable header */
  renderTabFrame = children => (
    <Body.GridContainer columnTemplate='55px minmax(auto,100%) 130px 100px 125px 125px 80px 180px'>
      <Body.Title>Order</Body.Title>
      <Body.Title>Statement</Body.Title>
      <Body.Title>Type</Body.Title>
      <Body.Title>Difficulty</Body.Title>
      <Body.Title>Created</Body.Title>
      <Body.Title>Modified</Body.Title>
      <Body.Title>Status</Body.Title>
      <Body.Title>Actions</Body.Title>
      {children}
    </Body.GridContainer>
  )
  bodyData = (question, questions) => (
    <React.Fragment key={question.id}>
      <Body.GridItem>{question.order}</Body.GridItem>
      <Body.GridItem>{question.statement}</Body.GridItem>
      <Body.GridItem>{question.questionType}</Body.GridItem>
      <Body.GridItem>{question.difficulty}</Body.GridItem>
      <Body.Date>
        <div>
          {formatDate(question.createdAt).date}
        </div>
        <div>
          {formatDate(question.createdAt).time}
        </div>
      </Body.Date>
      <Body.Date>
        <div>
          {formatDate(question.updatedAt).date}
        </div>
        <div>
          {formatDate(question.updatedAt).time}
        </div>
      </Body.Date>
      <Body.GridItem>
        <Tooltip title={question.status} placement='left'>
          <Body.Status status={question.status} />
        </Tooltip>
      </Body.GridItem>
      <Body.GridItem>
        <ActionsPanel
          id={question.id}
          title='Question'
          eyeRequired
          isPublished={question.status === PUBLISHED_STATUS}
          publish={this.props.publishQuestion}
          unpublish={this.props.unpublishQuestion}
          deleteItem={this.props.deleteQuestion}
          questions={questions}
          openEdit={this.props.openEdit}
          openEmulatorView={this.props.openEmulatorView}
          setEmulatorViewQuestions={this.props.setEmulatorViewQuestions}
          render={this.renderFunc}
        />
      </Body.GridItem>
    </React.Fragment>
  )
  Wrapper = (props, index) => {
    const dragState = this.state.dragDisableState != null ?
      this.state.dragDisableState[index] : true
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={`droppable-${index}`}>
          {provided => (
            <div ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ gridColumnStart: 1, gridColumnEnd: 9 }}
            >
              {
                props.map((question, dragIndex) => (
                  <Draggable index={dragIndex}
                    draggableId={`index-${dragIndex}`}
                    isDragDisabled={dragState}
                    key={question.id}
                  >
                    {(draggableProvider, snapshot) => (
                      <Body.QuestionRow
                        innerRef={draggableProvider.innerRef}
                        {...draggableProvider.dragHandleProps}
                        {...draggableProvider.draggableProps}
                        style={this.rowStyle(snapshot.isDragging,
                          draggableProvider.draggableProps.style)}
                      >
                        {
                          this.bodyData(question, props)
                        }
                      </Body.QuestionRow>
                    )}
                  </Draggable>
                ))
              }
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
  render() {
    const { learningObjectives,
      isFetchingQuestionbank } = this.props
    const { dragDisableState } = this.state
    const { LORow, TypeRow } = Body
    const loObjPQ = this.getPQforLO(this.state.questionBanks, learningObjectives)
    const loObjQuiz = this.getQuizforLO(this.state.questionBanks, learningObjectives)
    const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
    /** To show Loader when fetchingQuestionBank */
    if (isFetchingQuestionbank ||
      this.props.learningObjectives.length === 0 || !this.state.dragDisableState) {
      return (
        this.renderTabFrame(
          <div style={{ width: '100%', padding: '15px' }}>
            <Spin indicator={loadingIcon} />
          </div>
        )
      )
    }
    return (
      this.renderTabFrame(
        learningObjectives.map((learningObjective, index) => {
          const practiceQuestions = this.getPracticeQuestions(loObjPQ, learningObjective.id)
          const quizQuestions = this.getQuizQuestions(loObjQuiz, learningObjective.id)
          const sortedPracticeQuestions = sortBy(practiceQuestions, 'order')
          const sortedQuizQuestions = sortBy(quizQuestions, 'order')
          return (
            <React.Fragment key={learningObjective.id}>
              <LORow key={learningObjective.id}>{learningObjective.title}</LORow>
              <TypeRow key={`${learningObjective.id}pq`}
                type='pq'
                questionsCount={practiceQuestions.length}
              >
                Practice Questions ({practiceQuestions.length})
              </TypeRow>
              {
                practiceQuestions.length > 0 && (!dragDisableState[index * 2] ? (
                  <Body.ButtonsContainer>
                    <Button type='dashed'
                      onClick={(e) => this.handleCancel(e, index * 2)}
                    >
                      Cancel
                    </Button>
                    <Body.StyledButton onClick={(e) => this.updateQuestions(e, index * 2)}>
                      Save
                    </Body.StyledButton>
                  </Body.ButtonsContainer>
                ) : (
                  <Body.ReorderContainer>
                    <Body.StyledButton onClick={(e) => this.dragsetState(e, index * 2,
                        sortedPracticeQuestions)}
                      disabled={this.state.activeQuestionGroup !== null}
                    >
                        Reorder
                    </Body.StyledButton>
                  </Body.ReorderContainer>
                  ))
              }
              {
                !dragDisableState[index * 2] &&
                this.Wrapper((this.state.draggedQuestions), index * 2)
              }
              {
                dragDisableState[index * 2] &&
                this.Wrapper(sortedPracticeQuestions, index * 2)
              }
              <TypeRow key={`${learningObjective.id}qz`}
                questionsCount={quizQuestions.length}
              >Quiz Questions ({quizQuestions.length})
              </TypeRow>
              {
                quizQuestions.length > 0 && (!dragDisableState[(index * 2) + 1] ? (
                  <Body.ButtonsContainer>
                    <Button type='dashed' onClick={(e) => this.handleCancel(e, (index * 2) + 1)}>
                      Cancel
                    </Button>
                    <Body.StyledButton onClick={e => this.updateQuestions(e, (index * 2) + 1)}>
                      Save
                    </Body.StyledButton>
                  </Body.ButtonsContainer>
                ) : (
                  <Body.ReorderContainer>
                    <Body.StyledButton onClick={(e) => this.dragsetState(e, (index * 2) + 1,
                        sortedQuizQuestions)}
                      disabled={this.state.activeQuestionGroup !== null}
                    >
                        Reorder
                    </Body.StyledButton>
                  </Body.ReorderContainer>
                  ))
              }
              {
                !dragDisableState[(index * 2) + 1] &&
                this.Wrapper((this.state.draggedQuestions), (index * 2) + 1)
              }
              {
                dragDisableState[(index * 2) + 1] &&
                this.Wrapper(sortedQuizQuestions, (index * 2) + 1)
              }
            </React.Fragment>
          )
        })
      )
    )
  }
}
QuestionsBody.propTypes = {
  questionBanks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  learningObjectives: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  openEdit: PropTypes.func.isRequired,
  openEmulatorView: PropTypes.func.isRequired,
  deleteQuestion: PropTypes.func.isRequired,
  publishQuestion: PropTypes.func.isRequired,
  unpublishQuestion: PropTypes.func.isRequired,
  editQuestions: PropTypes.func.isRequired,
  isFetchingQuestionbank: PropTypes.bool.isRequired
}
