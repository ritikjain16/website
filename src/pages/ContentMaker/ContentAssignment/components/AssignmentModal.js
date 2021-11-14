import { notification } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { addAssignmentQuestion, updateAssignmentQuestion } from '../../../../actions/contentMaker'
import MainModal from '../../../../components/MainModal'
import { ASSIGNMENT, HOMEWORK_ASSIGNMENT } from '../../../../constants/CourseComponents'
import { UNPUBLISHED_STATUS } from '../../../../constants/questionBank'
import { getFailureStatus, getOrderAutoComplete, getOrdersInUse, getSuccessStatus } from '../../../../utils/data-utils'
import { AddAssignmentForm, EditAssignmentForm } from './AssignmentForm'

class AssignmentModal extends React.Component {
  state = {
    statement: '',
    questionCodeSnippet: '',
    answerCodeSnippet: '',
    difficulty: 1,
    hint: '',
    explanation: '',
    status: UNPUBLISHED_STATUS
  }

  componentDidUpdate = (prevProps) => {
    const { assignmentQuestionAddStatus, assignmentQuestionAddFailure,
      closeModal, assignmentQuestionUpdateStatus, currentComponent,
      homeworkAddStatus, homeworkUpdateStatus } = this.props
    if (currentComponent === HOMEWORK_ASSIGNMENT) {
      if (getSuccessStatus(homeworkAddStatus, prevProps.homeworkAddStatus)) {
        notification.success({
          message: 'Homework Assignment added successfully'
        })
        closeModal()
      } else {
        getFailureStatus(homeworkAddStatus,
          assignmentQuestionAddFailure, prevProps.assignmentQuestionAddFailure)
      }
    } else if (currentComponent === ASSIGNMENT) {
      if (getSuccessStatus(assignmentQuestionAddStatus, prevProps.assignmentQuestionAddStatus)) {
        notification.success({
          message: 'Assignment added successfully'
        })
        closeModal()
      } else {
        getFailureStatus(assignmentQuestionAddStatus,
          assignmentQuestionAddFailure, prevProps.assignmentQuestionAddFailure)
      }
    }
    if (currentComponent === HOMEWORK_ASSIGNMENT) {
      if (getSuccessStatus(homeworkUpdateStatus,
        prevProps.homeworkUpdateStatus)) {
        closeModal()
      }
    } else if (currentComponent === ASSIGNMENT) {
      if (getSuccessStatus(assignmentQuestionUpdateStatus,
        prevProps.assignmentQuestionUpdateStatus)) {
        closeModal()
      }
    }
  }
  handleAddAssignment = async (values, { setErrors }, selectedCourses = []) => {
    const { assignmentData, currentComponent } = this.props
    const orders = getOrdersInUse(assignmentData)
    const { statement, questionCodeSnippet, answerCodeSnippet,
      difficulty, hint, explanation, order, status } = values
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await addAssignmentQuestion({
        input: {
          isHomework: currentComponent === HOMEWORK_ASSIGNMENT,
          statement,
          questionCodeSnippet,
          answerCodeSnippet,
          difficulty,
          hint,
          explanation,
          order,
          status
        },
        courseIds: selectedCourses.map(course => get(course, 'key')),
        componentName: currentComponent
      })
    }
  }

  handleEditAssignment = async (values, { setErrors }, selectedCourses) => {
    const { editData, assignmentData, currentComponent } = this.props
    const orders = getOrdersInUse(assignmentData)
    const orderArr = orders.filter(n => n !== editData.order)
    const { statement, questionCodeSnippet, answerCodeSnippet,
      difficulty, hint, explanation, order, status } = values
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await updateAssignmentQuestion({
        assignmentId: editData.id,
        input: {
          statement: statement || '',
          questionCodeSnippet: questionCodeSnippet || '',
          answerCodeSnippet: answerCodeSnippet || '',
          difficulty: difficulty || 0,
          hint: hint || '',
          explanation: explanation || '',
          order,
          isHomework: currentComponent === HOMEWORK_ASSIGNMENT,
          status
        },
        selectedCourses: selectedCourses.map(course => get(course, 'key')),
        componentName: currentComponent
      })
    }
  }
  render() {
    const { openModal, operation, closeModal, assignmentData,
      assignmentQuestionAddStatus, editData,
      assignmentQuestionUpdateStatus, coursesList,
      currentComponent, homeworkAddStatus, homeworkUpdateStatus } = this.props
    const orders = getOrdersInUse(assignmentData)
    const orderAutoComplete = getOrderAutoComplete(orders)
    const addLoading = currentComponent === HOMEWORK_ASSIGNMENT
      ? homeworkAddStatus : assignmentQuestionAddStatus
    const updateLoading = currentComponent === HOMEWORK_ASSIGNMENT
      ? homeworkUpdateStatus : assignmentQuestionUpdateStatus
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Project' : 'Edit Project'}
        onCancel={closeModal}
        maskClosable={false}
        width='600px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          operation === 'add' ? (
            <AddAssignmentForm
              addFormData={{
                ...this.state,
                order: orderAutoComplete
              }}
              coursesList={coursesList}
              handleAddAssignment={this.handleAddAssignment}
              addLoading={addLoading}
            />
          ) : (
            <EditAssignmentForm
              editFormData={editData}
              coursesList={coursesList}
              handleEditAssignment={this.handleEditAssignment}
              updateLoading={updateLoading}
              currentComponent={currentComponent}
            />
          )
        }
      </MainModal>
    )
  }
}

export default AssignmentModal
