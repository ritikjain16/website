import { connect } from 'react-redux'
import { List, Map } from 'immutable'
import BatchUserMapping from './BatchUserMapping'
import { filterKey, sort } from '../../../utils/data-utils'
import { SMS } from '../../../constants/roles'


const mapStateToProps = (state) => ({
  batches: sort.ascend(filterKey(
    state.data.getIn(['batches', 'data'], List([])),
    'fetchBatchInfo'
  ), ['createdAt']),
  batchesSearched: filterKey(
    state.data.getIn(['batches', 'data'], List([])),
    `fetchBatches/${SMS}`
  ),
  isBatchSearchFetching: state.data.getIn(['batch', 'fetchStatus', `fetchBatches/${SMS}`, 'loading']),
  isFetchingBatches: state.data.getIn([
    'batches',
    'fetchStatus',
    'batches',
    'loading',
  ]),
  hasBatchesFetched: state.data.getIn([
    'batches',
    'fetchStatus',
    'batches',
    'success',
  ]),
  batchesMeta: state.data.getIn(['batchesMeta', 'data'], Map({})),
  isDeletingStudent: state.data.getIn([
    'users',
    'deleteStatus',
    'deleteStudent',
    'loading'
  ]),
  hasDeletedStudent: state.data.getIn([
    'users',
    'deleteStatus',
    'deleteStudent',
    'success'
  ]),
  students: filterKey(state.data.getIn([
    'studentSearchData',
    'data'
  ]), 'fetchStudent'),
  isFetchingStudents: state.data.getIn([
    'users',
    'fetchStatus',
    'fetchStudent',
    'loading'
  ]),
  isAddingStudent: state.data.getIn([
    'users',
    'addStatus',
    'addStudent',
    'loading'
  ]),
  hasAddedStudent: state.data.getIn([
    'users',
    'addStatus',
    'addStudent',
    'success'
  ]),
  mentors: filterKey(state.data.getIn([
    'user',
    'data'
  ]), 'mentors'),
})

export default connect(mapStateToProps)(BatchUserMapping)
