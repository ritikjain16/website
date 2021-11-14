import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import StudentJourney from './StudentJourney'

const StudentJourneyNav = withNav(StudentJourney)({
  title: 'Student\'s Journey',
  showUMSNavigation: true,
})

const mapStateToProps = (state) => ({
  studentsJourney: state.data.getIn(['studentsJourney', 'data']),
  isStudentJourneyFetching: state.data.getIn(['studentsJourney',
    'fetchStatus',
    'studentsJourney', 'loading']),
  hasStudentJourneyFetched: state.data.getIn(['studentsJourney',
    'fetchStatus',
    'studentsJourney', 'success']),
  sessions: state.data.getIn(['studentsSessions', 'data']),
  updatePlanLoading: state.data.getIn(['userPaymentPlan', 'updateStatus',
    'updateUserPaymentPlan', 'loading']),
  updatePlanSuccess: state.data.getIn(['userPaymentPlan', 'updateStatus',
    'updateUserPaymentPlan', 'success']),
  studentReport: state.data.getIn(['studentReport', 'data']),
  studentReportFetchStatus: state.data.getIn(['studentReport', 'fetchStatus', 'studentReport'])
})

const StudentJourneyWithExtraProps = injectProps({
  notification,
})(StudentJourneyNav)

export default connect(mapStateToProps)(
  withRouter(StudentJourneyWithExtraProps)
)
