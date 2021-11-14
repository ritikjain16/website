import React from 'react'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
import CourseRow from './CourseRow'
import MainTable from '../../../components/MainTable'
/** @returns the course body */
const CoursesBody = (props) => {
  const { courses, isFetchingCourse, hasCoursesFetched, fetchingCoursesError } = props.courses
  // shows loader when courses is being fetched
  if (isFetchingCourse) {
    const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
    return <div style={{ padding: '10px' }}>{loadingIcon}</div>
  }
  if (hasCoursesFetched && courses.length === 0) {
    return (
      <MainTable.EmptyTable>
        Add courses by clicking the add button
      </MainTable.EmptyTable>
    )
  }
  if (hasCoursesFetched && fetchingCoursesError !== null) {
    return (
      <MainTable.EmptyTable>
        {fetchingCoursesError}
      </MainTable.EmptyTable>
    )
  }
  return (
    courses.map(course => <CourseRow key={course.id} course={course} {...props} />)
  )
}
CoursesBody.propTypes = {
  courses: PropTypes.shape({
    courses: PropTypes.arrayOf(PropTypes.shape({})),
    isFetchingCourse: PropTypes.bool
  }).isRequired
}
export default CoursesBody
