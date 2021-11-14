import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { notification } from 'antd'
import TabularStats from './TabularStats'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'


const StatsNav = withNav(TabularStats)({
  title: 'Stats Table',
  activeNavItem: 'Stats Table',
  showUMSNavigation: true,
  showCountryDropdown: true
})

const mapStateToProps = (state) => ({
  sessionReportsFetchStatus: state.data.getIn(['sessionReports', 'fetchStatus']),
  sessionReports: state.data.getIn(['sessionReports', 'data'])
})
const StatsNavWithExtraProps = injectProps({
  notification
})(StatsNav)

export default connect(mapStateToProps)(withRouter(StatsNavWithExtraProps))
