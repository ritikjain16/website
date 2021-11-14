import { get } from 'lodash'
import React from 'react'
import { fetchTopic, fetchBadges } from '../../actions/courseMaker'
import { BadgeTable, BadgeModal } from './components'
import { BadgeContainer, StyledButton } from './SessionBadge.style'

class SessionBadge extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topicId: props.match.params.topicId,
      openModal: false,
      operation: '',
      editData: null
    }
  }
  componentDidMount = async () => {
    const { topicId } = this.state
    if (!this.props.topicTitle) {
      fetchTopic(topicId)
    }
    await fetchBadges(topicId)
  }
  openAddModal = () => {
    this.setState({
      openModal: true,
      operation: 'add'
    })
  }
  openEditModal = (data) => {
    this.setState({
      openModal: true,
      operation: 'edit',
      editData: data
    })
  }
  getBadgesForTopic = () => {
    const { badges } = this.props
    const { topicId } = this.state
    let newBadges = badges && badges.toJS() && badges.toJS().length > 0 ? badges.toJS() : []
    newBadges = newBadges.filter(badge => get(badge, 'topic.id') === topicId)
    return newBadges
  }
  render() {
    const { badgesMeta, badgeFetchingStatus } = this.props
    const { topicId, openModal, operation, editData } = this.state
    return (
      <>
        <BadgeContainer justify='flex-end'>
          <BadgeModal
            openModal={openModal}
            operation={operation}
            editData={editData}
            topicId={topicId}
            badgesData={this.getBadgesForTopic()}
            closeModal={() => this.setState({ openModal: false, operation: null, editData: null })}
            {...this.props}
          />
          <h4>Total Badges: {badgesMeta || 0}</h4>
          <StyledButton
            icon='plus'
            id='add-btn'
            onClick={this.openAddModal}
            disabled={badgeFetchingStatus && get(badgeFetchingStatus.toJS(), 'loading')}
          >
            ADD BADGE
          </StyledButton>
        </BadgeContainer>
        <BadgeTable
          topicId={topicId}
          openEditModal={this.openEditModal}
          {...this.props}
        />
      </>
    )
  }
}

export default SessionBadge
