import React from 'react'
import { get } from 'lodash'
import { notification } from 'antd'
import MainModal from '../../../components/MainModal'
import { AddForm, EditForm } from './Forms'
import { addWorkbook, updateWorkbook } from '../../../actions/workbook'
import { getOrderAutoComplete, getOrdersInUse } from '../../../utils/data-utils'

class WorkBookModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      FormData: {
        title: '',
        question: '',
        example: [
          {
            statement: '',
            order: 1
          }
        ],
        hint: '',
        codeHint: '',
        answer: '',
        difficulty: 0,
        formTags: [],
        textTag: '',
      }
    }
  }
  componentDidUpdate = (prevProps) => {
    const { workbookAddStatus, workbookAddFailure, closeModal } = this.props
    if (workbookAddStatus && !get(workbookAddStatus.toJS(), 'loading')
      && get(workbookAddStatus.toJS(), 'success') &&
      (prevProps.workbookAddStatus !== workbookAddStatus)) {
      notification.success({
        message: 'Workbook added successfully'
      })
      closeModal()
    } else if (workbookAddStatus && !get(workbookAddStatus.toJS(), 'loading')
      && get(workbookAddStatus.toJS(), 'failure') &&
      (prevProps.workbookAddFailure !== workbookAddFailure)) {
      if (workbookAddFailure && workbookAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(workbookAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  handleAddForm = async (value, { setErrors }) => {
    const orders = getOrdersInUse(this.props.workbooks && this.props.workbooks.toJS())
    const { topicId } = this.props
    const { title, question, order, example, hint, codeHint, answer, difficulty, formTags } = value
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await addWorkbook({
        topicId,
        tagsConnectIds: formTags.map(({ id }) => id),
        title,
        statement: question,
        order,
        answer: answer ? encodeURIComponent(answer) : '',
        workbookExamples: example,
        hint,
        codeHint,
        difficulty
      })
    }
  }
  handleEditForm = async (value, { setErrors }) => {
    const { editData, closeEditModal } = this.props
    const orders = getOrdersInUse(this.props.workbooks && this.props.workbooks.toJS())
    const orderArr = orders.filter(n => n !== editData.order)
    const { title, question, order, example, hint, codeHint, difficulty, answer, formTags } = value
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      const { updateWorkbook: data } = await updateWorkbook({
        id: editData.id,
        tagsConnectIds: formTags.map(({ id }) => id),
        title,
        statement: question,
        order,
        answer: answer ? encodeURIComponent(answer) : '',
        workbookExamples: {
          replace: example
        },
        hint: hint || '',
        codeHint: codeHint || '',
        difficulty
      })
      if (data && data.id) {
        closeEditModal()
      }
    }
  }
  render() {
    const { openModal, closeModal, operation, tags, editData } = this.props
    const { FormData } = this.state
    const orders = getOrdersInUse(this.props.workbooks && this.props.workbooks.toJS())
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
          operation === 'add' ? <AddForm
            addFormData={{
              ...FormData, order: orderAutoComplete
            }}
            handleAddForm={this.handleAddForm}
            tags={tags}
            orderInUse={orders}
            {...this.props}
          /> :
          <EditForm
            editFormData={editData}
            orderInUse={orders}
            operation={operation}
            handleEditForm={this.handleEditForm}
            tags={tags}
            {...this.props}
          />
        }
      </MainModal>
    )
  }
}

export default WorkBookModal
