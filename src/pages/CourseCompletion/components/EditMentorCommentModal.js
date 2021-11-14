import { Button, Input } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import updateUserCourseCompletion from '../../../actions/CourseCompletion/updateUserCourseCompletion'
import MainModal from '../../../components/MainModal'

class EditMentorCommentModal extends Component {
  state = {
    mentorComment: ''
  }
  componentDidMount = () => {
    const { data } = this.props
    const mentorComment = get(data, 'mentorComment', '')
    if (mentorComment) {
      this.setState({
        mentorComment
      })
    }
  }
  componentDidUpdate = (prevProps) => {
    const { courseCompletionUpdateStatus, closeModal } = this.props
    if (courseCompletionUpdateStatus && !get(courseCompletionUpdateStatus.toJS(), 'loading')
      && get(courseCompletionUpdateStatus.toJS(), 'success') &&
      (prevProps.courseCompletionUpdateStatus !== courseCompletionUpdateStatus)) {
      closeModal()
    }
  }
  handleCommentChange = (event) => {
    this.setState({
      mentorComment: event.target.value
    })
  }
  saveMentorComment = async () => {
    const { data } = this.props
    const { mentorComment } = this.state
    const userCourseCompletionId = get(data, 'id', '')
    const input = `{
      mentorComment: "${mentorComment}"
    }`
    if (userCourseCompletionId) {
      await updateUserCourseCompletion(userCourseCompletionId, input)
    }
  }
  render() {
    const { isModalVisible, closeModal, courseCompletionUpdateStatus } = this.props
    const { mentorComment } = this.state
    const isLoading = courseCompletionUpdateStatus && get(courseCompletionUpdateStatus.toJS(), 'loading')
    return (
      <MainModal
        visible={isModalVisible}
        title='Edit Comment'
        onCancel={() => closeModal()}
        maskClosable={false}
        width='780px'
        centered
        destroyOnClose
        footer={[
          <Button
            type='primary'
            onClick={() => this.saveMentorComment()}
          >
            {isLoading ? 'SAVING...' : 'SAVE'}
          </Button>
        ]}
      >
        <Input.TextArea
          placeholder='Enter Comment'
          value={mentorComment}
          onChange={this.handleCommentChange}
          rows={4}
        />
      </MainModal>
    )
  }
}

export default EditMentorCommentModal
