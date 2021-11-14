import { connect } from 'react-redux'
import Device from './Device'

const mapStateToProps = state => ({
  ...state.messageUI,
  ...state.learningObjectives,
  ...state.stickerEmoji
})


export default connect(mapStateToProps)(Device)
