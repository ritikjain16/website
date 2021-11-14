import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import SalesExecMentor from './SalesExecMentor'
import withNav from '../../components/withNav'
import injectProps from '../../components/injectProps'

const SalesExecMentorNav = withNav(SalesExecMentor)({
  title: 'Sales Executive - Mentor',
  activeNavItem: 'Sales Executive Mentor',
  showUMSNavigation: true,
})

const mapStateToProps = state => ({
  fetchedMentors: state.data.getIn([
    'salesExecutiveProfiles',
    'data'
  ]),
  hasSalesExecMentorFetched: state.data.getIn([
    'salesExecutiveMentors',
    'fetchStatus',
    'salesExecutiveMentor',
    'success'
  ]),
  isFetchingSalesExecMentor: state.data.getIn([
    'salesExecutiveMentors',
    'fetchStatus',
    'salesExecutiveMentor',
    'loading'
  ]),
  isDeletingMentor: state.data.getIn([
    'mentors',
    'deleteStatus',
    'deleteMentor',
    'loading'
  ]),
  hasDeletedMentor: state.data.getIn([
    'mentors',
    'deleteStatus',
    'deleteMentor',
    'success'
  ]),
  isMentorStatusUpdating: state.data.getIn([
    'userProfile',
    'updateStatus',
    'mentorProfileUpdate',
    'loading'
  ]),
  hasMentorStatusUpdated: state.data.getIn([
    'userProfile',
    'updateStatus',
    'mentorProfileUpdate',
    'success'
  ]),
  isMentorGroupStatusUpdating: state.data.getIn([
    'mentorProfiles',
    'updateStatus',
    'mentorProfiles',
    'loading'
  ]),
  hasMentorGroupStatusUpdated: state.data.getIn([
    'mentorProfiles',
    'updateStatus',
    'mentorProfiles',
    'success'
  ]),
  fetchedSalesExecCount: state.data.getIn([
    'salesExecutiveProfilesMeta',
    'data',
  ]),
  isFetchingSalesExecCount: state.data.getIn([
    'salesExecMeta',
    'fetchStatus',
    'salesExecMeta',
    'loading'
  ]),
  hasFetchedSalesExecCount: state.data.getIn([
    'salesExecMeta',
    'fetchStatus',
    'salesExecMeta',
    'success'
  ]),
  fetchedAllMentors: state.data.getIn([
    'user',
    'data'
  ]),
  isFetchingAllMentors: state.data.getIn([
    'users',
    'fetchStatus',
    'users',
    'loading'
  ]),
  hasFetchedAllMentors: state.data.getIn([
    'users',
    'fetchStatus',
    'users',
    'success'
  ]),
  isAddingMentor: state.data.getIn([
    'mentors',
    'updateStatus',
    'addMentor',
    'loading'
  ]),
  hasAddedMentor: state.data.getIn([
    'mentors',
    'updateStatus',
    'addMentor',
    'success'
  ]),
  isUpdatingMentor: state.data.getIn(['mentors', 'updateStatus', 'updateMentor', 'loading']),
  hasUpdatedMentor: state.data.getIn(['mentors', 'updateStatus', 'updateMentor', 'success']),
})

const SalesExecMentorNavWithExtraProps = injectProps({
  notification
})(SalesExecMentorNav)

export default connect(mapStateToProps)(withRouter(SalesExecMentorNavWithExtraProps))
