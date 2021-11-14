import { connect } from 'react-redux'
import Chapters from './Chapters'
import withNav from '../../components/withNav'
import { fetchChapters, addChapter, deleteChapter, editChapter, removeThumbnailChapter, removeCourseChapter } from '../../actions/chapters'
import { fetchCourses } from '../../actions/Courses'

const ChaptersWithNav = withNav(Chapters)({
  title: 'Chapters',
  activeNavItem: 'Chapters',
  showCMSNavigation: true,
})

const mapStateToProps = state => ({
  courses: state.course.courses,
  hasCoursesFetched: state.course.hasCoursesFetched,
  ...state.chapters,
  chaptersCount: state.chapters.chapters.length,
})

const mapDispatchToProps = dispatch => ({
  fetchCourses: () => dispatch(fetchCourses()),
  fetchChapters: () => dispatch(fetchChapters()),
  addChapter: data => dispatch(addChapter(data)),
  deleteChapter: id => dispatch(deleteChapter(id)),
  editChapter: data => dispatch(editChapter(data)),
  removeThumbnailChapter: (chapterId, thumbnailId) =>
    dispatch(removeThumbnailChapter(chapterId, thumbnailId)),
  removeCourseChapter: (chapterId, courseId) =>
    dispatch(removeCourseChapter(chapterId, courseId))
})

export default connect(mapStateToProps, mapDispatchToProps)(ChaptersWithNav)
