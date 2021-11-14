import { get } from 'lodash'
import React from 'react'
import { fetchCourseCount, fetchCourses } from '../../actions/courseMaker'
import {
  StyledButton, TopContainer
} from './AddCourse.styles'
import { CourseModal, CourseTable } from './components'

class AddCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openModal: null,
      operation: '',
      editData: null,
      tableLoading: true
    }
  }
  componentDidMount = async () => {
    await fetchCourses()
    fetchCourseCount()
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
  searchByFilter = async (shouldFetch = true) => {
    this.setState({
      tableLoading: false
    })
    if (shouldFetch) await fetchCourses()
    await fetchCourseCount()
    this.setState({
      tableLoading: true
    })
  }
  render() {
    const { openModal, operation, editData, tableLoading } = this.state
    const { coursesMeta, coursesFetchStatus } = this.props
    return (
      <>
        <TopContainer justify='flex-end'>
          <CourseModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            searchByFilter={this.searchByFilter}
            closeModal={() => this.setState({ openModal: false, operation: null, editData: null })}
            {...this.props}
          />
          <TopContainer>
            <h4>Total Course: {coursesMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              onClick={this.openAddModal}
              disabled={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
            >
              ADD COURSE
            </StyledButton>
          </TopContainer>
        </TopContainer>
        <CourseTable
          openEditModal={this.openEditModal}
          searchByFilter={this.searchByFilter}
          tableLoading={tableLoading}
          {...this.props}
        />
      </>
    )
  }
}

export default AddCourse
