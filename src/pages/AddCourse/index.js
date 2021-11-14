import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import AddCourse from './AddCourse'

const AddCourseNav = withNav(AddCourse)({
  title: 'Add Course',
  activeNavItem: 'Add Course',
  showCourseMakerNavigation: true,
})

const mapStateToProps = state => ({
  coursesData: state.data.getIn(['course', 'data']),
  coursesMeta: state.data.getIn(['coursesMeta', 'data', 'count']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),
  courseAddStatus: state.data.getIn(['courses', 'addStatus', 'courses']),
  courseAddFailure: state.data.getIn(['errors', 'courses/add']),
  courseUpdateStatus: state.data.getIn(['courses', 'updateStatus', 'courses']),
  courseUpdateFailure: state.data.getIn(['errors', 'courses/update']),
  courseDeleteStatus: state.data.getIn(['courses', 'deleteStatus', 'courses']),
  courseDeleteFailure: state.data.getIn(['errors', 'courses/delete'])
})

const AddCourseNavWithExtraProps = injectProps({
  notification,
})(AddCourseNav)

export default connect(mapStateToProps)(withRouter(AddCourseNavWithExtraProps))
