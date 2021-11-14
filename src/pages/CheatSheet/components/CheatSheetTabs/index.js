import { connect } from 'react-redux'
import addCheatSheetContent from '../../../../actions/cheatSheet/addCheatSheetContent'
import CheatSheetTab from './CheatSheetTabs'

const mapStateToProps = (state) => ({
  cheatSheet: state.data.getIn(['cheatSheet', 'data']),
  ...state.cheatSheet,
})

const mapDispatchToProps = dispatch => ({
  addCheatSheetContent: (input) => dispatch(addCheatSheetContent(input)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CheatSheetTab)
