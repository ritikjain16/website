import { connect } from 'react-redux'
import { filterKey } from '../../../../utils/data-utils'
import BatchesTab from './BatchesTab'

const mapStateToProps = (state) => ({
  campaignBatches: filterKey(state.data.getIn(['batches', 'data']), 'campaignBatches'),
  campaignBatchesFetching: state.data.getIn(['campaignBatches', 'fetchStatus', 'campaignBatches']),
  batchesMeta: state.data.getIn(['campaignBatchesMeta', 'data', 'count'])
})


export default connect(mapStateToProps)(BatchesTab)
