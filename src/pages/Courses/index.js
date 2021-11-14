import { connect } from 'react-redux'
import Courses from './Courses'
import withNav from '../../components/withNav'
import { fetchCourses, addCourse, updateCourse, deleteCourse, removeThumbnail } from '../../actions/Courses'

const mapStateToProps = state => ({
  courses: state.course
})
const mapDispatchToProps = dispatch => ({
  fetchCourses: () => dispatch(fetchCourses()),
  addCourse: (input) =>
    dispatch(addCourse(input)),
  deleteCourse: (id) => dispatch(deleteCourse(id)),
  editCourse: (input) =>
    dispatch(updateCourse(input)),
  removeThumbnail: (courseId, thumbnailId) => dispatch(removeThumbnail(courseId, thumbnailId))
})
export default connect(mapStateToProps, mapDispatchToProps)(withNav(Courses)({
  activeNavItem: 'Courses', title: 'Courses', showCMSNavigation: true,
}))
