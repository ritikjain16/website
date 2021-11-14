import { Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { addLearningObjective, updateLearningObjective } from '../../../../actions/contentMaker'
import MainModal from '../../../../components/MainModal'
import { UNPUBLISHED_STATUS } from '../../../../constants/questionBank'
import AddLoForm from './LoForms/AddLoForm'
import EditLoForm from './LoForms/EditLoForm'

class LoModal extends React.Component {
  state = {
    title: '',
    description: '',
    pqStory: '',
    status: UNPUBLISHED_STATUS
  }
  handleAddLo = async (value, thumbnailFile, pqStoryImageFile, selectedCourses = []) => {
    const { closeModal } = this.props
    await addLearningObjective({
      input: value,
      selectedCourses: selectedCourses.map(course => get(course, 'key')),
      thumbnailFile,
      pqStoryImageFile
    }).then(async res => {
      if (res.addLearningObjective && res.addLearningObjective.id) {
        closeModal()
      }
    })
  }

  handleEditLo = async (value, thumbnailFile, pqStoryImageFile, selectedCourses = []) => {
    const { editData, closeModal } = this.props
    const { title, description, pqStory, order, status } = value
    await updateLearningObjective({
      input: {
        title,
        description: description || '',
        pqStory: pqStory || '',
        order,
        status
      },
      selectedCourses: selectedCourses.map(course => get(course, 'key')),
      loId: get(editData, 'id'),
      thumbnailFile,
      pqStoryImageFile
    }).then(async res => {
      if (res.updateLearningObjective && res.updateLearningObjective.id) {
        closeModal()
      }
    })
  }
  render() {
    const { openModal, closeModal, operation,
      learningObectiveUpdateStatus, learningObjectivesMeta,
      learningObectiveAddStatus, editData, coursesList } = this.props
    const spinning = operation === 'add' ? learningObectiveAddStatus && get(learningObectiveAddStatus.toJS(), 'loading', false)
      : learningObectiveUpdateStatus && get(learningObectiveUpdateStatus.toJS(), 'loading', false)
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Learning Objective' : 'Edit Learning Objective'}
        onCancel={() => (learningObectiveAddStatus && get(learningObectiveAddStatus.toJS(), 'loading')
        || learningObectiveUpdateStatus && get(learningObectiveUpdateStatus.toJS(), 'loading')) ? null : closeModal()}
        maskClosable={false}
        width='750px'
        centered
        destroyOnClose
        footer={null}
      >
        <Spin spinning={Boolean(spinning)}>
          {
          operation === 'add' ? (
            <AddLoForm
              handleAddLo={this.handleAddLo}
              addFormData={{
                ...this.state,
                order: learningObjectivesMeta + 1
              }}
              coursesList={coursesList}
              learningObectiveAddStatus={learningObectiveAddStatus}
            />
          ) : (
            <EditLoForm
              editFormData={editData}
              handleEditLo={this.handleEditLo}
              coursesList={coursesList}
              learningObectiveUpdateStatus={learningObectiveUpdateStatus}
            />
          )
        }
        </Spin>
      </MainModal>
    )
  }
}

export default LoModal
