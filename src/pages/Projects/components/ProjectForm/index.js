import { connect } from 'react-redux'
import { addProjectContent, editProjectContent } from '../../../../actions/projects'
import ProjectContentFormWrapper from './ProjectFormWrapper'

const mapStateToProps = (state) => ({
  ...state.stickerEmoji,
})

const mapDispatchToProps = dispatch => ({
  addProjectContent: (input) => dispatch(addProjectContent(input)),
  editProjectContent: (input) => dispatch(editProjectContent(input))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContentFormWrapper)
