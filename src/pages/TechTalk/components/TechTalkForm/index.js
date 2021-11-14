import { connect } from 'react-redux'
import TechTalkFormWrapper from './TechTalkFormWrapper'
import {
  addMessageUI,
  deleteMessageUI
} from '../../../../actions/message'

const mapStateToProps = state => state.messageUI
const mapDispatchToProps = dispatch => ({
  addMessageUI: message => dispatch(addMessageUI(message)),
  deleteMessageUI: id => dispatch(deleteMessageUI(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(TechTalkFormWrapper)
