import { notification } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { addProject, updateProject } from '../../../actions/projects'
import MainModal from '../../../components/MainModal'
import { UNPUBLISHED_STATUS } from '../../../constants/questionBank'
import { getOrderAutoComplete, getOrdersInUse } from '../../../utils/data-utils'
import { AddProject, EditProject } from './Forms'

class ProjectModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      status: UNPUBLISHED_STATUS
    }
  }
  componentDidUpdate = (prevProps) => {
    const { projectAddStatus, projectAddFailure, closeModal } = this.props
    if (projectAddStatus && !get(projectAddStatus.toJS(), 'loading')
      && get(projectAddStatus.toJS(), 'success') &&
      (prevProps.projectAddStatus !== projectAddStatus)) {
      notification.success({
        message: 'Project added successfully'
      })
      closeModal()
    } else if (projectAddStatus && !get(projectAddStatus.toJS(), 'loading')
      && get(projectAddStatus.toJS(), 'failure') &&
      (prevProps.projectAddFailure !== projectAddFailure)) {
      if (projectAddFailure && projectAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(projectAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  handleAddProject = async (value, { setErrors }) => {
    const { topicId, projectsData } = this.props
    const orders = getOrdersInUse(projectsData)
    const { title, order, status } = value
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await addProject({
        topicId,
        title,
        order,
        status
      })
    }
  }
  handleEditProject = async (value, { setErrors }) => {
    const { title, order, status } = value
    const { editData, closeEditModal, projectsData } = this.props
    const orders = getOrdersInUse(projectsData)
    const orderArr = orders.filter(n => n !== editData.order)
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      const { updateProject: data } = await updateProject({
        id: editData.id,
        title,
        order,
        status
      })
      if (data && data.id) {
        closeEditModal()
      }
    }
  }
  render() {
    const { openModal, closeModal, operation, editData, projectsData } = this.props
    const orders = getOrdersInUse(projectsData)
    const orderAutoComplete = getOrderAutoComplete(orders)
    return (
      <MainModal
        visible={openModal}
        title='Add New Workbook'
        onCancel={closeModal}
        maskClosable={false}
        width='650px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          operation === 'add' ?
            <AddProject
              addFormData={{ ...this.state, order: orderAutoComplete }}
              handleAddProject={this.handleAddProject}
              {...this.props}
            /> : <EditProject
              editFormData={editData}
              handleEditProject={this.handleEditProject}
              {...this.props}
            />
        }
      </MainModal>
    )
  }
}

export default ProjectModal
