import { connect } from 'react-redux'
import { addMessage, deleteMessage, editMessage, editMessages } from '../../../../../actions/message'
import TechTalkFormWrapper from './TechTalkFormWrapper'

const mapStateToProps = (state) => ({
  stickerEmojis: state.data.getIn(['stickerEmojis', 'data']),
  messageAddingStatus: state.data.getIn(['messages', 'addStatus', 'messages'])
})

const mapDispatchToProps = dispatch => ({
  addMessage: data => dispatch(addMessage(data)),
  deleteMessage: id => dispatch(deleteMessage(id)),
  editMessage: data => dispatch(editMessage(data)),
  editMessages: messages => dispatch(editMessages(messages)),
})

export default connect(mapStateToProps, mapDispatchToProps)(TechTalkFormWrapper)

