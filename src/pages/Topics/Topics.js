import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { get } from 'lodash'
import Main from './Topics.style'
import TopicsTable from './components/TopicsTable'
import TopicsModal from './components/TopicsModal'
import getFullPath from '../../utils/getFullPath'
import { getOrdersInUse, getOrderAutoComplete, getDataById, filterItems, getDataByProp } from '../../utils/data-utils'

class Topics extends Component {
  static propTypes = {
    hasChaptersFetched: PropTypes.bool.isRequired,
    fetchChapters: PropTypes.func.isRequired,
    hasTopicsFetched: PropTypes.bool.isRequired,
    fetchTopics: PropTypes.func.isRequired,
    topicsCount: PropTypes.number.isRequired,
    topics: PropTypes.arrayOf(PropTypes.object).isRequired,
    chapters: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetchingTopic: PropTypes.bool.isRequired,
    fetchingTopicsError: PropTypes.bool.isRequired,
    removeThumbnailTopic: PropTypes.func.isRequired,
    deleteTopic: PropTypes.func.isRequired,
    deletingTopicId: PropTypes.string.isRequired,
    addTopic: PropTypes.func.isRequired,
    editTopic: PropTypes.func.isRequired,
    deletingTopicError: PropTypes.string.isRequired,
    hasCoursesFetched: PropTypes.bool.isRequired,
    fetchCourses: PropTypes.func.isRequired,
    courses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired,
  }

  state = {
    shouldAddTopicVisible: false,
    shouldEditTopicVisible: false,
    editModalId: '',
    currentCourse: ''
  }

  componentDidMount() {
    const {
      hasChaptersFetched,
      fetchChapters,
      hasTopicsFetched,
      fetchTopics,
      hasCoursesFetched,
      fetchCourses
    } = this.props

    if (!hasChaptersFetched) {
      fetchChapters()
    }
    if (!hasTopicsFetched) {
      fetchTopics()
    }
    if (!hasCoursesFetched) {
      fetchCourses()
    }
    if (hasCoursesFetched) {
      this.setState({ currentCourse: this.props.courses[0].id })
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.hasCoursesFetched && this.props.hasCoursesFetched) {
      this.setState({ currentCourse: this.props.courses[0].id })
    }
  }

  openAddTopic = () => {
    this.setState({ shouldAddTopicVisible: true })
  }

  closeAddTopic = () => {
    this.setState({ shouldAddTopicVisible: false })
  }

  openEditTopic = id => () => {
    this.setState({
      editModalId: id,
      shouldEditTopicVisible: true
    })
  }

  closeEditTopic = () => {
    this.setState({ shouldEditTopicVisible: false })
  }

  onAddTopicSave = async data => {
    const { addTopic } = this.props
    const hideLoadingMessage = message.loading('Adding Topic...', 0)
    this.closeAddTopic()
    const addedTopic = await addTopic(data)
    hideLoadingMessage()
    if (addedTopic && addedTopic.id) {
      message.success(`Added Topic "${addedTopic.title}"`)
    }
  }

  getPromisesToCall = (
    shouldRemoveThumbnail,
    shouldRemoveSmallThumbnail,
    removeThumbnailTopic,
    removeTopicSmallThumbnail,
    editTopic,
    topics,
    id,
    data
  ) => {
    const promisesToCall = [editTopic(data)]
    if (shouldRemoveThumbnail) {
      promisesToCall.push(removeThumbnailTopic(id, getDataById(topics, id).thumbnail.id))
    }
    if (shouldRemoveSmallThumbnail) {
      promisesToCall.push(removeTopicSmallThumbnail(id, getDataById(topics, id).thumbnailSmall.id))
    }

    return promisesToCall
  }
  onEditTopicSave = async ({ chapterId, isThumbnail, thumbnailUrl, isSmallThumbnail,
    smallThumbnailUrl, ...rest }) => {
    const { editTopic, removeThumbnailTopic, removeTopicSmallThumbnail, topics } = this.props
    const shouldRemoveThumbnail = !isThumbnail && thumbnailUrl
    const shouldRemoveSmallThumbnail = !isSmallThumbnail && smallThumbnailUrl
    const hideLoadingMessage = message.loading('Editing Topic...')
    this.closeEditTopic()
    const prevChapterId = getDataById(topics, rest.id).chapter.id
    let data = rest
    if (prevChapterId !== chapterId) {
      data = {
        ...rest,
        prevChapterId,
        newChapterId: chapterId
      }
    }
    const promisesToCall = this.getPromisesToCall(
      shouldRemoveThumbnail,
      shouldRemoveSmallThumbnail,
      removeThumbnailTopic,
      removeTopicSmallThumbnail,
      editTopic,
      topics,
      rest.id,
      data)
    const result = await Promise.all(promisesToCall)
    hideLoadingMessage()
    const editedTopic = result[0]
    if (editedTopic && editedTopic.id) {
      message.success(`Edited Topic "${editedTopic.title}"`)
    } else {
      message.error()
    }
  }

