import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { get, sortBy } from 'lodash'
import { List } from 'immutable'
import { notification } from 'antd'
import withNav from '../../../components/withNav'
import injectProps from '../../../components/injectProps'
import Comic from './Comic'
import { CONTENT_MAKER } from '../../../constants/roles'


const ComicNav = withNav(Comic)({
  title: 'Comic',
  activeNavItem: 'Learning Objective',
  titlePath: 'topicTitle',
  showContentMakerNavigation: true,
  blockType: CONTENT_MAKER,
  breadCrumbPath: [{ name: 'Learning Objective', route: '/content-learningObjective' },
    { path: 'topicTitle', route: '/content-learningObjective' }, { name: 'Comic', route: '/comic/' }]
})

const setLearningObjectives = (state, props) =>
  sortBy(state.data.getIn(['learningObjectives', 'data']).toJS(), 'order').find(learningObjective => learningObjective.id === props.match.params.learningObjectiveId)

// .filter(comic => get(comic, 'learningObjectives', [])
// .map(loId => loId).includes(props.match.params.learningObjectiveId))
const getComicForLo = (state, props) =>
  List(state.data.getIn(['comicStrips', 'data'], List([])).toJS().filter(comic => get(comic, 'learningObjectives', []).map(loId => loId.id).includes(props.match.params.learningObjectiveId)))
const mapStateToProps = (state, props) => ({
  topicTitle: setLearningObjectives(state, props) ? get(setLearningObjectives(state, props), 'title') : '',
  comicStrips: state.data.getIn(['comicStrips', 'data'], List([])) ? getComicForLo(state, props) : List([]),
  comicStripsFetchingStatus: state.data.getIn(['comicStrips', 'fetchStatus', 'comicStrips']),
  comicStripsAddStatus: state.data.getIn(['comicStrips', 'addStatus', 'comicStrips']),
  comicStripsAddFailure: state.data.getIn(['errors', 'comicStrips/add']),
  comicStripsUpdateStatus: state.data.getIn(['comicStrips', 'updateStatus', 'comicStrips']),
  comicStripsUpdateFailure: state.data.getIn(['errors', 'comicStrips/update']),
})

const ComicNavWithExtraProps = injectProps({
  notification,
})(ComicNav)

export default connect(mapStateToProps)(withRouter(ComicNavWithExtraProps))
