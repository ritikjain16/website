import React from 'react'
import { get } from 'lodash'
import { Pagination } from 'antd'
import {
  FlexContainer, StyledButton
} from './ContentLearningObjective.styles'
import LoModal from './components/LoModal'
import {
  fetchContentLearningObjective, fetchContentCourses, fetchLOCount
} from '../../../actions/contentMaker'
import LoTable from './components/LoTable/LoTable'
import { getSuccessStatus } from '../../../utils/data-utils'
import { LEARNING_OBJECTIVE } from '../../../constants/CourseComponents'
import SearchInput from '../AssignModal/SearchInput'
import { getFilterOptions } from '../contentUtils'

class ContentLearningObjective extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: null,
      operation: '',
      editData: null,
      currentPage: 1,
      perPage: 10,
      skip: 0,
      coursesList: [],
      topicsList: [],
      searchKey: 'course',
      searchValue: '',
      selectedCourse: '',
      selectedTopic: '',
      tableLoading: true
    }
  }
  fetchLearningObjective = async (shouldFetch = true) => {
    const { perPage, skip, searchKey, searchValue,
      selectedCourse, selectedTopic } = this.state
    const filterOption = getFilterOptions({
      searchKey,
      searchValue,
      selectedCourse,
      selectedTopic
    })
    if (shouldFetch) await fetchContentLearningObjective({ perPage, skip, filterOption })
    await fetchLOCount({ filterOption })
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
      }, this.fetchLearningObjective)
    }
  }
  openAddModal = () => {
    this.setState({
      openModal: true,
      operation: 'add'
    })
  }
  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
        skip: page - 1,
      },
      () => this.fetchLearningObjective()
    )
  }
  openEditModal = (data) => {
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
    }, this.fetchLearningObjective)
  }

  onInputChange = (value, radio) => {
    this.setState({
      searchValue: value
    }, () => radio && this.fetchLearningObjective())
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && this.state.searchValue) {
      this.fetchLearningObjective()
    }
  }

  fetchLOCountValue = async () => {
    const { searchKey, searchValue, selectedCourse, selectedTopic } = this.state
    this.setState({
      tableLoading: false
    })
    const filterOption = getFilterOptions({
      searchKey,
      searchValue,
      selectedCourse,
      selectedTopic
    })
    await fetchLOCount({ filterOption })
    this.setState({
      tableLoading: true
    })
  }
  render() {
    const { openModal, operation, editData, perPage,
      currentPage, coursesList, searchKey, searchValue,
      selectedCourse, selectedTopic, topicsList, tableLoading } = this.state
    const { learningObectiveFetchingStatus, learningObjectivesMeta, coursesFetchStatus
    } = this.props
    return (
      <>
        <FlexContainer justify='space-between'>
          <SearchInput
            componentName={LEARNING_OBJECTIVE}
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
          <LoModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            searchByFilter={this.searchByFilter}
            learningObjectivesMeta={learningObjectivesMeta}
            closeModal={() => this.setState({ openModal: false, operation: null, editData: null })}
            coursesList={coursesList}
            fetchLo={async () => {
              this.setState({
                tableLoading: false
              })
              await this.fetchLearningObjective()
              this.setState({
                tableLoading: true
              })
            }}
            fetchLOCountValue={this.fetchLOCountValue}
            {...this.props}
          />
          <FlexContainer>
            <h4>Total LO: {learningObjectivesMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              onClick={this.openAddModal}
              disabled={learningObectiveFetchingStatus && get(learningObectiveFetchingStatus.toJS(), 'loading')}
            >
              ADD LO
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
        {
          learningObjectivesMeta > perPage && (
            <FlexContainer justify='center'>
              <Pagination
                total={learningObjectivesMeta || 0}
                onChange={this.onPageChange}
                current={currentPage}
                defaultPageSize={perPage}
              />
            </FlexContainer>
          )
        }
        <LoTable
          openEditModal={this.openEditModal}
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          searchKey={searchKey}
          coursesList={coursesList}
          tableLoading={tableLoading}
          fetchLOCountValue={this.fetchLOCountValue}
          {...this.props}
        />
      </>
    )
  }
}

export default ContentLearningObjective
