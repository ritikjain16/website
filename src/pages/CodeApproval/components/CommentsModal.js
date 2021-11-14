import React, { Component } from 'react'
import { Button, Form } from 'antd'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import hs from '../../../utils/scale'
import MainModal from '../../../components/MainModal'
import validators from '../../../utils/formValidators'
import updateUserSavedCode from '../../../actions/userSavedCodes/updateUserSavedCode'
import CodeApprovalStyle from '../CodeApproval.style'

class CommentsModal extends Component {
  componentDidUpdate(prevProps) {
    const { form, visible, rejectionComment } = this.props
    if (!prevProps.visible && visible) {
      if (rejectionComment && rejectionComment !== null) {
        form.setFieldsValue({
          rejectionComment,
        })
      }
    }
  }

  getModalTitle = title => {
    const { selectedSavedCode } = this.props
    const titleArr = [
      `${title}`,
      <br />,
      <br />,
      `(${get(selectedSavedCode, 'title', '')} | By - ${get(selectedSavedCode, 'studentName', '')})`
    ]
    return titleArr
  }

  onSave = async () => {
    const { form, selectedSavedCode } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        const { rejectionComment } = values
        const input = {
          rejectionComment,
          isApprovedForDisplay: 'rejected'
        }
        await updateUserSavedCode(get(selectedSavedCode, 'id'), input)
        this.onCancel(true)
      }
    })
  }

  onCancel = (shouldStateUpdate = false) => {
    const { form } = this.props
    form.setFieldsValue({
      rejectionComment: ''
    })
    this.props.closeCommentsModal(shouldStateUpdate)
  }

  render() {
    const { id, visible, title, form } = this.props
    let { isUserSavedCodeUpdating } = this.props
    isUserSavedCodeUpdating = isUserSavedCodeUpdating && isUserSavedCodeUpdating.toJS()
    return (
      <MainModal
        visible={visible}
        style={{ zIndex: 9999 }}
        title={this.getModalTitle(title)}
        onCancel={() => this.onCancel()}
        maskClosable={false}
        width={`${hs(1000)}`}
        footer={[
          <Button
            onClick={() => this.onCancel()}
          >
            CANCEL
          </Button>,
          <CodeApprovalStyle.RejectButton
            type='danger'
            htmlType='submit'
            form={id}
            onClick={this.onSave}
          >
            {isUserSavedCodeUpdating && isUserSavedCodeUpdating.loading ? 'Rejecting...' : 'Reject'}
          </CodeApprovalStyle.RejectButton>
        ]}
      >
        <Form>
          <MainModal.FormItem>
            {form.getFieldDecorator(...validators.rejectionComment)(
              <MainModal.Input
                placeholder='Rejection Comment'
                type='text'
                autoComplete='off'
              />
            )}
          </MainModal.FormItem>
        </Form>
      </MainModal>
    )
  }
}

CommentsModal.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeCommentsModal: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func
  }).isRequired,
}

export default Form.create()(CommentsModal)
