import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import { filterKey } from '../../utils/data-utils'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'
import ClassProgress from './ClassProgress'

const ClassProgressNav = withNav(ClassProgress)({
  title: 'Class Progress',
  activeNavItem: 'Class Progress',
  showUMSNavigation: true
})

const mapStateToProps = (state) => ({
  classProgress: state.data.getIn(['classProgress', 'data']),
  isClassProgressFetching: state.data.getIn(['salesOperation',
    'fetchStatus',
    'classProgress', 'loading']),
  hasClassProgressFetched: state.data.getIn(['salesOperation',
    'fetchStatus',
    'classProgress', 'success']),
  salesCount: state.data.getIn(['salesOperationsMeta', 'data', 'count']),
  classProgressData: state.data.getIn(['classProgressData', 'data']),
  classProgressAll: state.data.getIn(['classProgressAll', 'data']),
  isClassProgressAllFetching: state.data.getIn(['salesOperation',
    'fetchStatus',
    'classProgressAll', 'loading']),
  hasClassProgressAllFetched: state.data.getIn(['salesOperation',
    'fetchStatus',
    'classProgressAll', 'success']),
  studentReport: filterKey(state.data.getIn(['salesOperation', 'data']), 'studentReport'),
  studentReportFetchStatus: state.data.getIn(['studentReport', 'fetchStatus', 'studentReport'])
})

const ClassProgressWithExtraProps = injectProps({
  notification,
})(ClassProgressNav)

export default connect(mapStateToProps)(
  withRouter(ClassProgressWithExtraProps)
)
