import { connect } from 'react-redux'
import { List, Map } from 'immutable'
import BatchUserMapping from './BatchUserMapping'
import { filterKey, sort } from '../../utils/data-utils'


const mapStateToProps = (state) => ({
  batches: sort.ascend(filterKey(
    state.data.getIn(['batches', 'data'], List([])),
    'fetchBatchInfo'
  ), ['createdAt']),
  batchesSearched: filterKey(
    state.data.getIn(['batches', 'data'], List([])),
    'fetchBatches'
  ),
  isBatchSearchFetching: state.data.getIn(['batch', 'fetchStatus', 'fetchBatches', 'loading']),
  isFetchingBatches: state.data.getIn([
    'fetchBatchInfo',
    'fetchStatus',
    'fetchBatchInfo',
    'loading',
  ]),
  hasBatchesFetched: state.data.getIn([
    'fetchBatchInfo',
    'fetchStatus',
    'fetchBatchInfo',
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
  isFetchingMentors: state.data.getIn([
    'mentorProfiles',
    'fetchStatus',
    'mentors',
    'loading'
  ]),
  hasFetchedMentors: state.data.getIn([
    'mentorProfiles',
    'fetchStatus',
    'mentors',
    'success'
  ]),
})

export default connect(mapStateToProps)(BatchUserMapping)
