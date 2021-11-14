import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { message } from 'antd'
import { get, sortBy } from 'lodash'
import Main from './Chapters.style'
import ChaptersTable from './components/ChaptersTable'
import ChaptersModal from './components/ChaptersModal/ChaptersModal'
import getFullPath from '../../utils/getFullPath'
import { getOrdersInUse, getOrderAutoComplete, getDataById, filterItems, getDataByProp } from '../../utils/data-utils'

class Chapters extends Component {
  static propTypes = {
    fetchChapters: PropTypes.func.isRequired,
    chaptersCount: PropTypes.number.isRequired,
    chapters: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetchingChapter: PropTypes.bool.isRequired,
    hasChaptersFetched: PropTypes.bool.isRequired,
    fetchingChaptersError: PropTypes.bool,
    addChapter: PropTypes.func.isRequired,
    editChapter: PropTypes.func.isRequired,
    deleteChapter: PropTypes.func.isRequired,
    deletingChapterId: PropTypes.string.isRequired,
    removeThumbnailChapter: PropTypes.func.isRequired,
    deletingChapterError: PropTypes.string.isRequired,
    hasCoursesFetched: PropTypes.bool.isRequired,
    fetchCourses: PropTypes.func.isRequired,
    courses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired
    })).isRequired,
    removeCourseChapter: PropTypes.func.isRequired
  }
  state = {
    shouldAddChapterVisible: false,
    shouldEditChapterVisible: false,
    editModalId: '',
    currentCourse: ''
  }

  componentDidMount() {
    const { hasChaptersFetched, fetchChapters, hasCoursesFetched, fetchCourses } = this.props

    if (!hasChaptersFetched) {
      fetchChapters()
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

  openAddChapter = () => {
    this.setState({ shouldAddChapterVisible: true })
  }

  closeAddChapter = () => {
    this.setState({ shouldAddChapterVisible: false })
  }

  openEditChapter = id => () => {
    this.setState({
      editModalId: id,
      shouldEditChapterVisible: true
    })
  }

  closeEditChapter = () => {
    this.setState({ shouldEditChapterVisible: false })
  }

  onAddChapterSave = async data => {
    const { addChapter } = this.props
    const hideLoadingMessage = message.loading('Adding Chapter...', 0)
    this.closeAddChapter()
    const addedChapter = await addChapter(data)
    hideLoadingMessage()
    if (addedChapter && addedChapter.id) {
      message.success(`Added Chapter "${addedChapter.title}"`)
    }
  }

  onEditChapterSave = async ({ isThumbnail, thumbnailUrl, courseMapping, ...rest }) => {
    const { editChapter, removeThumbnailChapter, chapters, removeCourseChapter } = this.props
    // get the default course connect ids's
    const defaultCourseConnectId = getDataById(chapters, rest.id).courses.map(course => course.id)
    // courseMappingToRemove contains id's of courses which are to be removed from chapter
    const courseMappingToRemove = defaultCourseConnectId.filter(
      courseId => !courseMapping.includes(courseId))
    // courseMappingToAdd contains id's of courses which are to be mapped with chapter
    const courseMappingToAdd = courseMapping.filter(
      courseId => !defaultCourseConnectId.includes(courseId))
    // calling chain of call's of removeFromCourseChapter
    await Promise.all(courseMappingToRemove.map(
      courseId => removeCourseChapter(rest.id, courseId)))
    const shouldRemoveThumbnail = !isThumbnail && thumbnailUrl
    const hideLoadingMessage = message.loading('Editing Chapter...')
    const promisesToCall = shouldRemoveThumbnail
      ? [editChapter({ ...rest, courseMapping: courseMappingToAdd, }),
        removeThumbnailChapter(rest.id, getDataById(chapters, rest.id).thumbnail.id)]
      : [editChapter({ ...rest, courseMapping: courseMappingToAdd })]
    this.closeEditChapter()
    const result = await Promise.all(promisesToCall)
    hideLoadingMessage()
    const editedChapter = result[0]
    if (editedChapter && editedChapter.id) {
      message.success(`Edited Chapter "${editedChapter.title}"`)
    }
  }

  deleteChapter = id => async () => {
    const { deleteChapter } = this.props
    const hideLoadingMessage = message.loading('Deleting...', 0)
    const deletedChapter = await deleteChapter(id)
    hideLoadingMessage()
    if (deletedChapter && deletedChapter.id) {
      message.success(`Deleted "${deletedChapter.title}"`)
    } else {
      message.error(this.props.deletingChapterError)
    }
  }

  publishChapter = id => async () => {
    const { editChapter, chapters } = this.props
    const chapter = getDataById(chapters, id)
    const { title, order } = chapter
    let { description } = chapter
    const hideLoadingMessage = message.loading('Publishing...', 0)
    if (!description) {
      description = ''
    }
    const editedChapter = await editChapter({
      id,
      title,
      description,
      order,
      status: 'published'
    })
    if (editedChapter && editedChapter.status === 'published') {
      hideLoadingMessage()
      message.success(`Published "${editedChapter.title}"`)
    }
  }

  unpublishChapter = id => async () => {
    const { editChapter, chapters } = this.props
    const chapter = getDataById(chapters, id)
    const { title, order } = chapter
    let { description } = chapter
    const hideLoadingMessage = message.loading('Unpublishing...', 0)
    if (!description) {
      description = ''
    }
    const editedChapter = await editChapter({
      id,
      title,
      description,
      order,
      status: 'unpublished'
    })
    if (editedChapter && editedChapter.status === 'unpublished') {
      hideLoadingMessage()
      message.success(`Unpublished "${editedChapter.title}"`)
    }
  }

  render() {
    const {
      chapters,
      isFetchingChapter,
      hasChaptersFetched,
      fetchingChaptersError,
      deletingChapterId,
      courses
    } = this.props
    const chaptersByCourse = getDataByProp(chapters, 'courses[0].id', this.state.currentCourse)

    const { editModalId } = this.state
    const ordersInUse = getOrdersInUse(chaptersByCourse)
    const defaultOrder = getOrderAutoComplete(ordersInUse)
    const defaultDataInEditChapter = getDataById(chapters, editModalId)
    return (
      <div>
        <Main.TopContainer style={{ justifyContent: 'space-between' }}>
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
          <Main.TopContainer style={{ marginBottom: 0 }}>
            <Main.ChaptersCount>Total Chapters: {get(getDataById(courses, this.state.currentCourse), 'chaptersMeta.count')}</Main.ChaptersCount>
            <Main.Button
              type='primary'
              icon='plus'
              onClick={this.openAddChapter}
              disabled={!hasChaptersFetched}
            > ADD CHAPTERS
            </Main.Button>
          </Main.TopContainer>
        </Main.TopContainer>
        <ChaptersTable
          currentCourse={this.state.currentCourse}
          chapters={sortBy(chapters, 'order')}
          coursesInState={this.props.courses}
          isFetchingChapters={isFetchingChapter}
          hasChaptersFetched={hasChaptersFetched}
          fetchingChaptersError={fetchingChaptersError}
          deleteChapter={this.deleteChapter}
          deletingChapterId={deletingChapterId}
          publishChapter={this.publishChapter}
          unpublishChapter={this.unpublishChapter}
          openEditChapter={this.openEditChapter}
        />
        <ChaptersModal
          id='addChapter'
          title='Add new Chapter'
          courses={this.props.courses}
          onSave={this.onAddChapterSave}
          visible={this.state.shouldAddChapterVisible}
          closeModal={this.closeAddChapter}
          ordersInUse={ordersInUse}
          defaultValues={{
            title: '',
            description: '',
            order: defaultOrder,
            thumbnailUrl: ''
          }}
        />
        <ChaptersModal
          id='editChapter'
          title='Edit Chapter'
          courses={this.props.courses}
          onSave={this.onEditChapterSave}
          visible={this.state.shouldEditChapterVisible}
          closeModal={this.closeEditChapter}
          ordersInUse={
            filterItems(ordersInUse, [defaultDataInEditChapter.order])
          }
          defaultValues={{
            id: defaultDataInEditChapter.id,
            title: defaultDataInEditChapter.title,
            description: defaultDataInEditChapter.description,
            order: defaultDataInEditChapter.order,
            courseMapping: defaultDataInEditChapter.courses &&
            defaultDataInEditChapter.courses.filter(defaultCourse => {
              for (let count = 0; count < courses.length; count += 1) {
                if (courses[count].id === defaultCourse.id) {
                  return true
                }
              }
              return false
            }).map(course => course.id),
            thumbnailUrl: getFullPath(
               get(defaultDataInEditChapter, 'thumbnail.signedUri', null)
             )
          }}
        />
      </div>
    )
  }
}
Chapters.defaultProps = {
  fetchingChaptersError: null
}
export default Chapters
