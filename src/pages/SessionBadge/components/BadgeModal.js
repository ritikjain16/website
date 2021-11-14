import { message } from 'antd'
import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../components/MainModal'
import { AddBadgeForm, EditBadgeForm } from './BadgeForms'
import {
  addBadge, addImageToBadge, fetchBadges, updateBadge
} from '../../../actions/courseMaker'
import { getOrdersInUse } from '../../../utils/data-utils'

class BadgeModal extends React.Component {
  state = {
    name: '',
    type: '',
    description: '',
    unlockPoint: ''
  }

  componentDidUpdate = (prevProps) => {
    const { badgeAddStatus, badgeAddFailure } = this.props
    if (badgeAddStatus && !get(badgeAddStatus.toJS(), 'loading')
      && get(badgeAddStatus.toJS(), 'failure') &&
      (prevProps.badgeAddFailure !== badgeAddFailure)) {
      if (badgeAddFailure && badgeAddFailure.toJS().length > 0) {
        if (get(get(badgeAddFailure.toJS()[0], 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          message.error('Video with similar title already exist.')
        } else {
          message.error(get(get(badgeAddFailure.toJS()[0], 'error').errors[0], 'message').split(':')[0])
        }
      }
    }
  }
  handleAddBadge = async (value, { setErrors }, activeImage, inActiveImage) => {
    const { closeModal, topicId, badgesData } = this.props
    const { type, order, description, unlockPoint } = value
    const orderArray = []
    badgesData.forEach(badge => {
      if (get(badge, 'type') === type) {
        orderArray.push(badge)
      }
    })
    const orders = getOrdersInUse(orderArray)
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use for this type' })
    } else {
      await addBadge({
        input: { order, type, description, unlockPoint },
        topicId
      }).then(async res => {
        if (res && res.addBadge && res.addBadge.id && (activeImage || inActiveImage)) {
          const hideLoadingMessage = message.loading('Adding Badge...', 0)
          if (activeImage) {
            await addImageToBadge({
              badgeId: res.addBadge.id,
              file: activeImage,
              typeField: 'activeImage'
            })
          }
          if (inActiveImage) {
            await addImageToBadge({
              badgeId: res.addBadge.id,
              file: inActiveImage,
              typeField: 'inactiveImage'
            })
          }
          await fetchBadges(topicId)
          hideLoadingMessage()
        }
        if (res && res.addBadge && res.addBadge.id) {
          closeModal()
          message.success('Badge added successfully')
        }
      })
    }
  }

  handleEditBadge = async (value, { setErrors }, activeImage, inActiveImage) => {
    const { closeModal, topicId, badgesData, editData } = this.props
    const { type, order, description, unlockPoint } = value
    const orderArray = []
    badgesData.forEach(badge => {
      if (get(badge, 'type') === type && get(badge, 'order') !== get(editData, 'order')) {
        orderArray.push(badge)
      }
    })
    const orders = getOrdersInUse(orderArray)
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use for this type' })
    } else {
      await updateBadge({
        input: { type, order, description: description || '', unlockPoint },
        badgeId: get(editData, 'id')
      }).then(async res => {
        if (res && res.updateBadge && res.updateBadge.id && (activeImage || inActiveImage)) {
          const hideLoadingMessage = message.loading('Updating Badge...', 0)
          if (activeImage) {
            await addImageToBadge({
              badgeId: res.updateBadge.id,
              file: activeImage,
              typeField: 'activeImage',
              prevFileId: get(editData, 'activeImage.id')
            })
          }
          if (inActiveImage) {
            await addImageToBadge({
              badgeId: res.updateBadge.id,
              file: inActiveImage,
              typeField: 'inactiveImage',
              prevFileId: get(editData, 'inactiveImage.id')
            })
          }
          await fetchBadges(topicId)
          hideLoadingMessage()
        }
        if (res && res.updateBadge && res.updateBadge.id) {
          closeModal()
          message.success('Badge updated successfully')
        }
      })
    }
  }
  render() {
    const { openModal, closeModal, operation, editData, badgesData } = this.props
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Badge' : 'Edit Badge'}
        onCancel={closeModal}
        maskClosable={false}
        width='750px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          operation === 'add' ? (
            <AddBadgeForm
              addFormData={{ ...this.state, order: 0 }}
              handleAddBadge={this.handleAddBadge}
              badgesData={badgesData}
            />
          ) : (
            <EditBadgeForm
              editFormData={editData}
              handleEditBadge={this.handleEditBadge}
              badgesData={badgesData}
            />
          )
        }
      </MainModal>
    )
  }
}

export default BadgeModal
