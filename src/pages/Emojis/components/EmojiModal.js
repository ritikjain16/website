import React, { Component } from 'react'
import { Button, Form } from 'antd'
import PropTypes from 'prop-types'
import validators from '../../../utils/formValidators'
import MainModal from '../../../components/MainModal'
import Dropzone from '../../../components/Dropzone'

class TopicsModal extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    defaultValues: PropTypes.shape({
      thumbnailUrl: PropTypes.string.isRequired
    }).isRequired
  }

  state = {
    file: null,
    shouldThumbnail: true
  }

  child = React.createRef()

  componentDidUpdate(prevProps) {
    if (this.props.visible === false && prevProps.visible === true) {
      this.resetModalFields()
    }

    if (this.props.visible === true && prevProps.visible === false) {
      this.setDefaultValues()
      if (this.child.current) {
        this.child.current.onOpen()
      }
      const { defaultValues: { thumbnailUrl } } = this.props
      const isThumbnail = thumbnailUrl && thumbnailUrl !== ''
      if (isThumbnail) {
        this.setState({ shouldThumbnail: true })
      } else {
        this.setState({ shouldThumbnail: false })
      }
    }
  }

  onOk = ({ code }) => {
    const { onSave, defaultValues } = this.props
    const { file, shouldThumbnail } = this.state
    const { id, thumbnailUrl } = defaultValues
    onSave({
      id,
      code: `::${code}::`,
      file,
      isThumbnail: shouldThumbnail,
      thumbnailUrl
    })
  }

  onDropFile = (file, shouldThumbnail) => {
    this.setState({
      file,
      shouldThumbnail
    })
  }

  setDefaultValues() {
    const { form, defaultValues } = this.props
    const { code } = defaultValues
    form.setFieldsValue({ code })
  }

  checkValidations = e => {
    const { form } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        this.onOk(values)
      }
    })
  }

  resetModalFields = () => {
    this.props.form.setFieldsValue({
      code: ''
    })
  }


  render() {
    const { id, form, visible, closeModal, title } = this.props
    return (
      <MainModal
        title={title}
        visible={visible}
        onCancel={closeModal}
        width='568px'
        footer={[
          <Button onClick={closeModal}>CANCEL</Button>,
          <MainModal.SaveButton
            type='primary'
            htmlType='submit'
            form={id}
          > SAVE
          </MainModal.SaveButton>
        ]}
      >
        <Dropzone
          getDropzoneFile={this.onDropFile}
          defaultImage={this.props.defaultValues.thumbnailUrl}
          ref={this.child}
          key={id}
        />
        <Form onSubmit={this.checkValidations} id={id}>
          <MainModal.FormItem>
            <MainModal.GroupRow>
              <div style={{ fontSize: 18, marginRight: 5 }}>:: </div>
              {form.getFieldDecorator(...validators.code)(
                <MainModal.Input
                  placeholder='code'
                  type='text'
                  autoComplete='off'
                  style={{ width: '30%', paddingBottom: 0, top: 5 }}
                />
              )}
              <div style={{ fontSize: 18, marginLeft: 5 }}> ::</div>
            </MainModal.GroupRow>
          </MainModal.FormItem>
        </Form>
      </MainModal>
    )
  }
}

export default Form.create()(TopicsModal)
