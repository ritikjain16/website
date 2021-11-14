import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Popconfirm } from 'antd'
import { get } from 'lodash'
import withNav from '../../components/withNav'
import EmojiSticker from './Emoji.style'
import EmojiModal from './components/EmojiModal'
import getFullPath from '../../utils/getFullPath'
import { getDataById } from '../../utils/data-utils'


class EmojisScreen extends Component {
  state = {
    shouldAddEmojiVisible: false,
    shouldEditEmojiVisible: false,
    currentEditingEmojiId: null,
    shouldEditStickerVisible: false,
    shouldAddStickerVisible: false,
    currentEditingStickerId: null
  }

  async componentDidMount() {
    await this.props.fetchStickerEmoji()
  }

  closeAddEmoji = () => {
    this.setState({ shouldAddEmojiVisible: false })
  }

  closeAddSticker = () => {
    this.setState({ shouldAddStickerVisible: false })
  }

  closeEditSticker = () => {
    this.setState({ shouldEditStickerVisible: false })
  }

  closeEditEmoji = () => {
    this.setState({ shouldEditEmojiVisible: false })
  }

  openAddEmoji = () => {
    this.setState({ shouldAddEmojiVisible: true })
  }

  openAddSticker = () => {
    this.setState({ shouldAddStickerVisible: true })
  }

  onAddEmojiSave = async data => {
    const { addStickerEmoji } = this.props
    addStickerEmoji({ ...data, type: 'emoji' })
    this.closeAddEmoji()
  }

  onAddStickerSave = async data => {
    const { addStickerEmoji } = this.props
    addStickerEmoji({ ...data, type: 'sticker' })
    this.closeAddSticker()
  }

  onEditEmojiSave = async data => {
    const { editStickerEmoji } = this.props
    const { stickerEmojis } = this.props.stickerEmoji
    const stickerCode = getDataById(stickerEmojis, data.id).code
    editStickerEmoji({ ...data, type: 'emoji', hasCodeChanged: stickerCode !== data.code })
    this.closeEditEmoji()
  }

  onEditStickerSave = async data => {
    const { editStickerEmoji } = this.props
    const { stickerEmojis } = this.props.stickerEmoji
    const stickerCode = getDataById(stickerEmojis, data.id).code
    editStickerEmoji({ ...data, type: 'sticker', hasCodeChanged: stickerCode !== data.code })
    this.closeEditSticker()
  }

  deleteStickerEmoji = id => {
    this.props.deleteStickerEmoji(id)
  }

  openEditEmoji = id => {
    this.setState({ currentEditingEmojiId: id }, () => {
      this.setState({ shouldEditEmojiVisible: true })
    })
  }

  openEditSticker = id => {
    this.setState({ currentEditingStickerId: id }, () => {
      this.setState({ shouldEditStickerVisible: true })
    })
  }

