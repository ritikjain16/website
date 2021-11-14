import { Button } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import { fetchTopicAssignments } from '../../../../../actions/courseMaker'
import { HOMEWORK_ASSIGNMENT } from '../../../../../constants/CourseComponents'
import { isPythonCourse } from '../../../../../utils/data-utils'
import { TopContainer } from '../../../AddSessions.styles'
import SelectInput from '../../SelectInput'
import { AssignmentView } from '../TopicComponents'

class HomeWorkAssignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchVal: '',
      assignmentDataArray: [],
      isReordering: false
    }
  }
  componentDidMount = async () => {
    const { assignmentList, courseId } = this.props
    this.setAssignmentData()
    if (assignmentList.length === 0) {
      await fetchTopicAssignments(courseId, true)
    }
  }
  setAssignmentData = () => {
    const { selectedData } = this.props
    if (selectedData) {
      this.setState({
        assignmentDataArray: selectedData,
      })
    }
  }
  onCancelClick = () => {
    this.setState({
      isReordering: false
    }, this.setAssignmentData)
  }
  componentDidUpdate = async (prevProps) => {
    const { selectedData, courseId } = this.props
    if (prevProps.selectedData.length !== selectedData.length) {
      this.setAssignmentData()
    }
    if (prevProps.courseId !== courseId
      && courseId) {
      await fetchTopicAssignments(courseId, true)
    }
  }
  onSelect = (value) => {
    const { onValueSelect, uniqueName } = this.props
    onValueSelect(value, uniqueName, HOMEWORK_ASSIGNMENT)
  }

  onDeselect = (value) => {
    const { onValueDeselect, uniqueName } = this.props
    onValueDeselect(value, HOMEWORK_ASSIGNMENT, uniqueName)
  }
  rowStyle = (isDragging, dragglePropsStyle) => (
    {
      margin: '10px auto',
      width: 'fit-content',
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

  onDragEnd = (result) => {
    // dropped outside the list
    const { assignmentDataArray } = this.state
    if (!result.destination) {
      return
    }

    // updating the view layer data
    const assignmentData = [...assignmentDataArray]
    const draggedData = this.reorder(
      assignmentData,
      result.source.index,
      result.destination.index
    )
    const newAssignmentData = []
    draggedData.forEach((quiz) => {
      newAssignmentData.push(quiz)
    })
    this.setState({
      assignmentDataArray: newAssignmentData,
    })
  }
  onReorderSave = () => {
    const { assignmentDataArray } = this.state
    const { onReorderSaved } = this.props
    const newAssignmentData = []
    assignmentDataArray.forEach(({ data }, index) => {
      newAssignmentData.push({
        order: index + 1,
        data
      })
    })
    onReorderSaved(newAssignmentData)
    this.onCancelClick()
  }
  render() {
    const { searchVal, assignmentDataArray, isReordering } = this.state
    const { homeworkAssignmentFetchingStatus,
      assignmentList, selectedValue,
      params } = this.props
    const courseId = get(params, 'courseId')
    return (
      <>
        <TopContainer justify='center'>
          <SelectInput
            searchVal={searchVal}
            placeholder='Search Assignment'
            loading={homeworkAssignmentFetchingStatus
                && get(homeworkAssignmentFetchingStatus.toJS(), 'loading')}
            values={selectedValue}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            onChange={value => this.setState({ searchVal: value })}
            assignmentList
            data={assignmentList}
          />
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
        {
          assignmentDataArray.length > 0 && (
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
                      width: 'fit-content'
                    }}
                  >
                    {
                      assignmentDataArray.map(({ order, data }, i) => (
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
                                <AssignmentView
                                  assignmentData={data}
                                  isReordering={isReordering}
                                  onDelete={() => this.onDeselect({
                                    key: get(data, 'id'),
                                    id: get(data, 'id'),
                                    ...data
                                  })}
                                />
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
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  homeworkAssignmentFetchingStatus: state.data.getIn(['assignmentQuestions', 'fetchStatus', 'homeworkAssignment']),
})

export default connect(mapStateToProps)(HomeWorkAssignment)
