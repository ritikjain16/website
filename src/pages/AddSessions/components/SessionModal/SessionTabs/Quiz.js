import { Button, Divider } from 'antd'
import { get, sortBy } from 'lodash'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { fetchQuizQuestion } from '../../../../../actions/courseMaker'
import { QUIZ } from '../../../../../constants/CourseComponents'
import { isPythonCourse } from '../../../../../utils/data-utils'
import { CloseIcon, TopContainer } from '../../../AddSessions.styles'
import SelectInput from '../../SelectInput'
import ArrangeBlock from '../TopicComponents/QuestionView/ArrangeBlock'
import FibBlock from '../TopicComponents/QuestionView/FibBlock'
import FibInput from '../TopicComponents/QuestionView/FibInput'
import Mcq from '../TopicComponents/QuestionView/Mcq'
import { QuestionContainer } from '../TopicComponents/QuestionView/QuestionView.styles'

class Quiz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchVal: '',
      quizDataArray: [],
      isReordering: false,
      groupedByLo: []
    }
  }
  componentDidMount = async () => {
    const { quizList, params } = this.props
    this.setQuizData()
    const courseIdFromRoute = get(params, 'courseId')
    if (quizList.length === 0) {
      await fetchQuizQuestion(courseIdFromRoute)
    }
  }
  onSelect = (value) => {
    const { onValueSelect, uniqueName } = this.props
    onValueSelect(value, uniqueName, QUIZ)
  }
  setQuizData = () => {
    const { selectedData, loList } = this.props
    const groupedByLo = []
    selectedData.reduce((acc, currVal) => {
      // getting only those LO which belongs to the current course
      const currentCourseLo = loList.map(lo => get(lo, 'id'))
      const loFromQuizOfCurrCourse = get(currVal, 'data.learningObjectives', []).find(lo =>
        currentCourseLo.includes(get(lo, 'id')))
      if (loFromQuizOfCurrCourse && get(loFromQuizOfCurrCourse, 'id') === get(acc, 'id')) {
        acc.quizdata.push(currVal)
      } else if (loFromQuizOfCurrCourse) {
        acc = {
          id: get(loFromQuizOfCurrCourse, 'id'),
          title: get(loFromQuizOfCurrCourse, 'title'),
          quizdata: [currVal]
        }
        groupedByLo.push(acc)
      }
      return acc
    }, {})
    this.setState({
      quizDataArray: selectedData,
      groupedByLo
    })
  }

  onCancelClick = () => {
    this.setState({
      isReordering: false
    }, this.setQuizData)
  }
  onDeselect = (value) => {
    const { onValueDeselect, uniqueName } = this.props
    onValueDeselect(value, QUIZ, uniqueName)
  }

  renderQuiz = (question) => {
    const inputCodeStyles = {
      height: '44px',
      borderRadius: '3px',
      backgroundColor: '#013d4e',
      marginTop: '11px',
      marginBottom: '12px',
      marginHorizontal: 0,
      paddingVertical: '12px',
      paddingHorizontal: 0
    }
    const { isReordering } = this.state
    if (get(question, 'questionType') === 'mcq') {
      return <Mcq question={question}
        inputCodeStyles={inputCodeStyles}
        isReordering={isReordering}
      />
    }
    if (get(question, 'questionType') === 'fibInput') {
      return <FibInput question={question}
        inputCodeStyles={inputCodeStyles}
        isReordering={isReordering}
      />
    }
    if (get(question, 'questionType') === 'fibBlock') {
      return <FibBlock question={question}
        inputCodeStyles={inputCodeStyles}
        isReordering={isReordering}
      />
    }
    if (get(question, 'questionType') === 'arrange') {
      return <ArrangeBlock question={question}
        inputCodeStyles={inputCodeStyles}
        isReordering={isReordering}
      />
    }
  }

  rowStyle = (isDragging, dragglePropsStyle) => (
    {
      margin: '10px auto',
      width: '100%',
      maxWidth: '400px',
      border: `1px solid ${isDragging ? 'black' : 'transparent'}`,
      ...dragglePropsStyle
    }
  )
  reorder = (data, startIndex, endIndex) => {
    const result = Array.from(data)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  componentDidUpdate = async (prevProps) => {
    const { selectedData, loList } = this.props
    if (prevProps.selectedData !== selectedData) {
      this.setQuizData()
    }
    if (prevProps.loList !== loList) {
      this.setQuizData()
    }
  }
  onDragEnd = (result) => {
    // dropped outside the list
    const { quizDataArray } = this.state
    if (!result.destination) {
      return
    }

    // updating the view layer data
    const quizData = [...quizDataArray]
    const draggedData = this.reorder(
      quizData,
      result.source.index,
      result.destination.index
    )
    const newQuizData = []
    draggedData.forEach((quiz) => {
      newQuizData.push(quiz)
    })
    this.setState({
      quizDataArray: newQuizData,
    })
  }
  onReorderSave = () => {
    const { quizDataArray } = this.state
    const { onReorderSaved } = this.props
    const newQuizData = []
    quizDataArray.forEach(({ data }, index) => {
      newQuizData.push({
        order: index + 1,
        data
      })
    })
    onReorderSaved(newQuizData)
    this.onCancelClick()
  }

  onLoQuizSelect = (value) => {
    const { onValueSelect, uniqueName } = this.props
    onValueSelect(value, uniqueName, QUIZ, true)
  }

  onLoQuizDeselect = (value) => {
    const { onValueDeselect, uniqueName } = this.props
    onValueDeselect(value, QUIZ, uniqueName, true)
  }
  render() {
    const { searchVal, quizDataArray, isReordering, groupedByLo } = this.state
    const { questionBankFetchingStatus, quizList, loList,
      selectedValue, learningObectiveFetchingStatus,
      selectedLo, params } = this.props
    const courseId = get(params, 'courseId')
    return (
      <>
        <TopContainer justify='center' style={{ alignItems: 'flex-start' }}>
          <div>
            <h3>Search By LO title</h3>
            <SelectInput
              searchVal={searchVal}
              placeholder='Search By Lo'
              loading={learningObectiveFetchingStatus && get(learningObectiveFetchingStatus.toJS(), 'loading')}
              values={selectedLo}
              onSelect={this.onLoQuizSelect}
              onDeselect={this.onLoQuizDeselect}
              onChange={value => this.setState({ searchVal: value })}
              data={loList}
              assignmentListOfQuiz
            />
          </div>
          <div style={{ margin: '0 10px' }} />
          <div>
            <h3>Search By Quiz statement</h3>
            <SelectInput
              searchVal={searchVal}
              placeholder='Search Quiz'
              loading={questionBankFetchingStatus && get(questionBankFetchingStatus.toJS(), 'loading')}
              values={selectedValue}
              onSelect={this.onSelect}
              onDeselect={this.onDeselect}
              data={quizList}
              onChange={value => this.setState({ searchVal: value })}
              assignmentList
            />
          </div>
        </TopContainer>
        {
          !isPythonCourse(courseId) && (
            <TopContainer justify='flex-end' style={{ width: '80%' }}>
              {
                isReordering ? (
                  <>
                    <Button
                      type='dashed'
                      style={{ marginRight: '10px' }}
                      onClick={this.onCancelClick}
                    >Cancel
                    </Button>
                    <Button type='primary' onClick={this.onReorderSave}>Save</Button>
                  </>
                ) : <Button onClick={() => this.setState({ isReordering: true })}>Reorder</Button>
              }
            </TopContainer>
          )
        }
        <div
          style={{
            width: '100%',
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto',
            height: '550px',
            border: '0.5px solid #282828',
            background: '#f6f6f6',
            overflow: 'auto'
        }}
        >
          {
            groupedByLo && groupedByLo.length > 0 && !isReordering && (
              groupedByLo.map((groupData, ind) => (
                <div>
                  <h3 key={get(groupData, 'id')}>LO: {get(groupData, 'title')}</h3>
                  {
                    sortBy(get(groupData, 'quizdata', []), 'order').map(({ data }) => (
                      <div style={{ margin: '10px auto', width: 'fit-content' }}>
                        <QuestionContainer>
                          <CloseIcon
                            onClick={() =>
                            this.onDeselect({ key: get(data, 'id'), id: get(data, 'id'), ...data })}
                          />
                          {this.renderQuiz(data)}
                        </QuestionContainer>
                      </div>
                    ))
                  }
                  {ind !== groupedByLo.length - 1 && <Divider style={{ height: '2px' }} />}
                </div>
              ))
            )
          }
          {
            isReordering && quizDataArray.length > 0 && (
              <DragDropContext onDragEnd={this.onDragEnd} >
                <Droppable
                  droppableId='droppable'
                  isDropDisabled={!isReordering}
                >
                  {provided => (
                    <div ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        margin: '0 auto',
                        width: '100%',
                        maxWidth: '400px',
                      }}
                    >
                      {
                        quizDataArray.map(({ order, data }, i) => (
                          <Draggable index={i}
                            draggableId={order}
                            key={order}
                            isDragDisabled={!isReordering}
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
                                  <QuestionContainer>
                                    <CloseIcon
                                      onClick={() =>
                                        this.onDeselect({ key: get(data, 'id'), id: get(data, 'id'), ...data })}
                                    />
                                    {this.renderQuiz(data)}
                                  </QuestionContainer>
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
            )
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  questionBankFetchingStatus: state.data.getIn(['questionBanks', 'fetchStatus', 'questionBanks']),
  learningObectiveFetchingStatus: state.data.getIn(['learningObjectives', 'fetchStatus', 'learningObjectives']),
})

export default connect(mapStateToProps)(Quiz)
