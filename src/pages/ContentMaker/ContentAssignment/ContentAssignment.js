import React from 'react'
import { get } from 'lodash'
import { fetchAssignmentCount, fetchAssignmentQuestions, fetchContentCourses } from '../../../actions/contentMaker'
import { StyledButton } from '../ContentLearningObjective/ContentLearningObjective.styles'
import { AssignmentContainer } from './ContentAssignment.style'
import { AssignmentModal, AssignmentTable } from './components'
import { getSuccessStatus } from '../../../utils/data-utils'
import { ASSIGNMENT, HOMEWORK_ASSIGNMENT } from '../../../constants/CourseComponents'
import SearchInput from '../AssignModal/SearchInput'
import { getFilterOptions } from '../contentUtils'
import getComponentName from '../../../utils/getComponentName'

class ContentAssignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editData: null,
      openModal: false,
      operation: '',
      coursesList: [],
      assignmentData: [],
      topicsList: [],
      searchKey: 'course',
      searchValue: '',
      selectedCourse: '',
      selectedTopic: '',
      tableLoading: true
    }
  }
  componentDidMount = async () => {
    await fetchContentCourses()
  }
  fetchAssignments = async (shouldFetch = true) => {
    const { searchKey, searchValue, selectedCourse,
      selectedTopic } = this.state
    let filterOption = getFilterOptions({
      searchKey, searchValue, selectedCourse, selectedTopic
    })
    const isHomeworkPage = get(this.props, 'match.path').includes(HOMEWORK_ASSIGNMENT)
    let currentComponent = ASSIGNMENT
    if (isHomeworkPage) {
      filterOption += '{ isHomework: true }'
      currentComponent = HOMEWORK_ASSIGNMENT
    } else {
      filterOption += '{ isHomework: false }'
    }
    if (shouldFetch) await fetchAssignmentQuestions(filterOption, currentComponent)
    await fetchAssignmentCount(filterOption, currentComponent)
  }
  componentDidUpdate = (prevProps) => {
    const { coursesFetchStatus, match } = this.props

    if (get(match, 'path') !== get(prevProps, 'match.path')) {
      this.fetchAssignments()
    }

    if (getSuccessStatus(coursesFetchStatus, prevProps.coursesFetchStatus)) {
      this.setState({
        coursesList: this.props.coursesData ? this.props.coursesData.toJS() : []
      }, this.setCourseAndTopics)
    }
  }

  setCourseAndTopics = () => {
    const { coursesList } = this.state
    if (coursesList.length > 0) {
      const topicsList = []
      coursesList.forEach(course => {
        if (get(course, 'topics', []).length > 0) {
          get(course, 'topics', []).forEach(topic => {
            const isExist = topicsList.find(to => get(to, 'id') === get(topic, 'id'))
            if (!isExist) {
              topicsList.push(topic)
            }
          })
        }
      })
      this.setState({
        selectedCourse: get(coursesList, '[0].id'),
        topicsList
      }, this.fetchAssignments)
    }
  }
  openAddModal = () => {
    this.setState({
      openModal: true,
      operation: 'add'
    })
  }
  opneEditModal = (data) => {
    this.setState({
      openModal: true,
      operation: 'edit',
      editData: data
    })
  }
  setAssignmentData = (data) => {
    this.setState({
      assignmentData: data
    })
  }

  onSearchTypeChange = (value) => {
    this.setState({
      searchKey: value,
      searchValue: '',
      selectedCourse: '',
      selectedTopic: ''
    })
  }
  onTopicOrCourseChange = (value, name) => {
    this.setState({
      [name]: value
    }, this.fetchAssignments)
  }

  onInputChange = (value, radio) => {
    this.setState({
      searchValue: value
    }, () => radio && this.fetchAssignments())
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && this.state.searchValue) {
      this.fetchAssignments()
    }
  }
  render() {
    const { assignmentQuestionFetchingStatus, assignmentQuestionMeta,
      coursesFetchStatus } = this.props
    const { editData, openModal, operation, assignmentData,
      coursesList, searchKey, searchValue, selectedCourse,
      selectedTopic, topicsList, tableLoading } = this.state
    const currentComponent = get(this.props, 'match.path').includes(HOMEWORK_ASSIGNMENT)
      ? HOMEWORK_ASSIGNMENT : ASSIGNMENT
    return (
      <>
        <AssignmentContainer justify='space-between'>
          <SearchInput
            componentName={currentComponent}
            searchKey={searchKey}
            searchValue={searchValue}
            coursesList={coursesList}
            topicsList={topicsList}
            selectedCourse={selectedCourse}
            selectedTopic={selectedTopic}
            courseLoading={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
            onTopicOrCourseChange={this.onTopicOrCourseChange}
            onSearchTypeChange={this.onSearchTypeChange}
            onInputChange={this.onInputChange}
            onKeyPress={this.onKeyPress}
          />
          <AssignmentModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            assignmentData={assignmentData}
            coursesList={coursesList}
            currentComponent={currentComponent}
            closeModal={() => this.setState({
              openModal: false,
              operation: null,
              editData: null
            })}
            {...this.props}
          />
          <AssignmentContainer>
            <h4>Total {getComponentName(currentComponent)}: {assignmentQuestionMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              onClick={this.openAddModal}
              disabled={assignmentQuestionFetchingStatus && get(assignmentQuestionFetchingStatus.toJS(), 'loading')}
            >
              Add {getComponentName(currentComponent)}
            </StyledButton>
          </AssignmentContainer>
        </AssignmentContainer>
        <AssignmentTable
          opneEditModal={this.opneEditModal}
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          searchKey={searchKey}
          setAssignmentData={this.setAssignmentData}
          coursesList={coursesList}
          fetchAssignmentCount={async () => {
            this.setState({
              tableLoading: false
            })
            await this.fetchAssignments(false)
            this.setState({
              tableLoading: true
            })
          }}
          tableLoading={tableLoading}
          currentComponent={currentComponent}
          {...this.props}
        />
      </>
    )
  }
}

export default ContentAssignment
