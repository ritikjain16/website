import { Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import {
  addContentProject,
  updateContentProject
} from '../../../../actions/contentMaker'
import MainModal from '../../../../components/MainModal'
import { UNPUBLISHED_STATUS } from '../../../../constants/questionBank'
import { getOrderAutoComplete, getOrdersInUse } from '../../../../utils/data-utils'
import { AddPracticeForm, EditPracticeForm } from './PracticeForms'

class PracticeModal extends React.Component {
  state = {
    title: '',
    projectDescription: '',
    status: UNPUBLISHED_STATUS,
    isSubmitAnswer: false,
    projectCreationDescription: '',
    externalPlatformLink: '',
    answerDescription: '',
  }

  handleAddPractice = async (value, { setErrors }, externalPlatformLogo, selectedCourses = []) => {
    const { practiceData, closeModal } = this.props
    const orders = getOrdersInUse(practiceData && practiceData.toJS())
    const { order, ...inputs } = value
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await addContentProject({
        input: { ...inputs, order, type: 'practice' },
        key: 'practice',
        selectedCourses: selectedCourses.map(course => get(course, 'key')),
        externalPlatformLogo
      }).then(async res => {
        if (res && res.addBlockBasedProject && res.addBlockBasedProject.id) {
          closeModal()
        }
      })
    }
  }

  handleEditPractice = async (value, { setErrors }, externalPlatformLogo, selectedCourses) => {
    const { editData, practiceData, closeModal } = this.props
    const orders = getOrdersInUse(practiceData && practiceData.toJS())
    const orderArr = orders.filter(n => n !== editData.order)
    const { order, title, projectDescription,
      status, projectCreationDescription, externalPlatformLink,
      isSubmitAnswer,
      answerDescription } = value
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await updateContentProject({
        input: {
          order,
          title,
          projectDescription: projectDescription || '',
          status,
          isSubmitAnswer: isSubmitAnswer || false,
          projectCreationDescription: projectCreationDescription || '',
          externalPlatformLink: externalPlatformLink || '',
          answerDescription: answerDescription || ''
        },
        selectedCourses: selectedCourses.map(course => get(course, 'key')),
        key: 'practice',
        projectId: get(editData, 'id'),
        externalPlatformLogo
      }).then(async res => {
        if (res && res.updateBlockBasedProject && res.updateBlockBasedProject.id) {
          closeModal()
        }
      })
    }
  }
  render() {
    const { openModal, operation, closeModal, practiceAddStatus,
      practiceData, editData, practiceUpdateStatus, coursesList } = this.props
    const orders = getOrdersInUse(practiceData && practiceData.toJS())
    const orderAutoComplete = getOrderAutoComplete(orders)
    const spinning = operation === 'add' ? practiceAddStatus && get(practiceAddStatus.toJS(), 'loading', false)
      : practiceUpdateStatus && get(practiceUpdateStatus.toJS(), 'loading', false)
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Practice' : 'Edit Practice'}
        onCancel={() => (practiceAddStatus && get(practiceAddStatus.toJS(), 'loading')
        || practiceUpdateStatus && get(practiceUpdateStatus.toJS(), 'loading')) ? null : closeModal()}
        maskClosable={false}
        width='90%'
        centered
        destroyOnClose
        footer={null}
      >
        <Spin spinning={Boolean(spinning)}>
          {
          operation === 'add' ? (
            <AddPracticeForm
              addFormData={{ ...this.state, order: orderAutoComplete }}
              handleAddPractice={this.handleAddPractice}
              practiceAddStatus={practiceAddStatus}
              coursesList={coursesList}
            />
          ) : (
            <EditPracticeForm
              editFormData={editData}
              handleEditPractice={this.handleEditPractice}
              practiceUpdateStatus={practiceUpdateStatus}
              coursesList={coursesList}
            />
          )
        }
        </Spin>
      </MainModal>
    )
  }
}

export default PracticeModal
