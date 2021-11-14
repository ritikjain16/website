import React, { Component } from 'react'
import { Button, Form } from 'antd'
import hs from '../../../../utils/scale'
import MainModal from '../../../../components/MainModal'
import validators from '../../../../utils/formValidators'
import sendTransactionalMessage from '../../../../actions/sessions/sendTransactionalMessage'

class SendSessionModalLink extends Component {
  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.props.form.setFieldsValue({
        sessionLink: ''
      })
    }
    if (!prevProps.shadowVisible && this.props.shadowVisible) {
      if (this.props.sessionLink) {
        sendTransactionalMessage(this.props.userId, this.props.sessionLink, 'sendSessionLink', this.props.sessionId)
        setTimeout(() => {
          this.props.close()
        }, 1000)
      }
    }
  }

    onSave = async () => {
      const { form } = this.props
      form.validateFields(async (err, values) => {
        if (!err) {
          sendTransactionalMessage(this.props.userId, values.sessionLink, 'sendSessionLink', this.props.sessionId)
          this.props.close()
        }
      })
    }

    onCancel = () => {
      const { form } = this.props
      form.setFieldsValue({
        sessionLink: ''
      })
      this.props.close()
    }

    render() {
      const { id, visible, updateStatus, form } = this.props

      return (
        <MainModal
          visible={visible}
          title='Send Session Link'
          onCancel={this.onCancel}
          maskClosable={false}
          width={`${hs(1000)}`}
          footer={[
            <Button onClick={this.onCancel}>CANCEL</Button>,
            <MainModal.SaveButton
              type='primary'
              htmlType='submit'
              form={id}
              onClick={this.onSave}
            > {updateStatus && updateStatus.loading ? 'Saving...' : 'SAVE'}
            </MainModal.SaveButton>
        ]}
        >
          <Form>
            <MainModal.FormItem>
              {form.getFieldDecorator(...validators.sessionLink)(
                <MainModal.Input
                  placeholder='Session Link'
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


export default Form.create()(SendSessionModalLink)
