import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../components/withNav'
// import { filterKey } from "../../utils/data-utils";
import injectProps from '../../components/injectProps'
import MentorReport from './MentorReport'

const MentorReportNav = withNav(MentorReport)({
  title: 'Mentor Report',
  activeNavItem: 'Mentor Report',
  showUMSNavigation: true,
})

const mapStateToProps = (state) => ({
  mentorReports: state.data.getIn(['mentorReportData', 'data']),
  hasReportsFetched: state.data.getIn([
    'mentorReports',
    'fetchStatus',
    'mentorReports',
    'success',
  ]),
  isReportsFetching: state.data.getIn([
    'mentorReports',
    'fetchStatus',
    'mentorReports',
    'loading',
  ]),
  usersData: state.data.getIn([
    'usersData',
    'data',
    'users'
  ]),
  isUsersFetching: state.data.getIn([
    'usersData'
  ]),
  reportsCount: state.data.getIn([
    'mentorReportsMeta', 'data', 'count'
  ])
})

const MentorReportNavWithExtraProps = injectProps({
  notification,
})(MentorReportNav)

export default connect(mapStateToProps)(
  withRouter(MentorReportNavWithExtraProps)
)
