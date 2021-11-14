import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import BatchDashboard from './BatchDashboard'
import { filterKey } from '../../../utils/data-utils'

const BatchDashboardNav = withNav(BatchDashboard)({
  title: 'Batch Dashboard',
  activeNavItem: 'Batch Dashboard',
  showUMSAndSMSNavigation: true,
})

const mapStateToProps = (state) => ({
  courses: state.data.getIn(['course', 'data']),
  batchAddedStatus: state.data.getIn(['batch', 'addStatus', 'batches']),
  batchDeleteStatus: state.data.getIn(['batch', 'deleteStatus', 'deleteBatch']),
  batchDeleteFailure: state.data.getIn(['errors', 'batch/delete']),
  batchUpdateStatus: state.data.getIn(['batch', 'updateStatus', 'batches']),
  batchUpdateFailure: state.data.getIn(['errors', 'batch/update']),
  batchAdded: filterKey(state.data.getIn(['batches', 'data']), 'batches'),
  hasBatchFetched: state.data.getIn([
    'batches',
    'fetchStatus',
    'batches',
    'success',
  ]),
  isBatchFetching: state.data.getIn([
    'batches',
    'fetchStatus',
    'batches',
    'loading',
  ]),
  batchAddedFailure: state.data.getIn(['errors', 'batch/add']),
  batchesCount: state.data.getIn(['batchesMeta', 'data', 'count']),
  schools: state.data.getIn(['schools', 'data']),
  topics: state.data.getIn(['topic', 'data']),
  topicFetchingStatus: state.data.getIn(['topics', 'fetchStatus']),
})

const BatchDashboardNavWithExtraProps = injectProps({
  notification,
})(BatchDashboardNav)

export default connect(mapStateToProps)(
  withRouter(BatchDashboardNavWithExtraProps)
)
