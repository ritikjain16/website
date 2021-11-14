import { get } from 'lodash'
import React from 'react'
import { fetchContentCourses, fetchContentProject, fetchProjectCount } from '../../../actions/contentMaker'
import { PROJECT } from '../../../constants/CourseComponents'
import { getSuccessStatus } from '../../../utils/data-utils'
import SearchInput from '../AssignModal/SearchInput'
import { getFilterOptions } from '../contentUtils'
import { ProjectModal, ProjectTable } from './components'
import { FlexContainer, StyledButton } from './ContentProject.styles'

class ContentProject extends React.Component {
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
  fetchProject = async (shouldFetch = true) => {
    const { searchKey, searchValue, selectedCourse, selectedTopic } = this.state
    const filterOption = getFilterOptions({
      searchValue,
      searchKey,
      selectedCourse,
      selectedTopic
    })
    if (shouldFetch) await fetchContentProject('project', filterOption)
    await fetchProjectCount('project', filterOption)
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
      }, this.fetchProject)
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
    }, this.fetchProject)
  }

  onInputChange = (value, radio) => {
    this.setState({
      searchValue: value
    }, () => radio && this.fetchProject())
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && this.state.searchValue) {
      this.fetchProject()
    }
  }
  fetchProjectCountValue = async () => {
    this.setState({
      tableLoading: false
    })
    await this.fetchProject(false)
    this.setState({
      tableLoading: true
    })
  }
  render() {
    const { editData, openModal, operation,
      coursesList, searchKey, searchValue,
      topicsList, selectedCourse, selectedTopic, tableLoading } = this.state
    const { blockBasedProjectsMeta, projectsFetchingStatus, coursesFetchStatus } = this.props
    return (
      <>
        <FlexContainer justify='space-between'>
          <SearchInput
            componentName={PROJECT}
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
          <ProjectModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            searchByFilter={this.fetchProject}
            fetchCounts={this.fetchProjectCountValue}
            blockBasedProjectsMeta={blockBasedProjectsMeta}
            coursesList={coursesList}
            closeModal={() => this.setState({ openModal: false, operation: null, editData: null })}
            {...this.props}
          />
          <FlexContainer>
            <h4>Total Projects: {blockBasedProjectsMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              onClick={this.openAddModal}
              disabled={projectsFetchingStatus && get(projectsFetchingStatus.toJS(), 'loading')}
            >
              ADD PROJECT
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
        <ProjectTable
          opneEditModal={this.opneEditModal}
          coursesList={coursesList}
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          searchKey={searchKey}
          tableLoading={tableLoading}
          fetchCounts={this.fetchProjectCountValue}
          {...this.props}
        />
      </>
    )
  }
}

export default ContentProject
