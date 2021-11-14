import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import React from 'react'
import { fetchCheatSheet } from '../../actions/cheatSheet'
import fetchContentTags from '../../actions/contentTags/fetchContentTags'
import TopicNav from '../../components/TopicNav'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'
import CheatSheetStyle from './CheetSheet.style'
import CheatBox from './components/CheatBox'
import CheatSheetTab from './components/CheatSheetTabs'
import CheatSheetModal from './components/CheetSheetModal'

class CheatSheet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleModal: null,
      topicId: this.props.match.params.topicId,
      cheats: [],
      selectedCheat: '',
      operation: '',
      editData: null,
      tags: []
    }
  }
  componentDidMount = async () => {
    await fetchCheatSheet(this.state.topicId)
    this.props.fetchTopics(this.state.topicId)
    await fetchContentTags(`{ and: [
        {status:published}
      ]
    }`, 0, 0)
    if (this.state.cheats.length > 0 && !this.state.selectedCheat) {
      this.setState({
        selectedCheat: this.state.cheats[0].id
      })
    }
    if (this.props.stickerEmojis.length === 0) {
      this.props.fetchStickerEmoji()
    }
  }
  fetchSingleCheatSheet = async (id) => {
    this.setState({
      selectedCheat: id
    })
  }
  componentDidUpdate = (prevProps, prevState) => {
    const { isCheatsFetching, isCheatsFetched,
      isContentTagsFetching, isContentTagsFetched, conceptUpdateStatus,
      conceptUpdateFailure, cheatSheetDeleteStatus, cheatSheetDeleteFailure } = this.props
    if (!isCheatsFetching && isCheatsFetched) {
      if (
        get(prevProps, 'cheatSheets') !== get(this.props, 'cheatSheets')
      ) {
        this.setState({
          cheats: this.props.cheatSheets ? sortBy(this.props.cheatSheets.toJS(), 'createdAt') : []
        }, () => this.setState({
          selectedCheat: this.state.cheats.length > 0 ? this.state.cheats[0].id : ''
        }))
      }
    }
    if (conceptUpdateStatus && !get(conceptUpdateStatus.toJS(), 'loading')
      && get(conceptUpdateStatus.toJS(), 'success') &&
      (prevProps.conceptUpdateStatus !== conceptUpdateStatus)) {
      notification.success({
        message: 'CheatSheet updated successfully'
      })
      if (
        get(prevProps, 'cheatSheets') !== get(this.props, 'cheatSheets')
      ) {
        this.setState({
          cheats: this.props.cheatSheets ? sortBy(this.props.cheatSheets.toJS(), 'createdAt') : []
        }, () => this.setState({ selectedCheat: prevState.selectedCheat }))
      }
    } else if (conceptUpdateStatus && !get(conceptUpdateStatus.toJS(), 'loading')
      && get(conceptUpdateStatus.toJS(), 'failure') &&
      (prevProps.conceptUpdateFailure !== conceptUpdateFailure)) {
      if (conceptUpdateFailure && conceptUpdateFailure.toJS().length > 0) {
        if (get(get(conceptUpdateFailure.toJS()[0], 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          notification.error({
            message: 'Concept with similar title already exist.'
          })
        } else {
          notification.error({
            message: get(get(conceptUpdateFailure.toJS()[0], 'error').errors[0], 'message')
          })
        }
      }
    }
    if (cheatSheetDeleteStatus && !get(cheatSheetDeleteStatus.toJS(), 'loading')
      && get(cheatSheetDeleteStatus.toJS(), 'success') &&
      (prevProps.cheatSheetDeleteStatus !== cheatSheetDeleteStatus)) {
      notification.success({
        message: 'CheatSheet deleted successfully'
      })
    } else if (cheatSheetDeleteStatus && !get(cheatSheetDeleteStatus.toJS(), 'loading')
      && get(cheatSheetDeleteStatus.toJS(), 'failure') &&
      (prevProps.cheatSheetDeleteFailure !== cheatSheetDeleteFailure)) {
      if (cheatSheetDeleteFailure && cheatSheetDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(cheatSheetDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (!isContentTagsFetching && isContentTagsFetched) {
      if (get(prevProps, 'contentTags') !== get(this.props, 'contentTags')) {
        this.setState({
          tags: this.props.contentTags ? this.props.contentTags.toJS() : []
        })
      }
    }
  }
  createCheatsBlock = () => (
    <CheatSheetStyle.TopContainer style={{ flex: '1', marginRight: '15px', padding: 0, justifyContent: 'center' }} >
      {
        this.state.cheats.map(({ id, title, status, order, description }) => (
          <CheatBox
            key={id}
            type={id === this.state.selectedCheat ? 'primary' : 'default'}
            onClick={() => this.fetchSingleCheatSheet(id)}
            id={id}
            description={description}
            status={status}
            onEditClick={(data) => this.setState({ visibleModal: true, editData: data, operation: 'edit' })}
            title={title}
            order={order}
            topicId={this.state.topicId}
            fetchCheatSheet={fetchCheatSheet}
            {...this.props}
          />
        ))
      }
    </CheatSheetStyle.TopContainer>
  )
  onCloseModal = () => {
    if (this.state.editData) {
      this.setState({
        editData: null,
        visibleModal: null,
        operation: ''
      })
    }
    this.setState({
      visibleModal: null,
      operation: ''
    })
  }
  render() {
    const { visibleModal, topicId, selectedCheat, editData, cheats, tags, operation } = this.state
    return (
      <>
        <TopicNav activeTab={topicJourneyRoutes.cheatsheet} />
        <CheatSheetStyle.TopContainer>
          {this.createCheatsBlock()}
          <CheatSheetModal
            visible={visibleModal}
            cheats={cheats}
            closeModal={this.onCloseModal}
            topicId={topicId}
            editData={editData}
            fetchCheatSheet={fetchCheatSheet}
            operation={operation}
            {...this.props}
          />
          <CheatSheetStyle.StyledButton
            type='primary'
            icon='plus'
            onClick={() => this.setState({ visibleModal: true, operation: 'add' })}
          >
            Add Concept
          </CheatSheetStyle.StyledButton>
        </CheatSheetStyle.TopContainer>
        {selectedCheat && cheats.length > 0 && (
          <CheatSheetTab
            stickerEmojis={this.props.stickerEmojis}
            topicId={topicId}
            selectedCheat={selectedCheat}
            cheats={cheats}
            tags={tags}
            {...this.props}
          />
        )}
      </>
    )
  }
}

export default CheatSheet
