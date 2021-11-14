import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import TechTalk from './TechTalk'
import withNav from '../../components/withNav'
import {
  fetchMessages,
  addMessage,
  editMessage,
  editMessages,
  removeImageMessage,
  deleteMessage,
  addMessageUI
} from '../../actions/message'
import { fetchLearningObjectives } from '../../actions/LearningObjective'
import { selectLearningObjectiveId } from '../../actions/message/messageUI'
import {
  fetchTopics,
} from '../../actions/episode'
import getTopicTitle from '../../utils/getTopicTitle'
import { fetchStickerEmoji } from '../../actions/stickerEmoji'

const TechTalksWithNav = withNav(TechTalk)({
  titlePath: 'topicTitle',
  activeNavItem: 'Topics',
  noPadding: true,
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' },
    { path: 'topicTitle', route: '/learning-objectives/' },
    { name: 'Tek Talk', route: '/tech-talk/' }]
})

const mapStateToProps = (state, props) => ({
  ...state.messages,
  ...state.messageUI,
  ...state.learningObjectives,
  ...state.stickerEmoji,
  topicTitle: getTopicTitle(state, props),
})

const mapDispatchToProps = dispatch => ({
  addMessageUI: message => dispatch(addMessageUI(message)),
  fetchMessages: id => dispatch(fetchMessages(id)),
  fetchTopics: (topicId) => dispatch(fetchTopics(topicId)),
  addMessage: data => dispatch(addMessage(data)),
  editMessage: data => dispatch(editMessage(data)),
  fetchLearningObjectives: topicId => dispatch(fetchLearningObjectives(topicId)),
  removeImageMessage: (messageId, imageId) => dispatch(removeImageMessage(messageId, imageId)),
  deleteMessage: id => dispatch(deleteMessage(id)),
  selectLearningObjectiveId: id => dispatch(selectLearningObjectiveId(id)),
  editMessages: messages => dispatch(editMessages(messages)),
  fetchStickerEmoji: () => dispatch(fetchStickerEmoji())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TechTalksWithNav))
