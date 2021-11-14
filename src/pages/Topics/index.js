import { connect } from 'react-redux'
import Topics from './Topics'
import withNav from '../../components/withNav'
import { fetchChapters } from '../../actions/chapters'
import { fetchTopics, deleteTopic, addTopic, editTopic, removeThumbnailTopic } from '../../actions/topics'
import { fetchCourses } from '../../actions/Courses'
import removeTopicSmallThumbnail from '../../actions/topics/removeTopicSmallThumbnail'

const TopicsWithNav = withNav(Topics)({
  title: 'Topics',
  activeNavItem: 'Topics',
  showCMSNavigation: true,
  breadCrumbPath: [{ name: 'Topics', route: '/topics' }]
})

const mapStateToProps = state => ({
  ...state.topics,
  courses: state.course.courses,
  hasCoursesFetched: state.course.hasCoursesFetched,
  hasChaptersFetched: state.chapters.hasChaptersFetched,
  chapters: state.chapters.chapters,
  topicsCount: state.topics.topics.length
})

const mapDispatchToProps = dispatch => ({
  fetchCourses: () => dispatch(fetchCourses()),
  fetchChapters: () => dispatch(fetchChapters()),
  fetchTopics: () => dispatch(fetchTopics()),
  deleteTopic: id => dispatch(deleteTopic(id)),
  addTopic: data => dispatch(addTopic(data)),
  editTopic: data => dispatch(editTopic(data)),
  removeThumbnailTopic: (topicId, thumbnailId) =>
    dispatch(removeThumbnailTopic(topicId, thumbnailId)),
  removeTopicSmallThumbnail: (topicId, thumbnailId) =>
    dispatch(removeTopicSmallThumbnail(topicId, thumbnailId))
})
export default connect(mapStateToProps, mapDispatchToProps)(TopicsWithNav)
