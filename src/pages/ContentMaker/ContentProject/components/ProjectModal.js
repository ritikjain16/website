import { Spin } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { addContentProject, updateContentProject } from '../../../../actions/contentMaker'
import MainModal from '../../../../components/MainModal'
import { UNPUBLISHED_STATUS } from '../../../../constants/questionBank'
import { getOrderAutoComplete, getOrdersInUse } from '../../../../utils/data-utils'
import { AddProjectForm, EditProjectForm } from './ProjectForm'

class ProjectModal extends React.Component {
  state = {
    title: '',
    difficulty: 1,
    projectDescription: '',
    status: UNPUBLISHED_STATUS,
    projectCreationDescription: '',
    externalPlatformLink: '',
    answerDescription: '',
  }
  handleAddProject = async (value, { setErrors }, externalPlatformLogo,
    projectThumbnail, selectedCourses = []) => {
    const { blockBasedProjects, closeModal } = this.props
    const orders = getOrdersInUse(blockBasedProjects && blockBasedProjects.toJS())
    const { order, ...input } = value
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await addContentProject({
        input: { ...input, order, isSubmitAnswer: true, type: 'project' },
        key: 'project',
        selectedCourses: selectedCourses.map(course => get(course, 'key')),
        projectThumbnail,
        externalPlatformLogo
      }).then(async res => {
        if (res && res.addBlockBasedProject && res.addBlockBasedProject.id) {
          closeModal()
        }
      })
    }
  }

  handleEditProject = async (value, { setErrors }, externalPlatformLogo,
    projectThumbnail, selectedCourses = []) => {
    const { editData, blockBasedProjects, closeModal } = this.props
    const orders = getOrdersInUse(blockBasedProjects && blockBasedProjects.toJS())
    const orderArr = orders.filter(n => n !== editData.order)
    const { order, title, difficulty, projectDescription,
      status, projectCreationDescription, externalPlatformLink, answerDescription } = value
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await updateContentProject({
        input: {
          order,
          title,
          difficulty,
          projectDescription: projectDescription || '',
          status,
          projectCreationDescription: projectCreationDescription || '',
          externalPlatformLink: externalPlatformLink || '',
          answerDescription: answerDescription || ''
        },
        key: 'project',
        selectedCourses: selectedCourses.map(course => get(course, 'key')),
        projectId: get(editData, 'id'),
        externalPlatformLogo,
        projectThumbnail
      }).then(async res => {
        if (res && res.updateBlockBasedProject && res.updateBlockBasedProject.id) {
          closeModal()
        }
      })
    }
  }
  render() {
    const { openModal, operation, closeModal, projectAddStatus,
      blockBasedProjects, editData, projectUpdateStatus, coursesList } = this.props
    const orders = getOrdersInUse(blockBasedProjects && blockBasedProjects.toJS())
    const orderAutoComplete = getOrderAutoComplete(orders)
    const spinning = operation === 'add' ? projectAddStatus && get(projectAddStatus.toJS(), 'loading', false)
      : projectUpdateStatus && get(projectUpdateStatus.toJS(), 'loading', false)
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Project' : 'Edit Project'}
        onCancel={() => (projectAddStatus && get(projectAddStatus.toJS(), 'loading')
        || projectUpdateStatus && get(projectUpdateStatus.toJS(), 'loading')) ? null : closeModal()}
        maskClosable={false}
        width='90%'
        centered
        destroyOnClose
        footer={null}
      >
        <Spin spinning={Boolean(spinning)}>
          {
          operation === 'add' ? (
            <AddProjectForm
              addFormData={{ ...this.state, order: orderAutoComplete }}
              handleAddProject={this.handleAddProject}
              coursesList={coursesList}
              projectAddStatus={projectAddStatus}
            />
          ) : (
            <EditProjectForm
              editFormData={editData}
              coursesList={coursesList}
              handleEditProject={this.handleEditProject}
              projectUpdateStatus={projectUpdateStatus}
            />
          )
        }
        </Spin>
      </MainModal>
    )
  }
}

export default ProjectModal
