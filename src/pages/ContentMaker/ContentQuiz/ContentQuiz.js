import { Pagination } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { fetchContentCourses, fetchQuestions, fetchQuizCount } from '../../../actions/contentMaker'
import { QUIZ } from '../../../constants/CourseComponents'
import { QuizContainer, StyledButton } from './ContentQuiz.style'
import QuestionsTable from '../ContentQuestions/components/QuestionTable/QuestionTable'
import { getSuccessStatus } from '../../../utils/data-utils'
import SearchInput from '../AssignModal/SearchInput'
import { getFilterOptions } from '../contentUtils'
import fetchLO from '../contentUtils/fetchLO'
import { fetchContentTags } from '../../../actions/contentTags'

class ContentQuiz extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addModalVisible: false,
      coursesList: [],
      topicsList: [],
      loList: [],
      currentPage: 1,
      perPage: 10,
      skip: 0,
      searchKey: 'course',
      searchValue: '',
      selectedCourse: '',
      selectedTopic: '',
      groupedLOs: {}
    }
  }
  componentDidMount = async () => {
    fetchLO().then(res => {
      if (res && get(res, 'data.learningObjectives', []).length > 0) {
        const groupedLOs = get(res, 'data.learningObjectives', []).reduce((acc, currVal) => {
          get(currVal, 'courses', []).forEach(course => {
            const courseName = `${get(course, 'title')}|${get(course, 'id')}`
            if (acc && acc[courseName]) {
              acc[courseName].push(currVal)
            } else {
              acc[courseName] = [currVal]
            }
          })
          return acc
        }, {})
        this.setState({
          loList: get(res, 'data.learningObjectives'),
          groupedLOs
        })
      }
    })
    fetchContentTags(`{ and: [
        {status:published}
      ]
    }`, 0, 0)
    await fetchContentCourses()
  }

  fetchQuizData = async (shouldFetch = true) => {
    const { perPage, skip, selectedTopic, selectedCourse,
      searchValue, searchKey } = this.state
    const filterOption = getFilterOptions({
      searchKey,
      searchValue,
      selectedCourse,
      selectedTopic
    })
    if (shouldFetch) {
      await fetchQuestions({
        filterOption,
        key: QUIZ,
        perPage,
        skip
      })
    }
    await fetchQuizCount({ filterOption })
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
      }, this.fetchQuizData)
    }
  }
  onPageChange = (page) => {
    this.setState(
      {
        currentPage: page,
        skip: page - 1,
      },
      this.fetchQuizData
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
      skip: 0,
    }, this.fetchQuizData)
  }

  onInputChange = (value, radio) => {
    this.setState({
      searchValue: value
    }, () => radio && this.fetchQuizData())
  }

  onKeyPress = (e) => {
    if (e.key === 'Enter' && this.state.searchValue) {
      this.fetchQuizData()
    }
  }
  render() {
    const { addModalVisible, coursesList, currentPage,
      perPage, searchKey, searchValue, selectedCourse,
      selectedTopic, topicsList, loList, groupedLOs } = this.state
    const { quizFetchingStatus, quizMetaCount,
      coursesFetchStatus } = this.props
    return (
      <>
        <QuizContainer justify='space-between'>
          <SearchInput
            componentName={QUIZ}
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
          <div style={{ display: 'flex' }}>
            <h4>Total Quiz: {quizMetaCount || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              disabled={quizFetchingStatus && get(quizFetchingStatus.toJS(), 'loading')}
              onClick={() => this.setState({ addModalVisible: true })}
            >
              ADD QUIZ
            </StyledButton>
          </div>
        </QuizContainer>
        {
          quizMetaCount > perPage && (
            <QuizContainer justify='center'>
              <Pagination
                total={quizMetaCount || 0}
                onChange={this.onPageChange}
                current={currentPage}
                defaultPageSize={perPage}
              />
            </QuizContainer>
          )
        }
        <QuestionsTable
          addModalVisible={addModalVisible}
          onCloseAdd={() => this.setState({ addModalVisible: false })}
          assessmentType={QUIZ}
          coursesList={coursesList}
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          searchKey={searchKey}
          fetchQuizCount={this.fetchQuizData}
          allLoList={loList}
          groupedLOs={groupedLOs}
          {...this.props}
        />
      </>
    )
  }
}

export default ContentQuiz
