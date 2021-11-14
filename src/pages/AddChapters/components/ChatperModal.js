import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../components/MainModal'
import { getOrderAutoComplete, getOrdersInUse } from '../../../utils/data-utils'
import {
  addChapter, updateChapter
} from '../../../actions/courseMaker'
import AddChapterForm from './ChatperForm/AddChapterForm'
import EditChapterForm from './ChatperForm/EditChapterForm'
import { UNPUBLISHED_STATUS } from '../../../constants/questionBank'

class ChapterModal extends React.Component {
  state = {
    title: '',
    description: '',
    status: UNPUBLISHED_STATUS
  }
  handleAddChapter = async (value,
    { setErrors }, thumbnailFile, selectedTopic = []) => {
    const { tableData, courseId } = this.props
    const orders = getOrdersInUse(tableData)
    const { title, order, description, status } = value
    if (orders.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await addChapter({
        input: { title, order, description, status },
        courseId,
        topicIds: selectedTopic.map(topic => get(topic, 'key')),
        thumbnailFile
      })
    }
  }
  handleEditChapter = async (value,
    { setErrors }, thumbnailFile, selectedTopic = []) => {
    const { title, order, description, status } = value
    const { tableData, courseId, editData } = this.props
    const orders = getOrdersInUse(tableData)
    const orderArr = orders.filter(n => n !== editData.order)
    if (orderArr.includes(order)) {
      setErrors({ order: 'Order Already in use' })
    } else {
      await updateChapter({
        chapterId: get(editData, 'id'),
        input: { title, order, description: description || '', status },
        courseId,
        topicIds: selectedTopic.map(topic => get(topic, 'key')),
        thumbnailFile
      })
    }
  }
  render() {
    const { openModal, closeModal, editData, coursesList,
      operation, tableData, courseAddStatus, courseUpdateStatus,
      courseId, chapterAddStatus, chapterUpdateStatus, topicsList } = this.props
    const orders = getOrdersInUse(tableData)
    const orderAutoComplete = getOrderAutoComplete(orders)
    return (
      <MainModal
        visible={openModal}
        title={operation === 'add' ? 'Add Chapter' : 'Edit Chapter'}
        onCancel={closeModal}
        maskClosable={false}
        width='600px'
        centered
        destroyOnClose
        footer={null}
      >
        {
          operation === 'add' ?
            <AddChapterForm
              addFormData={{ ...this.state, order: orderAutoComplete }}
              handleAddChapter={this.handleAddChapter}
              courseAddStatus={courseAddStatus}
              coursesList={coursesList}
              courseId={courseId}
              topicsList={topicsList}
              chapterAddStatus={chapterAddStatus}
            /> :
            <EditChapterForm
              editData={editData}
              handleEditChapter={this.handleEditChapter}
              courseUpdateStatus={courseUpdateStatus}
              coursesList={coursesList}
              courseId={courseId}
              topicsList={topicsList}
              chapterUpdateStatus={chapterUpdateStatus}
            />
        }
      </MainModal>
    )
  }
}

export default ChapterModal
