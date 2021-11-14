import React from 'react'
import PropTypes from 'prop-types'
import CourseStyle from './Courses.style'
import CoursesTable from './CoursesTable'
import CoursesModal from './CoursesModal'
import { getOrdersInUse, getOrderAutoComplete, getDataById } from '../../utils/data-utils'
import getFullPath from '../../utils/getFullPath'
import fileBucketObject from '../../constants/fileInput'
import toastrMessage from '../../utils/messages'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../constants/questionBank'

class Courses extends React.Component {
  componentDidMount() {
    // fetch the courses when page mounts
    const { courses: { courses } } = this.props
    if (courses.length === 0) {
      this.props.fetchCourses()
    }
  }
  state={
    addModalVisible: false,
    editModalVisible: false,
    editingCourseId: ''
  }
  componentDidUpdate(prevProps, prevState) {
    // styling to the add course button when loading
    const addCourseElement = document.getElementById('add-btn')
    if (prevProps.courses.isFetchingCourse === false &&
      this.props.courses.isFetchingCourse === true) {
      addCourseElement.disabled = true
      addCourseElement.style.opacity = 0.7
    } else {
      addCourseElement.disabled = false
      addCourseElement.style.opacity = 1
    }
    if (prevState.addModalVisible === true && this.state.addModalVisible === false) {
      addCourseElement.blur()
    }
    const { isAddingCourse, isEditingCourse, isDeletingCourse,
      addingCourseError, hasDeletedCourse,
      deletingCourseError, editingCourseError,
      hasAddedCourse, hasEditedCourse
    } = this.props.courses

    /* Adding notifications */
    if (isAddingCourse) {
      toastrMessage(isAddingCourse, prevProps.courses.isAddingCourse, 'loading', 'Adding Course')
    }
    if (!prevProps.courses.hasAddedCourse && hasAddedCourse) {
      toastrMessage(hasAddedCourse, prevProps.courses.hasAddedCourse, 'success', 'Added Course')
    }
    toastrMessage(addingCourseError, prevProps.courses.addingCourseError, 'error', addingCourseError)
    /* Editing notifications */
    if (isEditingCourse && !prevProps.courses.isEditingCourse) {
      toastrMessage(isEditingCourse, prevProps.courses.isEditingCourse, 'loading', 'Updating Course')
    }
    if (hasEditedCourse && !prevProps.courses.hasEditedCourse) {
      toastrMessage(hasEditedCourse, prevProps.courses.hasEditedCourse, 'success', 'Updated Course')
    }
    toastrMessage(editingCourseError, prevProps.courses.editingCourseError, 'error', editingCourseError)
    /* Deleting notifications */
    if (isDeletingCourse) {
      toastrMessage(isDeletingCourse, prevProps.courses.isDeletingCourse, 'loading', 'Deleting Course')
    }
    if (hasDeletedCourse && !prevProps.courses.hasDeletedCourse) {
      toastrMessage(hasDeletedCourse, prevProps.courses.hasDeletedCourse, 'success', 'Deleted Course')
    }
    toastrMessage(deletingCourseError, prevProps.courses.deletingCourseError, 'error', deletingCourseError)
  }
  openAddModal=() => {
    this.setState({
      addModalVisible: true
    })
  }
  closeAddModal=() => {
    this.setState({
      addModalVisible: false
    })
  }
  openEditModal=id => () => {
    this.setState({
      editModalVisible: true,
      editingCourseId: id
    })
  }
  closeEditModal=() => {
    this.setState({
      editModalVisible: false,
      editingCourseId: ''
    })
  }
  // adds course
  addCourse=async (id, input, file) => {
    const fileBucket = fileBucketObject.python
    await this.props.addCourse({ ...input, file, fileBucket })
  }
  // updates course
  editCourse=async (id, input, file, isThumbnailPresent) => {
    const { courses: { courses } } = this.props
    const fileBucket = fileBucketObject.python
    const defaultData = getDataById(courses, id)
    // removes the thumbnail from course
    if (defaultData.thumbnail !== null && isThumbnailPresent === false) {
      await this.props.removeThumbnail(defaultData.id, defaultData.thumbnail.id)
    }
    // update course
    await this.props.editCourse({ id, ...input, file, fileBucket })
  }
  // deletes course
  deleteCourse= id => async () => {
    await this.props.deleteCourse(id)
  }
  // publishes course
  publishCourse=id => async () => {
    await this.props.editCourse({ id, status: PUBLISHED_STATUS })
  }
  // unpublishes course
  unpublishCourse=id => async () => {
    await this.props.editCourse({ id, status: UNPUBLISHED_STATUS })
  }
  render() {
    const { courses: { courses } } = this.props
    const ordersInUse = getOrdersInUse(courses)
    // defaultData by id
    const defaultData = getDataById(courses, this.state.editingCourseId)
    return (
      <div>
        <CourseStyle.TopContainer>
          <div style={{ marginTop: '5px', marginRight: '10px' }}>Total Courses:{courses.length}</div>
          <CourseStyle.StyledButton
            type='primary'
            icon='plus'
            id='add-btn'
            disabled={this.props.courses.isFetchingCourse}
            onClick={this.openAddModal}
          >
            ADD COURSE
          </CourseStyle.StyledButton>
        </CourseStyle.TopContainer>
        <CoursesTable
          courses={this.props.courses}
          openEditModal={this.openEditModal}
          deleteCourse={this.deleteCourse}
          publishCourse={this.publishCourse}
          unpublishCourse={this.unpublishCourse}
        />
        <CoursesModal
          id='Add Modal'
          title='Add Course'
          visible={this.state.addModalVisible}
          closeModal={this.closeAddModal}
          ordersInUse={ordersInUse}
          defaultData={{
            order: getOrderAutoComplete(ordersInUse),
            description: '',
            thumbnail: null
          }}
          onSave={this.addCourse}
        />
        <CoursesModal
          id='Edit Modal'
          title='Edit Course'
          visible={this.state.editModalVisible}
          closeModal={this.closeEditModal}
          ordersInUse={ordersInUse.filter(order => defaultData.order !== order)}
          defaultData={{
            id: defaultData.id,
            order: defaultData.order,
            category: defaultData.category,
            title: defaultData.title,
            description: defaultData.description,
            thumbnail: defaultData.thumbnail && getFullPath(defaultData.thumbnail.signedUri)
          }}
          onSave={this.editCourse}
        />
      </div>
    )
  }
}
Courses.propTypes = {
  fetchCourses: PropTypes.func.isRequired,
  addCourse: PropTypes.func.isRequired,
  deleteCourse: PropTypes.func.isRequired,
  editCourse: PropTypes.func.isRequired,
  removeThumbnail: PropTypes.func.isRequired,
  courses: PropTypes.shape({
    isFetchingCourse: PropTypes.bool,
    isAddingCourse: PropTypes.bool,
    isDeletingCourse: PropTypes.bool,
    isEditingCourse: PropTypes.bool,
    addingCourseError: PropTypes.string,
    hasDeletedCourse: PropTypes.bool,
    deletingCourseError: PropTypes.string,
    editingCourseError: PropTypes.string,
    hasAddedCourse: PropTypes.bool,
    hasEditedCourse: PropTypes.bool,
    courses: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  }).isRequired
}
export default Courses
