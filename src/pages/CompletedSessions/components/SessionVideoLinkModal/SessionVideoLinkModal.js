import React, { Component } from 'react'
import { Button, Form } from 'antd'
import PropTypes from 'prop-types'
import hs from '../../../../utils/scale'
import MainModal from '../../../../components/MainModal'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import { ADMIN, TRANSFORMATION_TEAM, TRANSFORMATION_ADMIN } from '../../../../constants/roles'
import validators from '../../../../utils/formValidators'
import updateMentorMenteeSession from '../../../../actions/sessions/updateMentorMenteeSession'

class SessionVideoLinkModal extends Component {
  componentDidUpdate(prevProps) {
    const { videoLink, form, visible, updateStatus, notification } = this.props
    if (!prevProps.visible && visible) {
      if (videoLink && videoLink !== null) {
        form.setFieldsValue({
          sessionVideoLink: videoLink
        })
      }
    }
    if (prevProps.updateStatus && updateStatus && visible) {
      if (!prevProps.updateStatus.success && updateStatus.success) {
        notification.success({
          message: 'Video Session Link Updated!'
        })
        this.onCancel()
      }
    }
  }

  getModalTitle = title => {
    const { name, topic, sessionDetails, mentorName } = this.props
    const userRole = getDataFromLocalStorage('login.role')
    const titleArr = [
      `${title}`,
      <br />,
      <br />,
      `(${name} | ${topic.title} | ${sessionDetails.sessionDate} : ${sessionDetails.sessionTime})`
    ]
    if (userRole === ADMIN) {
      titleArr.push(<br />)
      titleArr.push(<br />)
      titleArr.push(`Session Taken By: ${mentorName}`)
    }
    return titleArr
  }

  onSave = async () => {
    const { form, sessionDetails } = this.props
    form.validateFields(async (err, values) => {
      if (!err) {
        const { sessionVideoLink } = values
        const input = {
          sessionRecordingLink: sessionVideoLink
        }
        await updateMentorMenteeSession(sessionDetails.sessionId, input)
      }
    })
  }

  onCancel = () => {
    const { form } = this.props
    form.setFieldsValue({
      sessionVideoLink: ''
    })
    this.props.closeVideoLinkModal()
  }

  render() {
    const { id, visible, title, updateStatus, form } = this.props
    const userRole = getDataFromLocalStorage('login.role')
    return (
      <MainModal
        visible={visible}
        title={this.getModalTitle(title)}
        onCancel={this.onCancel}
        maskClosable={false}
        width={`${hs(1000)}`}
        footer={[
          <Button
            onClick={this.onCancel}
            disabled={userRole === TRANSFORMATION_TEAM || userRole === TRANSFORMATION_ADMIN}
          >
            CANCEL
          </Button>,
          <MainModal.SaveButton
            type='primary'
            htmlType='submit'
            form={id}
            onClick={this.onSave}
            disabled={userRole === TRANSFORMATION_TEAM || userRole === TRANSFORMATION_ADMIN}
          >
            {' '}
            {updateStatus && updateStatus.loading ? 'Saving...' : 'SAVE'}
          </MainModal.SaveButton>
        ]}
      >
        <Form>
          <MainModal.FormItem>
            {form.getFieldDecorator(...validators.sessionVideoLink)(
              <MainModal.Input
                placeholder='Session Video Link'
                type='text'
                autoComplete='off'
                disabled={userRole === TRANSFORMATION_TEAM || userRole === TRANSFORMATION_ADMIN}
              />
            )}
          </MainModal.FormItem>
        </Form>
      </MainModal>
    )
  }
}

SessionVideoLinkModal.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  updateStatus: PropTypes.shape({}),
  name: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  sessionDetails: PropTypes.shape({}).isRequired,
  mentorName: PropTypes.string.isRequired,
  closeVideoLinkModal: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func
  }).isRequired,
  videoLink: PropTypes.string,
  notification: PropTypes.shape({}).isRequired,
  completedSessions: PropTypes.shape({})
}

SessionVideoLinkModal.defaultProps = {
  videoLink: '',
  updateStatus: {},
  completedSessions: {}
}

export default Form.create()(SessionVideoLinkModal)
