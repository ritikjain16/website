import { message, notification } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { addCheatSheet, updateCheatSheet } from '../../../actions/cheatSheet'
import MainModal from '../../../components/MainModal'
import { UNPUBLISHED_STATUS } from '../../../constants/questionBank'
import { getOrderAutoComplete, getOrdersInUse } from '../../../utils/data-utils'
import AddConceptForm from './ConceptForms/AddConceptForm'
import EditConceptForm from './ConceptForms/EditConceptForm'

class CheatSheetModal extends React.Component {
  state = {
    title: '',
    status: UNPUBLISHED_STATUS,
    description: ''
  }
  handleAddConcept = async (value, { setErrors }) => {
    const { topicId, cheats } = this.props
    const orders = getOrdersInUse(cheats)
    const { title, order, status, description } = value
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await addCheatSheet({
        title,
        order,
        status,
        description
      }, topicId)
    }
  }
  componentDidUpdate = (prevProps) => {
    const { conceptAddStatus, conceptAddFailure, closeModal } = this.props
    if (conceptAddStatus && !get(conceptAddStatus.toJS(), 'loading')
      && get(conceptAddStatus.toJS(), 'success') &&
      (prevProps.conceptAddStatus !== conceptAddStatus)) {
      notification.success({
        message: 'Concept added successfully'
      })
      closeModal()
    } else if (conceptAddStatus && !get(conceptAddStatus.toJS(), 'loading')
      && get(conceptAddStatus.toJS(), 'failure') &&
      (prevProps.conceptAddFailure !== conceptAddFailure)) {
      if (conceptAddFailure && conceptAddFailure.toJS().length > 0) {
        if (get(get(conceptAddFailure.toJS()[0], 'error').errors[0], 'message').split(':')[0] ===
          'E11000 duplicate key error collection') {
          message.error('Concept with similar title already exist.')
        } else {
          message.error(get(get(conceptAddFailure.toJS()[0], 'error').errors[0], 'message').split(':')[0])
        }
      }
    }
  }
  handleEditConcept = async (value, { setErrors }) => {
    const { title, order, status, description } = value
    const { editData, cheats, closeModal } = this.props
    const orders = getOrdersInUse(cheats)
    const orderArr = orders.filter(n => n !== editData.order)
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      const { updateCheatSheet: data } = await updateCheatSheet({
        title,
        order,
        status,
        description
      }, editData.id)
      if (data && data.id) {
        closeModal()
      }
    }
  }
  render() {
    const { visible, closeModal } = this.props
    const { operation, editData, cheats } = this.props
    const orders = getOrdersInUse(cheats)
    const orderAutoComplete = getOrderAutoComplete(orders)
    return (
      <MainModal
        visible={visible}
        title='Add Cheatsheet Concept'
        onCancel={closeModal}
        maskClosable={false}
        width='568px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          operation === 'add' ?
            <AddConceptForm
              addFormData={{ ...this.state, order: orderAutoComplete }}
              handleAddConcept={this.handleAddConcept}
              {...this.props}
            /> :
            <EditConceptForm
              handleEditConcept={this.handleEditConcept}
              editData={editData}
              {...this.props}
            />
        }
      </MainModal>
    )
  }
}

export default CheatSheetModal
