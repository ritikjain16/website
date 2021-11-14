import React, { Component } from 'react'
import { Button, Form } from 'antd'
import PropTypes from 'prop-types'
import validators from '../../../../utils/formValidators'
import MainModal from '../../../../components/MainModal'
import Dropzone from '../../../../components/Dropzone'

class ChaptersModal extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
    title: PropTypes.string.isRequired,
    defaultValues: PropTypes.shape({
      thumbnailUrl: PropTypes.string.isRequired
    }).isRequired,
    courses: PropTypes.arrayOf(PropTypes.shape({})).isRequired
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

  onOk = ({ title, description, order, courseMapping }) => {
    const { onSave, defaultValues } = this.props
    const { file, shouldThumbnail } = this.state
    const { id, thumbnailUrl } = defaultValues
    if (!description) {
      description = ''
    }
    onSave({
      id,
      title,
      description,
      order,
      file,
      isThumbnail: shouldThumbnail,
      thumbnailUrl,
      courseMapping
    })
  }

  setDefaultValues() {
    const { form, defaultValues } = this.props
    const { title, description, order, courseMapping } = defaultValues
    form.setFieldsValue({
      title,
      description,
      order,
      courseMapping
    })
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


  onDropFile = (file, shouldThumbnail) => {
    this.setState({
      file,
      shouldThumbnail
    })
  }


  resetModalFields = () => {
    this.props.form.setFieldsValue({
      title: '',
      description: '',
      order: '',
      courseMapping: []
    })
  }


  render() {
    const { id, form, visible, closeModal, ordersInUse, title } = this.props
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
          <div id='select-multiple'>
            <MainModal.FormItem>
              {form.getFieldDecorator(...validators.courseMapping)(
                <MainModal.SelectMultiple
                  placeholder='Course'
                  mode='multiple'
                  /** This prop helps in correctly rendering the dropdown menu
                     * How to use this prop?Wrap the select tag with a div and give a id.
                     * The prop accepts a function which returns node for which the select
                     * tag should takes a reference and render relative to it
                     * Here is a link to the issue if this prop was not used
                     * URL:https://monosnap.com/file/WHQjB5AHxno6SDqiAYXHkjLHoIZOMw
                     */
                  getPopupContainer={() => document.getElementById('select-multiple')}
                >
                  {
                this.props.courses.map(course =>
                  <MainModal.Option key={course.id}
                    value={course.id}
                  >{course.title}
                  </MainModal.Option>
                )
              }
                </MainModal.SelectMultiple>
            )}
            </MainModal.FormItem>
          </div>
          <MainModal.FormItem>
            {form.getFieldDecorator(...validators.title)(
              <MainModal.Input
                placeholder='Title'
                type='text'
                autoComplete='off'
              />
            )}
          </MainModal.FormItem>
          <MainModal.FormItem>
            {form.getFieldDecorator(...validators.descripton)(
              <MainModal.TextArea
                placeholder='Description'
                autoComplete='off'
                autosize
              />
            )}
          </MainModal.FormItem>
          <MainModal.OrderHelperText>Orders in use: {ordersInUse.join(',')}</MainModal.OrderHelperText>
          <MainModal.FormItem>
            {form.getFieldDecorator(...validators.order(this.props.ordersInUse))(
              <MainModal.OrderInput
                htmlType='number'
                placeholder='Order'
                min={0}
                autoComplete='off'
              />
            )}
          </MainModal.FormItem>
        </Form>
      </MainModal>
    )
  }
}

export default Form.create()(ChaptersModal)
