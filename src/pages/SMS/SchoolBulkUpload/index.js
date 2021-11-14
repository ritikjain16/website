import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import SchoolBulkUpload from './SchoolBulkUpload'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'

const SchoolBulkUploadNav = withNav(SchoolBulkUpload)({
  title: 'School Bulk Upload',
  activeNavItem: 'School Bulk Upload',
  showSMSNavigation: true,
})

const mapStateToProps = state => ({
  users: state.data.getIn(['user', 'data']),
  schools: state.data.getIn(['schools', 'data']),
  studentsOfSchool: state.data.getIn(['studentsOfSchool', 'data']),
  studentsOfSchoolCount: state.data.getIn(['studentsOfSchoolCount', 'data', 'count']),
  studentsOfSchoolFetch: state.data.getIn(['studentsOfSchool', 'fetchStatus', 'studentsOfSchool'])
})

const SchoolBulkUploadNavWithExtraProps = injectProps({
  notification
})(SchoolBulkUploadNav)

export default connect(mapStateToProps)(withRouter(SchoolBulkUploadNavWithExtraProps))
