import { get } from 'lodash'
import React from 'react'
import { fetchContentCourses, fetchContentProject, fetchProjectCount } from '../../../actions/contentMaker'
import { PRACTICE } from '../../../constants/CourseComponents'
import { getSuccessStatus } from '../../../utils/data-utils'
import SearchInput from '../AssignModal/SearchInput'
import { getFilterOptions } from '../contentUtils'
import { PracticeModal, PracticeTable } from './components'
import { FlexContainer, StyledButton } from './ContentPractice.styles'

class ContentPractice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: null,
      operation: '',
      editData: null,
      coursesList: [],
      topicsList: [],
      searchKey: 'course',
      searchValue: '',
      selectedCourse: '',
      selectedTopic: '',
      tableLoading: true
    }
  }
  fetchPractice = async (shouldFetch = true) => {
    const { searchValue, searchKey, selectedCourse,
      selectedTopic } = this.state
    const filterOption = getFilterOptions({
      searchKey,
      searchValue,
      selectedTopic,
      selectedCourse
    })
    if (shouldFetch) await fetchContentProject('practice', filterOption)
    await fetchProjectCount('practice', filterOption)
  }
  componentDidMount = async () => {
    await fetchContentCourses()
  }

  componentDidUpdate = (prevProps) => {
    const { coursesFetchStatus } = this.props
    if (getSuccessStatus(coursesFetchStatus, prevProps.coursesFetchStatus)) {
      this.setState({
        coursesList: this.props.coursesData ? this.props.coursesData.toJS() : []
      }, this.setCourseAndTopics)
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
      }, this.fetchPractice)
    }
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
    }, this.fetchPractice)
  }

  onInputChange = (value, radio) => {
    this.setState({
      searchValue: value
    }, () => radio && this.fetchPractice())
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && this.state.searchValue) {
      this.fetchPractice()
    }
  }

  fetchProjectCountValue = async () => {
    this.setState({
      tableLoading: false
    })
    await this.fetchPractice(false)
    this.setState({
      tableLoading: true
    })
  }
  render() {
    const { openModal, operation, editData, coursesList,
      topicsList, searchKey, searchValue,
      selectedCourse, selectedTopic, tableLoading
    } = this.state
    const { blockBasedPracticeMeta, practiceFetchingStatus,
      coursesFetchStatus } = this.props
    return (
      <>
        <FlexContainer justify='space-between'>
          <SearchInput
            componentName={PRACTICE}
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
          <PracticeModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            searchByFilter={async () => {
              this.setState({
                tableLoading: false
              })
              await this.fetchPractice()
              this.setState({
                tableLoading: true
              })
            }}
            closeModal={() => this.setState({ openModal: false, operation: null, editData: null })}
            coursesList={coursesList}
            fetchProjectCount={this.fetchProjectCountValue}
            {...this.props}
          />
          <FlexContainer>
            <h4>Total Practice: {blockBasedPracticeMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              onClick={this.openAddModal}
              disabled={practiceFetchingStatus && get(practiceFetchingStatus.toJS(), 'loading')}
            >
              ADD PRACTICE
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
        <PracticeTable
          opneEditModal={this.opneEditModal}
          coursesList={coursesList}
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          searchKey={searchKey}
          fetchProjectCount={this.fetchProjectCountValue}
          tableLoading={tableLoading}
          {...this.props}
        />
      </>
    )
  }
}

export default ContentPractice
