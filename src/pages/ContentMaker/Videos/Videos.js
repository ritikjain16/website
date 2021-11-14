import { Pagination } from 'antd'
import { get } from 'lodash'
import React from 'react'
import {
  fetchVideoContent, fetchContentCourses, fetchVideoCount,
} from '../../../actions/contentMaker'
import { VIDEO } from '../../../constants/CourseComponents'
import { getSuccessStatus } from '../../../utils/data-utils'
import SearchInput from '../AssignModal/SearchInput'
import { getFilterOptions } from '../contentUtils'
import { VideoModal, VideoTable } from './components'
import { FlexContainer, StyledButton } from './Videos.styles'

class Videos extends React.Component {
  state = {
    openModal: false,
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
    selectedTopic: ''
  }
  fetchVideos = async (fetchData = true) => {
    const { perPage, skip, searchKey, searchValue,
      selectedCourse, selectedTopic } = this.state
    const filterOption = getFilterOptions({
      searchKey,
      searchValue,
      selectedTopic,
      selectedCourse
    })
    if (fetchData) {
      await fetchVideoContent(perPage, skip, filterOption)
    }
    fetchVideoCount(filterOption)
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
      }, this.fetchVideos)
    }
  }
  openAddModal = () => {
    this.setState({
      openModal: true,
      operation: 'add'
    })
  }
  openEditModal = (data) => {
    this.setState({
      openModal: true,
      operation: 'edit',
      editData: data
    })
  }
  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
        skip: page - 1,
      },
      () => this.fetchVideos()
    )
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
      [name]: value,
      currentPage: 1,
      perPage: 10,
      skip: 0,
    }, this.fetchVideos)
  }

  onInputChange = (value, radio) => {
    this.setState({
      searchValue: value
    }, () => radio && this.fetchVideos())
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && this.state.searchValue) {
      this.fetchVideos()
    }
  }
  render() {
    const { videosMeta, videosFetchingStatus, coursesFetchStatus } = this.props
    const { openModal, operation, editData, perPage,
      currentPage, coursesList, searchValue,
      searchKey, topicsList, selectedCourse,
      selectedTopic, } = this.state
    return (
      <>
        <FlexContainer justify='space-between'>
          <SearchInput
            componentName={VIDEO}
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
          <VideoModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            searchByFilter={this.searchByFilter}
            videosMeta={videosMeta}
            closeModal={() => this.setState({ openModal: false, operation: null, editData: null })}
            coursesList={coursesList}
            fetchVideos={this.fetchVideos}
            fetchVideoCount={() => this.fetchVideos(false)}
            {...this.props}
          />
          <FlexContainer>
            <h4>Total Videos: {videosMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              onClick={this.openAddModal}
              disabled={videosFetchingStatus && get(videosFetchingStatus.toJS(), 'loading')}
            >
              ADD VIDEO
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
        {
          videosMeta > perPage && (
            <FlexContainer justify='center'>
              <Pagination
                total={videosMeta || 0}
                onChange={this.onPageChange}
                current={currentPage}
                defaultPageSize={perPage}
              />
            </FlexContainer>
          )
        }
        <VideoTable
          openEditModal={this.openEditModal}
          coursesList={coursesList}
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          searchKey={searchKey}
          fetchVideoCount={() => this.fetchVideos(false)}
          {...this.props}
        />
      </>
    )
  }
}

export default Videos