  render() {
    const hasFetched = this.props.stickerEmoji.hasStickeremojisFetched
    const { stickerEmojis } = this.props.stickerEmoji
    const emojis = stickerEmojis.filter(emoji => emoji.type === 'emoji')
    const stickers = stickerEmojis.filter(sticker => sticker.type === 'sticker')
    return (
      <EmojiSticker>
        <EmojiSticker.Emoji>
          <EmojiSticker.SpaceBetweenRow>
            <EmojiSticker.Title>Emojis</EmojiSticker.Title>
            <EmojiSticker.Button type='primary' icon='plus' onClick={this.openAddEmoji}>Add Emoji</EmojiSticker.Button>
          </EmojiSticker.SpaceBetweenRow>
          <EmojiSticker.ListView>
            {hasFetched && emojis.map(emoji => (
              <EmojiSticker.ImageContainer key={emoji.id}>
                <img src={getFullPath(get(emoji, 'image.uri', ''))} alt={emoji.code} />
                <EmojiSticker.Label>{emoji.code}</EmojiSticker.Label>
                <EmojiSticker.ActionsContainer>
                  <EmojiSticker.ActionWrapper onClick={() => { this.openEditEmoji(emoji.id) }}>
                    <Icon type='edit' style={{ color: '#4990E2' }} />
                  </EmojiSticker.ActionWrapper>
                  <Popconfirm onConfirm={() => { this.deleteStickerEmoji(emoji.id) }} title='Do you want to delete this sticker?'>
                    <EmojiSticker.ActionWrapper>
                      <Icon type='delete' style={{ color: '#f7412d' }} />
                    </EmojiSticker.ActionWrapper>
                  </Popconfirm>
                </EmojiSticker.ActionsContainer>
              </EmojiSticker.ImageContainer>
            ))}
          </EmojiSticker.ListView>
        </EmojiSticker.Emoji>
        <EmojiSticker.Sticker>
          <EmojiSticker.SpaceBetweenRow>
            <EmojiSticker.Title>Stickers</EmojiSticker.Title>
            <EmojiSticker.Button type='primary' icon='plus' onClick={this.openAddSticker}>Add Sticker</EmojiSticker.Button>
          </EmojiSticker.SpaceBetweenRow>
          <EmojiSticker.ListView>
            {hasFetched && stickers.map(sticker => (
              <EmojiSticker.ImageContainer key={sticker.id}>
                <img src={getFullPath(get(sticker, 'image.uri'))} alt={sticker.code} />
                <EmojiSticker.Label>{sticker.code}</EmojiSticker.Label>
                <EmojiSticker.ActionsContainer>
                  <EmojiSticker.ActionWrapper hoverColor='white' onClick={() => { this.openEditSticker(sticker.id) }}>
                    <Icon type='edit' style={{ color: '#4990E2' }} />
                  </EmojiSticker.ActionWrapper>
                  <Popconfirm onConfirm={() => { this.deleteStickerEmoji(sticker.id) }} title='Do you want to delete this sticker?'>
                    <EmojiSticker.ActionWrapper hoverColor='white'>
                      <Icon type='delete' style={{ color: '#f7412d' }} />
                    </EmojiSticker.ActionWrapper>
                  </Popconfirm>
                </EmojiSticker.ActionsContainer>
              </EmojiSticker.ImageContainer>
            ))}
          </EmojiSticker.ListView>
        </EmojiSticker.Sticker>

        {/* <TopicsModal
          id='addTopic'
          title='Add new Topic'
          onSave={this.onAddTopicSave}
          chapters={chapters}
          topics={topics}
          visible={this.state.shouldAddTopicVisible}
          closeModal={this.closeAddTopic}
          ordersInUse={ordersInUse}
          defaultValues={{
            title: '',
            description: '',
            order: defaultOrder,
            isTrial: false,
            thumbnailUrl: ''
          }}
        /> */}

        <EmojiModal
          id='addEmoji'
          title='Add new Emoji'
          visible={this.state.shouldAddEmojiVisible}
          closeModal={this.closeAddEmoji}
          onSave={this.onAddEmojiSave}
          defaultValues={{
            thumbnailUrl: '',
            code: ''
          }}
        />
        <EmojiModal
          id='addSticker'
          title='Add new Sticker'
          visible={this.state.shouldAddStickerVisible}
          closeModal={this.closeAddSticker}
          onSave={this.onAddStickerSave}
          defaultValues={{
            thumbnailUrl: '',
            code: ''
          }}
        />
        <EmojiModal
          id='editEmoji'
          title='Edit new Emoji'
          visible={this.state.shouldEditEmojiVisible}
          closeModal={this.closeEditEmoji}
          onSave={this.onEditEmojiSave}
          defaultValues={{
            id: get(getDataById(emojis, this.state.currentEditingEmojiId), 'id'),
            thumbnailUrl: getFullPath(
              get(
                getDataById(emojis, this.state.currentEditingEmojiId), 'image.uri'
              )
            ),
            code: get(getDataById(emojis, this.state.currentEditingEmojiId), 'code', '').slice(2).slice(0, -2)
          }}
        />
        <EmojiModal
          id='editSticker'
          title='Edit new Sticker'
          visible={this.state.shouldEditStickerVisible}
          closeModal={this.closeEditSticker}
          onSave={this.onEditStickerSave}
          defaultValues={{
            id: get(getDataById(stickers, this.state.currentEditingStickerId), 'id'),
            thumbnailUrl: getFullPath(
              get(
                getDataById(stickers, this.state.currentEditingStickerId), 'image.uri'
              )
            ),
            code: get(getDataById(stickers, this.state.currentEditingStickerId), 'code', '').slice(2).slice(0, -2)
          }}
        />
      </EmojiSticker>
    )
  }
}

EmojisScreen.propTypes = {
  fetchStickerEmoji: PropTypes.func.isRequired,
  deleteStickerEmoji: PropTypes.func.isRequired,
  editStickerEmoji: PropTypes.func.isRequired,
  addStickerEmoji: PropTypes.func.isRequired,
  stickerEmoji: PropTypes.shape({
    stickerEmojis: PropTypes.arrayOf(PropTypes.shape({})),
    hasStickeremojisFetched: PropTypes.bool.isRequired
  }).isRequired
}

export default withNav(EmojisScreen)({
  title: 'Emojis and Stickers',
  activeNavItem: 'Emojis and Stickers',
  noPadding: true,
  showCMSNavigation: true,
})
