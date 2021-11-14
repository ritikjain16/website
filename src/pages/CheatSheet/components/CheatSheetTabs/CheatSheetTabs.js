/* eslint max-len: 0 */
import React from 'react'
import { sortBy } from 'lodash'
import { message } from 'antd'
import Main from './CheatSheetTabs.style'
import SplitScreen from '../SplitScreen/SplitScreen'
import CheatSheetForm from '../CheatSheetForm'
import { fetchCheatSheetContent, editCheatSheetContents } from '../../../../actions/cheatSheet'
import ContentTags from '../ContentTags'

class CheatSheetTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: null,
      addedTags: null,
      description: ''
    }
  }
  fetchCheatSheetContents = async (id) => {
    await fetchCheatSheetContent(id)
    const content = this.props.cheatSheet && this.props.cheatSheet.toJS().content
    const addedTags = this.props.cheatSheet && this.props.cheatSheet.toJS().tags
    this.setState({
      content,
      addedTags
    })
  }
  componentDidMount = () => {
    const { cheats, selectedCheat } = this.props
    if (cheats.length !== 0) {
      if (selectedCheat) {
        this.fetchCheatSheetContents(selectedCheat)
      } else {
        this.fetchCheatSheetContents(cheats[0].id)
      }
    }
  }
  componentDidUpdate = (prevProps) => {
    const { selectedCheat, cheatSheet } = this.props
    if (prevProps.selectedCheat !== selectedCheat && selectedCheat) {
      this.fetchCheatSheetContents(selectedCheat)
    }
    if (prevProps.cheatSheet !== cheatSheet) {
      this.setState({
        content: this.props.cheatSheet && this.props.cheatSheet.toJS().content,
        addedTags: this.props.cheatSheet && this.props.cheatSheet.toJS().tags,
        description: this.props.cheatSheet && this.props.cheatSheet.toJS().description,
      })
    }
  }
  addCheatSheetContentToContents = (cnt, type) => {
    if (type) {
      this.setState({
        addedTags: [...this.state.addedTags, cnt]
      })
    } else {
      this.setState({ content: [...this.state.content, cnt] })
    }
  }
  editCheatSheetContentFromContents = (cnt) => {
    const exist = this.state.content.find(({ id }) => id === cnt.id)
    if (exist) {
      const newContent = this.state.content.filter((c) => exist.id !== c.id)
      this.setState({ content: [...newContent, cnt] })
    }
  }
  deleteCheatSheetContentFromContents = (cnt, type) => {
    if (type) {
      this.setState({
        addedTags: this.state.addedTags.filter(({ id }) => id !== cnt.id)
      })
    } else {
      this.setState({
        content: this.state.content.filter(({ id }) => id !== cnt.id)
      })
    }
  }
  editCheatSheetContentsOrder = async (input) => {
    const hideLoading = message.loading('Shuffling Messages', 0)
    const { updateCheatSheetContents: data } = await editCheatSheetContents(input)
    if (data && data.length) {
      hideLoading()
      message.success('Contents reordered')
      this.setState({ content: data })
    } else {
      hideLoading()
      message.error('Unexpected error')
    }
  }
  render() {
    const { topicId, stickerEmojis, selectedCheat, cheats, tags } = this.props
    const { content, addedTags, description } = this.state
    return (
      <Main>
        <SplitScreen {...this.props} mobileBreak={717}>
          <CheatSheetForm
            stickerEmojis={stickerEmojis}
            selectedCheat={selectedCheat}
            topicId={topicId}
            cheats={cheats}
            content={sortBy(content || [], 'order')}
            fetchCheatSheetContents={this.fetchCheatSheetContents}
            addCheatSheetContentToContents={this.addCheatSheetContentToContents}
            deleteCheatSheetContentFromContents={this.deleteCheatSheetContentFromContents}
            editCheatSheetContentFromContents={this.editCheatSheetContentFromContents}
            editCheatSheetContentsOrder={this.editCheatSheetContentsOrder}
            description={description}
            {...this.props}
          />
          <ContentTags
            tags={tags}
            addedTags={addedTags}
            selectedCheat={selectedCheat}
            topicId={topicId}
            cheats={cheats}
            fetchCheatSheetContents={this.fetchCheatSheetContents}
            addCheatSheetContentToContents={this.addCheatSheetContentToContents}
            deleteCheatSheetContentFromContents={this.deleteCheatSheetContentFromContents}
            {...this.props}
          />
        </SplitScreen>
      </Main>
    )
  }
}

export default CheatSheetTab
