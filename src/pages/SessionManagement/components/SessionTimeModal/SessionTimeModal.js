import React, { Component } from 'react'
import PropTypes from 'prop-types'
import MainModal from '../../../../components/MainModal'
import SessionTimeModalStyle from './SessionTimeModal.style'
import getSlotLabel from '../../../../utils/slots/slot-label'
import appConfig from '../../../../config/appConfig'

class SessionTimeModal extends Component {
    renderTimeSlots = () => appConfig.timeSlots.map((slotNumber, index) => {
      let isFirst = false
      let isLeft = false
      let slotStatus = false
      if (index === 0 || index === 1 || index === 2 || index === 3) {
        isFirst = true
      }
      if (index % 4 === 0) {
        isLeft = true
      }
      if (this.props.slotStatusArray[appConfig.timeSlots[index]]) {
        slotStatus = true
      }
      return (
        <SessionTimeModalStyle.SlotContainer>
          <SessionTimeModalStyle.Slot
            isFirst={isFirst}
            isLeft={isLeft}
            disabled={!slotStatus}
            selected={slotStatus}
          >
            {`${getSlotLabel(appConfig.timeSlots[index]).startTime}`}
          </SessionTimeModalStyle.Slot>
        </SessionTimeModalStyle.SlotContainer>
      )
    })

    render() {
      const { visible, id, title } = this.props

      return (
        <MainModal
          visible={visible}
          title={title}
          width='700px'
          onCancel={() => this.props.closeSessionTimeModal()}
          maskClosable={false}
          footer={[
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              form={id}
              onClick={this.props.closeSessionTimeModal}
            > OK
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
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  closeSessionTimeModal: PropTypes.func.isRequired,
  slotStatusArray: PropTypes.shape([]).isRequired,
}

export default SessionTimeModal
