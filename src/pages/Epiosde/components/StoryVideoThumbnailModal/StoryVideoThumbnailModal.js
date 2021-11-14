import React, { Component } from 'react'
import { Button, Form } from 'antd'
import PropTypes from 'prop-types'
import MainModal from '../../../../components/MainModal'
import Dropzone from '../../../../components/Dropzone'

class StoryVideoThumbnailModal extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
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
    if (this.props.visible === true && prevProps.visible === false) {
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

  onOk = e => {
    e.preventDefault()
    const { onSave, defaultValues } = this.props
    const { file, shouldThumbnail } = this.state
    const { id, thumbnailUrl } = defaultValues
    onSave({
      id,
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

  render() {
    const { id, visible, closeModal } = this.props
    return (
      <MainModal
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
        <Form onSubmit={this.onOk} id={id} />
      </MainModal>
    )
  }
}

export default Form.create()(StoryVideoThumbnailModal)
