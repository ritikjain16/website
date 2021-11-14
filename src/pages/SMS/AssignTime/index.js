import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { filterKey } from '../../../utils/data-utils'
import AssginTimeTableNav from './AssignTime'

const mapStateToProps = (state) => ({
  batchSessionsData: filterKey(
    state.data.getIn([
      'batchSessions',
      'data'
    ]), 'batchSessions'
  ),
  isFetchingBatchSessions: state.data.getIn([
    'batchSessions',
    'fetchStatus',
    'batchSessions',
    'loading'
  ]),
  hasFetchedBatchSessions: state.data.getIn([
    'batchSessions',
    'fetchStatus',
    'batchSessions',
    'success'
  ]),
  isAddingBatchSession: state.data.getIn([
    'batchSessions',
    'addStatus',
    'batchSessions',
    'loading'
  ]),
  hasAddedBatchSession: state.data.getIn([
    'batchSessions',
    'addStatus',
    'batchSessions',
    'success'
  ]),
  addFailure: state.data.getIn([
    'batchSessions',
    'addStatus',
    'batchSessions',
    'failure'
  ]),
  addErrors: state.data.toJS().errors['batchSessions/add'],
  updateErrors: state.data.toJS().errors['batchSessions/update'],
  deleteErrors: state.data.toJS().errors['batchSessions/delete'],
  deleteFailure: state.data.getIn([
    'batchSessions',
    'deleteStatus',
    'batchSessions',
    'failure'
  ]),
  updateFailure: state.data.getIn([
    'batchSessions',
    'updateStatus',
    'batchSessions',
    'failure'
  ]),
  fetchErrors: state.data.toJS().errors['batchSessions/fetch'],
  isUpdatingBatchSession: state.data.getIn([
    'batchSessions',
    'updateStatus',
    'batchSessions',
    'loading'
  ]),
  hasUpdatedBatchSession: state.data.getIn([
    'batchSessions',
    'updateStatus',
    'batchSessions',
    'success'
  ]),
  isDeletingBatchSession: state.data.getIn([
    'batchSessions',
    'deleteStatus',
    'batchSessions',
    'loading'
  ]),
  hasDeletedBatchSession: state.data.getIn([
    'batchSessions',
    'deleteStatus',
    'batchSessions',
    'success'
  ]),
  batches: state.data.getIn([
    'batches',
    'data'
  ]),
  isFetchingBatches: state.data.getIn([
    'batches',
    'fetchStatus',
    'batches',
    'loading'
  ]),
  hasFetchedBatches: state.data.getIn([
    'batches',
    'fetchStatus',
    'batches',
    'success'
  ]),
  topic: filterKey(state.data.getIn([
    'topic',
    'data'
  ]), 'batchSessions'),
  topicOrder: filterKey(state.data.getIn([
    'topic',
    'data'
  ]), 'lastSessionOfBatch'),
  isFetchingLastSessionOfBatch: state.data.getIn([
    'lastSessionOfBatch',
    'fetchStatus',
    'lastSessionOfBatch',
    'loading'
  ]),
  hasFetchedLastSessionOfBatch: state.data.getIn([
    'lastSessionOfBatch',
    'fetchStatus',
    'lastSessionOfBatch',
    'success'
  ]),
  topicId: filterKey(state.data.getIn([
    'topic',
    'data'
  ]), 'topicId'),
  isFetchingTopicId: state.data.getIn([
    'topicId',
    'fetchStatus',
    'topicId',
    'loading'
  ]),
  previousslotsinfo: filterKey(state.data.getIn([
    'session',
    'data'
  ]), 'checkMentorSession'),
  isFetchingCheckMentorSession: state.data.getIn([
    'checkMentorSession',
    'fetchStatus',
    'checkMentorSession',
    'loading'
  ]),
  fetchedCheckMentorSession: state.data.getIn([
    'checkMentorSession',
    'fetchStatus',
    'checkMentorSession',
    'success'
  ]),
  batchSessionsCount: state.data.getIn([
    'batchSessionsMeta',
    'data',
    'count'
  ]),
  fetchedBatchSessionsCount: state.data.getIn([
    'batchSessionsMeta',
    'fetchStatus',
    'batchSessionsMeta',
    'success'
  ]),
  mentors: state.data.getIn([
    'user',
    'data'
  ]),
  isFetchingMentors: state.data.getIn([
    'users',
    'fetchStatus',
    'users',
    'loading'
  ]),
  hasFetchedMentors: state.data.getIn([
    'users',
    'fetchStatus',
    'users',
    'success'
  ]),
  mentorSessionId: filterKey(state.data.getIn([
    'session',
    'data'
  ]), 'mentorsession'),
  isAddingMentorSession: state.data.getIn([
    'mentorsession',
    'addStatus',
    'mentorsession',
    'loading'
  ]),
  hasAddedMentorSession: state.data.getIn([
    'mentorsession',
    'addStatus',
    'mentorsession',
    'success'
  ]),
  mentorSessionAddFailure: state.data.getIn([
    'mentorsession',
    'addStatus',
    'mentorsession',
    'failure'
  ]),
  mentorSessionAddError: state.data.toJS().errors['mentorsession/add'],
  mentorSessionUpdateFailure: state.data.getIn([
    'mentorsession',
    'updateStatus',
    'mentorsession',
    'failure'
  ]),
  mentorSessionUpdateError: state.data.toJS().errors['mentorsession/update'],
  mentorOfBatch: filterKey(state.data.getIn([
    'batches',
    'data'
  ]), 'batchMentor'),
  isFetchingMentorOfBatch: state.data.getIn([
    'batches',
    'fetchStatus',
    'batchMentor',
    'loading'
  ]),
  hasFetchedMentorOfBatch: state.data.getIn([
    'batches',
    'fetchStatus',
    'batchMentor',
    'success'
  ]),
  courses: state.data.getIn(['course', 'data']),
  courseFetchingStatus: state.data.getIn(['courses', 'fetchStatus', 'courses'])
})

export default connect(mapStateToProps)(withRouter(AssginTimeTableNav))
