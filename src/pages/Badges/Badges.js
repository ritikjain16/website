import React from 'react'
import PropTypes from 'prop-types'
import BadgeStyle from './Badges.style'
import BadgesTable from './BadgesTable'
import BadgesModal from './BadgesModal'
import { getOrdersInUse, getDataById } from '../../utils/data-utils'
import getFullPath from '../../utils/getFullPath'
import toastrMessage from '../../utils/messages'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../constants/questionBank'
import TopicNav from '../../components/TopicNav'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'

class Badges extends React.Component {
  componentDidMount() {
    // fetch the badges when page mounts
    const { badges: { badges } } = this.props
    if (badges.length === 0) {
      const topicId = this.props.match.params.id
      this.props.fetchBadges(topicId)
    }
  }

  state={
    addModalVisible: false,
    editModalVisible: false,
    editingBadgeId: ''
  }

  componentDidUpdate(prevProps, prevState) {
    // styling to the add Badge button when loading
    const addBadgeElement = document.getElementById('add-btn')

    if (prevProps.badges.isFetchingBadge === false &&
      this.props.badges.isFetchingBadge === true) {
      addBadgeElement.disabled = true
      addBadgeElement.style.opacity = 0.7
    } else {
      addBadgeElement.disabled = false
      addBadgeElement.style.opacity = 1
    }

    if (prevState.addModalVisible === true && this.state.addModalVisible === false) {
      addBadgeElement.blur()
    }

    const { isAddingBadge, isEditingBadge, isDeletingBadge,
      addingBadgeError, hasDeletedBadge,
      deletingBadgeError, editingBadgeError,
      hasAddedBadge, hasEditedBadge
    } = this.props.badges

    /* Adding notifications */
    if (isAddingBadge) {
      toastrMessage(isAddingBadge, prevProps.badges.isAddingBadge, 'loading', 'Adding Badge')
    }
    if (!prevProps.badges.hasAddedBadge && hasAddedBadge) {
      toastrMessage(hasAddedBadge, prevProps.badges.hasAddedBadge, 'success', 'Added Badge')
    }
    toastrMessage(addingBadgeError, prevProps.badges.addingBadgeError, 'error', addingBadgeError)
    /* Editing notifications */
    if (isEditingBadge && !prevProps.badges.isEditingBadge) {
      toastrMessage(isEditingBadge, prevProps.badges.isEditingBadge, 'loading', 'Updating Badge')
    }
    if (hasEditedBadge && !prevProps.badges.hasEditedBadge) {
      toastrMessage(hasEditedBadge, prevProps.badges.hasEditedBadge, 'success', 'Updated Badge')
    }
    toastrMessage(editingBadgeError, prevProps.badges.editingBadgeError, 'error', editingBadgeError)
    /* Deleting notifications */
    if (isDeletingBadge) {
      toastrMessage(isDeletingBadge, prevProps.badges.isDeletingBadge, 'loading', 'Deleting Badge')
    }
    if (hasDeletedBadge && !prevProps.badges.hasDeletedBadge) {
      toastrMessage(hasDeletedBadge, prevProps.badges.hasDeletedBadge, 'success', 'Deleted Badge')
    }
    toastrMessage(deletingBadgeError, prevProps.badges.deletingBadgeError, 'error', deletingBadgeError)
  }

  openAddModal=() => {
    this.setState({
      addModalVisible: true
    })
  }

  closeAddModal=() => {
    this.setState({
      addModalVisible: false
    })
  }

  openEditModal=id => () => {
    this.setState({
      editModalVisible: true,
      editingBadgeId: id
    })
  }

  closeEditModal=() => {
    this.setState({
      editModalVisible: false,
      editingBadgeId: ''
    })
  }

  // adds Badge
  addBadge=async (id, input, files) => {
    const newBadgeInfo = await this.props.addBadge({ topicConnectId: this.props.match.params.id,
      input,
      files })
    return newBadgeInfo
  }

