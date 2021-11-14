import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import MainModal from '../../../../../components/MainModal'
import SessionTimeModalStyle from './SessionTimeModal.style'
import getSlotLabel from '../../../../../utils/slots/slot-label'
import appConfig from '../../../../../config/appConfig'

class SessionTimeModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slotsSelected: []
    }
  }

  resetSlots = () => {
    this.setState(
      { slotsSelected: [] },
      () => this.props.closeSessionTimeModal(this.state.slotsSelected)
    )
  }

  handleSlotClick = (slotNumber) => {
    const curSelectedSlots = this.state.slotsSelected
    if (curSelectedSlots.includes(slotNumber)) {
      curSelectedSlots.splice(curSelectedSlots.indexOf(slotNumber), 1)
    } else {
      curSelectedSlots.push(slotNumber)
    }
    this.setState({
      slotsSelected: curSelectedSlots
    })
  }

  isSlotSelected = (slotNumber) => this.state.slotsSelected.includes(slotNumber)

  renderTimeSlots = () => appConfig.timeSlots.map((slotNumber, index) => {
    let isFirst = false
    let isLeft = false
    if (index === 0 || index === 1 || index === 2 || index === 3) {
      isFirst = true
    }
    if (index % 4 === 0) {
      isLeft = true
    }
    return (
      <SessionTimeModalStyle.SlotContainer>
        <SessionTimeModalStyle.Slot
          isFirst={isFirst}
          isLeft={isLeft}
          selected={this.isSlotSelected(slotNumber)}
          onClick={() => this.handleSlotClick(slotNumber)}
        >
          {`${getSlotLabel(slotNumber).startTime}`}
        </SessionTimeModalStyle.Slot>
      </SessionTimeModalStyle.SlotContainer>
    )
  })

  render() {
    const { visible, title, closeSessionTimeModal } = this.props

    return (
      <MainModal
        visible={visible}
        title={title}
        width='700px'
        onCancel={this.resetSlots}
        maskClosable={false}
        footer={[
          <Button onClick={this.resetSlots}>CLEAR ALL</Button>,
          <MainModal.SaveButton
            onClick={() => closeSessionTimeModal(this.state.slotsSelected)}
          > FILTER
          </MainModal.SaveButton>
        ]}
      >
        <SessionTimeModalStyle>
          {this.renderTimeSlots()}
        </SessionTimeModalStyle>
      </MainModal>
    )
  }
}

SessionTimeModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  closeSessionTimeModal: PropTypes.func.isRequired,
  slotStatusArray: PropTypes.shape([]).isRequired,
}

export default SessionTimeModal
