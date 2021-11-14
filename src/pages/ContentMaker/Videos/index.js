import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import Videos from './Videos'

const VideosNav = withNav(Videos)({
  title: 'Content Videos',
  activeNavItem: 'Content Videos',
  showContentMakerNavigation: true,
})

const mapStateToProps = state => ({
  videoData: state.data.getIn(['videos', 'data']),
  videosMeta: state.data.getIn(['videosMeta', 'data', 'count']),
  videosFetchingStatus: state.data.getIn(['videos', 'fetchStatus', 'videos']),
  videosUpdateStatus: state.data.getIn(['videos', 'updateStatus', 'videos']),
  videosUpdateFailure: state.data.getIn(['errors', 'videos/update']),
  videoDeleteStatus: state.data.getIn(['videos', 'deleteStatus', 'videos']),
  videoDeleteFailure: state.data.getIn(['errors', 'videos/delete']),
  videoAddStatus: state.data.getIn(['videos', 'addStatus', 'videos']),
  videoAddFailure: state.data.getIn(['errors', 'videos/add']),

  coursesData: state.data.getIn(['course', 'data']),
  coursesFetchStatus: state.data.getIn(['courses', 'fetchStatus', 'courses']),
})

const VideosNavWithExtraProps = injectProps({
  notification,
})(VideosNav)

export default connect(mapStateToProps)(withRouter(VideosNavWithExtraProps))
