import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import ContentProject from './ContentProject'
import { filterKey } from '../../../utils/data-utils'

const ContentProjectNav = withNav(ContentProject)({
  title: 'Block based Project',
  activeNavItem: 'Block based Project',
  showContentMakerNavigation: true,
})

const mapStateToProps = state => ({
  blockBasedProjects: filterKey(state.data.getIn(['blockBasedProjects', 'data']), 'project'),
  blockBasedProjectsMeta: state.data.getIn(['blockBasedProjectsMeta', 'data', 'count']),
  projectsFetchingStatus: state.data.getIn(['blockBasedProjects', 'fetchStatus', 'project']),
  projectAddStatus: state.data.getIn(['blockBasedProjects', 'addStatus', 'project']),
  projectAddFailure: state.data.getIn(['errors', 'blockBasedProjects/add']),
  projectUpdateStatus: state.data.getIn(['blockBasedProjects', 'updateStatus', 'project']),
  projectUpdateFailure: state.data.getIn(['errors', 'blockBasedProjects/update']),
  projectDeleteStatus: state.data.getIn(['blockBasedProjects', 'deleteStatus', 'project']),
  projectDeleteFailure: state.data.getIn(['errors', 'blockBasedProjects/delete']),

  coursesData: state.data.getIn(['course', 'data']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),
})

const ContentProjectNavWithExtraProps = injectProps({
  notification,
})(ContentProjectNav)

export default connect(mapStateToProps)(withRouter(ContentProjectNavWithExtraProps))
