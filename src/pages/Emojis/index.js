import { connect } from 'react-redux'
import Emojis from './Emojis'
import { fetchStickerEmoji, addStickerEmoji, deleteStickerEmoji, editStickerEmoji } from '../../actions/stickerEmoji'

const mapStateToProps = state => ({
  stickerEmoji: state.stickerEmoji
})

const mapDispatchToProps = dispatch => ({
  fetchStickerEmoji: () => dispatch(fetchStickerEmoji()),
  addStickerEmoji: (input) =>
    dispatch(addStickerEmoji(input)),
  deleteStickerEmoji: id => dispatch(deleteStickerEmoji(id)),
  editStickerEmoji: input => dispatch(editStickerEmoji(input))
})
export default connect(mapStateToProps, mapDispatchToProps)(Emojis)