  deleteTopic = id => async () => {
    const { deleteTopic } = this.props
    const hideLoadingMessage = message.loading('Deleting...', 0)
    const deletedTopic = await deleteTopic(id)
    hideLoadingMessage()
    if (deletedTopic && deletedTopic.id) {
      message.success(`Deleted "${deletedTopic.title}"`)
    } else {
      message.error(this.props.deletingTopicError)
    }
  }

  publishTopic = id => async () => {
    const { editTopic } = this.props
    const hideLoadingMessage = message.loading('Publishing...', 0)
    const editedTopic = await editTopic({
      id,
      status: 'published'
    })
    if (editedTopic && editedTopic.status === 'published') {
      hideLoadingMessage()
      message.success(`Published "${editedTopic.title}"`)
    }
  }

  unpublishTopic = id => async () => {
    const { editTopic } = this.props
    const hideLoadingMessage = message.loading('Unpublishing...', 0)
    const editedTopic = await editTopic({
      id,
      status: 'unpublished'
    })
    if (editedTopic && editedTopic.status === 'unpublished') {
      hideLoadingMessage()
      message.success(`Unpublished "${editedTopic.title}"`)
    }
  }

  render() {
    const {
      isFetchingTopic,
      hasTopicsFetched,
      topics,
      fetchingTopicsError,
      // topicsCount,
      deletingTopicId,
      chapters,
      courses
    } = this.props

    const getTopicsByCourse = getDataByProp(topics, 'chapter.courses[0].id', this.state.currentCourse)
    const ordersInUse = getOrdersInUse(topics)
    const defaultOrder = getOrderAutoComplete(ordersInUse)
    const defaultDataInEditTopic = getDataById(topics, this.state.editModalId)
    return (
      <div>
        <Main.TopContainer>
          <div style={{ flex: 1 }}>
            <Main.Select
              showSearch
              placeholder='Select Course'
              type='text'
              value={this.state.currentCourse}
              onChange={(value) => { this.setState({ currentCourse: value }) }}
            >
              {courses.map(course => (
                <Main.Option value={course.id}>{course.title}</Main.Option>
                  ))}
            </Main.Select>
          </div>
          <Main.TopicsCount>Total Topics: {getTopicsByCourse.length}</Main.TopicsCount>
          <Main.Button
            type='primary'
            icon='plus'
            onClick={this.openAddTopic}
          > ADD TOPICS
          </Main.Button>
        </Main.TopContainer>
        <TopicsTable
          currentCourse={this.state.currentCourse}
          topics={topics}
          chapters={chapters}
          isFetchingTopics={isFetchingTopic}
          hasTopicsFetched={hasTopicsFetched}
          fetchingTopicsError={fetchingTopicsError}
          deleteTopic={this.deleteTopic}
          deletingTopicId={deletingTopicId}
          publishTopic={this.publishTopic}
          unpublishTopic={this.unpublishTopic}
          openEditTopic={this.openEditTopic}
        />
        <TopicsModal
          id='addTopic'
          title='Add new Topic'
          onSave={this.onAddTopicSave}
          chapters={chapters}
          topics={topics}
          visible={this.state.shouldAddTopicVisible}
          closeModal={this.closeAddTopic}
          ordersInUse={ordersInUse}
          defaultValues={{
            title: '',
            description: '',
            order: defaultOrder,
            isQuestionInMessageEnabled: false,
            isTrial: false,
            thumbnailUrl: ''
          }}
        />
        <TopicsModal
          id='editTopic'
          title='Edit Topic'
          onSave={this.onEditTopicSave}
          chapters={chapters}
          topics={topics}
          visible={this.state.shouldEditTopicVisible}
          closeModal={this.closeEditTopic}
          ordersInUse={
            filterItems(ordersInUse, [defaultDataInEditTopic.order])
          }
          defaultValues={{
            id: defaultDataInEditTopic.id,
            title: defaultDataInEditTopic.title,
            description: defaultDataInEditTopic.description,
            order: defaultDataInEditTopic.order,
            isTrial: defaultDataInEditTopic.isTrial,
            isQuestionInMessageEnabled: defaultDataInEditTopic.isQuestionInMessageEnabled,
            chapter: get(defaultDataInEditTopic, 'chapter.id'),
            thumbnailUrl: getFullPath(
              get(defaultDataInEditTopic, 'thumbnail.signedUri', null)
            ),
            smallThumbnailUrl: getFullPath(
                get(defaultDataInEditTopic, 'thumbnailSmall.uri', null)
            )
          }}
        />
      </div>
    )
  }
}

export default Topics
