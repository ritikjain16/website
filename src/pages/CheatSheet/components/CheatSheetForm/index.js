import { connect } from 'react-redux'
import CheatSheetFormWrapper from './CheatSheetFormWrapper'
import { addCheatSheetContent, editCheatSheetContent } from '../../../../actions/cheatSheet'

const mapStateToProps = (state) => ({
  ...state.stickerEmoji,
})

const mapDispatchToProps = dispatch => ({
  addCheatSheetContent: (input) => dispatch(addCheatSheetContent(input)),
  editCheatSheetContent: (input) => dispatch(editCheatSheetContent(input))
})

export default connect(mapStateToProps, mapDispatchToProps)(CheatSheetFormWrapper)
