import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'antd'
import MainModal from '../../../components/MainModal'
import DropZone from '../../../components/Dropzone'
import { TITLES, CATEGORIES, MAX_COURSES_COUNT } from '../../../constants/courses'
import validators from '../../../utils/formValidators'

class CoursesModal extends React.Component {
    state={
      file: null,
      isThumbnail: false
    }
    // dropzone ref to access the dropzone
    dropZoneRef=React.createRef()
    componentDidUpdate(prevProps) {
      if (!prevProps.visible && this.props.visible) {
        this.setDefaultValues()
        // to open the dropzone or set the default image
        if (this.dropZoneRef.current) {
          this.dropZoneRef.current.onOpen()
        }
        const { defaultData: { thumbnail } } = this.props
        const isThumbnail = thumbnail
        if (isThumbnail) {
          this.setState({ isThumbnail: true })
        } else {
          this.setState({ isThumbnail: false })
        }
      }
    }
    // set the default form values
    setDefaultValues=() => {
      const { form, defaultData } = this.props
      const { title, order, category, description } = defaultData
      form.setFieldsValue({
        courseTitle: title,
        courseCategory: category,
        order,
        courseDescription: description
      })
    }
    // to set the state when image is dropped
    onDrop=(file, isThumbnail) => {
      this.setState({
        file,
        isThumbnail
      })
    }
    // send the values to database after succesful validation
    onSave=() => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const {
            courseTitle: title,
            courseDescription: description,
            courseCategory: category,
            order
          } = values
          const { id: defaultDataId } = this.props.defaultData
          const { file, isThumbnail } = this.state
          const input = {
            title,
            description: description.trim(),
            category,
            order
          }
          this.props.onSave(defaultDataId, input, file, isThumbnail)
          this.props.closeModal()
        }
      })
    }
    // called on clicking cancel button
    onCancel=() => {
      const { closeModal, form } = this.props
      form.resetFields()
      closeModal()
    }
    /** returns the course modal */
    render() {
      const { visible, title, form, ordersInUse } = this.props
      return (
        <MainModal
          visible={visible}
          onCancel={this.onCancel}
          title={title}
          onOk={this.onSave}
        >
          <DropZone
            width='33%'
            getDropzoneFile={this.onDrop}
            ref={this.dropZoneRef}
            defaultImage={this.props.defaultData.thumbnail}
          />
          <Form onSubmit={this.onSave}>
            <div id='course-title'>
              <MainModal.FormItem>
                {
                form.getFieldDecorator(...validators.courseTitle)(
                  <MainModal.Select style={{ width: '100%' }}
                    placeholder='Choose Title'
                    /** This prop helps in correctly rendering the dropdown menu
                     * How to use this prop?Wrap the select tag with a div and give a id.
                     * The prop accepts a function which returns node for which the select
                     * tag should takes a reference and render relative to it
                     * Here is a link to the issue if this prop was not used
                     * URL:https://monosnap.com/file/WHQjB5AHxno6SDqiAYXHkjLHoIZOMw
                     */
                    getPopupContainer={() => document.getElementById('course-title')}
                  >
                    {
                      TITLES.map(courseTitle =>
                        <MainModal.Option key={courseTitle} value={courseTitle}>
                          {courseTitle}
                        </MainModal.Option>)
                    }
                  </MainModal.Select>
                )
            }
              </MainModal.FormItem>
            </div>
            <div id='course-category'>
              <MainModal.FormItem>
                {
                form.getFieldDecorator(...validators.courseCategory)(
                  <MainModal.Select style={{ width: '100%' }}
                    placeholder='Choose Category'
                    getPopupContainer={() => document.getElementById('course-category')}
                  >
                    {
                      CATEGORIES.map(courseCategory =>
                        <MainModal.Option key={courseCategory} value={courseCategory}>
                          {courseCategory}
                        </MainModal.Option>)
                    }
                  </MainModal.Select>
                )
            }
              </MainModal.FormItem>
            </div>
            <MainModal.FormItem>
              {
                    form.getFieldDecorator(...validators.courseDescription)(
                      <MainModal.TextArea
                        placeholder='Enter the description'
                        autosize
                      />
                    )
                }
            </MainModal.FormItem>
            <MainModal.OrderHelperText>Orders in use: {ordersInUse.join(',')}</MainModal.OrderHelperText>
            <MainModal.FormItem>
              {
                form.getFieldDecorator(...validators.order(ordersInUse, MAX_COURSES_COUNT))(
                  <MainModal.OrderInput />
                )
              }
            </MainModal.FormItem>
          </Form>
        </MainModal>
      )
    }
}
CoursesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    order: PropTypes.number,
    category: PropTypes.string,
    description: PropTypes.string,
    thumbnail: PropTypes.string
  }).isRequired
}
export default Form.create()(CoursesModal)