  // updates Badge
  editBadge=async (id, input, files, isThumbnails) => {
    const { badges: { badges } } = this.props
    const defaultData = getDataById(badges, id)
    if (defaultData.inactiveImage != null && isThumbnails[0] === false) {
      await this.props.removeInactiveImage(defaultData.id, defaultData.inactiveImage.id)
    }
    if (defaultData.activeImage != null && isThumbnails[1] === false) {
      await this.props.removeActiveImage(defaultData.id, defaultData.activeImage.id)
    }
    const editedBadgeInfo = await this.props.editBadge({ id, input, files, isThumbnails })
    return editedBadgeInfo
  }

  // deletes Badge
  deleteBadge= id => async () => {
    await this.props.deleteBadge(id)
  }

  // publishes Badge
  publishBadge=id => async () => {
    await this.props.editBadge({ id, input: { status: PUBLISHED_STATUS } })
  }

  // unpublishes Badge
  unpublishBadge=id => async () => {
    await this.props.editBadge({ id, input: { status: UNPUBLISHED_STATUS } })
  }

  render() {
    const { badges: { badges } } = this.props
    const ordersInUse = getOrdersInUse(badges)
    // defaultData by id
    const defaultData = getDataById(badges, this.state.editingBadgeId)
    return (
      <div>
        <TopicNav activeTab={topicJourneyRoutes.badges} />
        <BadgeStyle.TopContainer>
          <div style={{ marginTop: '5px', marginRight: '10px' }}>Total Badges:{badges.length}</div>
          <BadgeStyle.StyledButton
            type='primary'
            icon='plus'
            id='add-btn'
            disabled={this.props.badges.isFetchingBadge}
            onClick={this.openAddModal}
          >
            ADD BADGE
          </BadgeStyle.StyledButton>
        </BadgeStyle.TopContainer>
        <BadgesTable
          badges={this.props.badges}
          openEditModal={this.openEditModal}
          deleteBadge={this.deleteBadge}
          publishBadge={this.publishBadge}
          unpublishBadge={this.unpublishBadge}
        />
        <BadgesModal
          id='Add Modal'
          title='Add Badge'
          visible={this.state.addModalVisible}
          closeModal={this.closeAddModal}
          ordersInUse={ordersInUse}
          badges={badges}
          defaultData={{
            activeImage: null,
            inactiveImage: null,
            description: '',
          }}
          onSave={this.addBadge}
        />
        <BadgesModal
          id='Edit Modal'
          title='Edit Badge'
          visible={this.state.editModalVisible}
          closeModal={this.closeEditModal}
          ordersInUse={ordersInUse.filter(order => defaultData.order !== order)}
          badges={badges}
          defaultData={{
            id: defaultData.id,
            order: defaultData.order,
            name: defaultData.name,
            inactiveImage: defaultData.inactiveImage &&
              getFullPath(defaultData.inactiveImage.uri),
            activeImage: defaultData.activeImage &&
              getFullPath(defaultData.activeImage.uri),
            type: defaultData.type,
            description: defaultData.description,
            unlockPoint: defaultData.unlockPoint
          }}
          onSave={this.editBadge}
        />
      </div>
    )
  }
}

Badges.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired,
  fetchBadges: PropTypes.func.isRequired,
  addBadge: PropTypes.func.isRequired,
  deleteBadge: PropTypes.func.isRequired,
  editBadge: PropTypes.func.isRequired,
  removeInactiveImage: PropTypes.func.isRequired,
  removeActiveImage: PropTypes.func.isRequired,
  badges: PropTypes.shape({
    isFetchingBadge: PropTypes.bool,
    isAddingBadge: PropTypes.bool,
    isDeletingBadge: PropTypes.bool,
    isEditingBadge: PropTypes.bool,
    addingBadgeError: PropTypes.string,
    hasDeletedBadge: PropTypes.bool,
    deletingBadgeError: PropTypes.string,
    editingBadgeError: PropTypes.string,
    hasAddedBadge: PropTypes.bool,
    hasEditedBadge: PropTypes.bool,
    badges: PropTypes.arrayOf(PropTypes.shape({})).isRequired
  }).isRequired
}

export default Badges
