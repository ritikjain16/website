import React, { Component } from 'react'
import { Button, Form, Radio } from 'antd'
import PropTypes from 'prop-types'
import validators from '../../../../utils/formValidators'
import MainModal from '../../../../components/MainModal'
import Dropzone from '../../../../components/Dropzone'
import constraints from '../../../../constants/constraints'

const RadioGroup = Radio.Group

class TopicsModal extends Component {
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
      thumbnailUrl: PropTypes.string.isRequired,
      smallThumbnailUrl: PropTypes.string.isRequired
    }).isRequired,
    chapters: PropTypes.arrayOf(PropTypes.object).isRequired,
    topics: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  state = {
    file: null,
    smallThumbnailFile: null,
    shouldThumbnail: true,
    shouldSmallThumbnail: true,
    isQuestionInMessageEnabled: false,
  }

  child = React.createRef()
  smallThumbnailRef = React.createRef()

  componentDidUpdate(prevProps) {
    if (this.props.visible === false && prevProps.visible === true) {
      this.resetModalFields()
    }

    if (this.props.visible === true && prevProps.visible === false) {
      this.setDefaultValues()
      if (this.child.current) {
        this.child.current.onOpen()
      }
      if (this.smallThumbnailRef.current) {
        this.smallThumbnailRef.current.onOpen()
      }
      const { defaultValues: { thumbnailUrl, smallThumbnailUrl } } = this.props
      const isThumbnail = thumbnailUrl && thumbnailUrl !== ''
      const isSmallThumbnail = smallThumbnailUrl && smallThumbnailUrl !== ''
      if (isThumbnail) {
        this.setState({ shouldThumbnail: true })
      } else {
        this.setState({ shouldThumbnail: false })
      }
      if (isSmallThumbnail) {
        this.setState({ shouldSmallThumbnail: true })
      } else {
        this.setState({ shouldSmallThumbnail: false })
      }
    }
  }

  onOk = ({ title, description, order, chapter, isTrial }) => {
    const { onSave, defaultValues } = this.props
    const {
      file,
      smallThumbnailFile,
      shouldThumbnail,
      shouldSmallThumbnail,
      isQuestionInMessageEnabled
    } = this.state
    const { id, thumbnailUrl, smallThumbnailUrl } = defaultValues
    if (isTrial === 'free') {
      isTrial = true
    } else {
      isTrial = false
    }
    if (!description) {
      description = ''
    }
    onSave({
      id,
      title,
      description,
      order,
      isTrial,
      file,
      smallThumbnailFile,
      isThumbnail: shouldThumbnail,
      isSmallThumbnail: shouldSmallThumbnail,
      chapterId: chapter,
      thumbnailUrl,
      isQuestionInMessageEnabled,
      smallThumbnailUrl
    })
  }

  onDropFile = (file, shouldThumbnail) => {
    this.setState({
      file,
      shouldThumbnail
    })
  }

  handleSmallThumbnailDrop = (file, shouldSmallThumbnail) => {
    this.setState({
      smallThumbnailFile: file,
      shouldSmallThumbnail
    })
  }

  setDefaultValues() {
    const { form, defaultValues } = this.props
    const { title, description, order, chapter } = defaultValues
    let { isTrial } = defaultValues
    if (isTrial) {
      isTrial = 'free'
    } else {
      isTrial = 'paid'
    }
    this.setState({ isQuestionInMessageEnabled: defaultValues.isQuestionInMessageEnabled })
    form.setFieldsValue({
      title,
      description,
      order,
      isTrial,
      chapter
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

  resetModalFields = () => {
    this.props.form.setFieldsValue({
      title: '',
      description: '',
      order: '',
      isTrial: 'paid',
      chapter: ''
    })
  }


  render() {
    const { id, form, visible, closeModal, ordersInUse, title, chapters, topics } = this.props
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
        <Dropzone
          getDropzoneFile={this.handleSmallThumbnailDrop}
          defaultImage={this.props.defaultValues.smallThumbnailUrl}
          ref={this.smallThumbnailRef}
          key={id}
        />
        <Form onSubmit={this.checkValidations} id={id}>
          <MainModal.FormItem>
            {form.getFieldDecorator(
              ...validators.select('chapter', topics, constraints.topics.maxInChapter
            ))(
              <MainModal.Select
                showSearch
                placeholder='Select Chapters'
                type='text'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {chapters.map(chapter => (
                  <MainModal.Option value={chapter.id}>{chapter.title}</MainModal.Option>
                ))}
              </MainModal.Select>
            )}
          </MainModal.FormItem>
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
          <MainModal.FormItem>
            {form.getFieldDecorator(...validators.isTrial)(
              <RadioGroup
                name='isTrial'
                buttonStyle='solid'
              >
                <MainModal.StyledRadio value='paid'>Paid</MainModal.StyledRadio>
                <MainModal.StyledRadio value='free'>Free</MainModal.StyledRadio>
              </RadioGroup>
            )}
          </MainModal.FormItem>
          <MainModal.OrderHelperText style={{
            marginBottom: 10
          }}
          >Is Chat and PQ Integrated?
          </MainModal.OrderHelperText>
          <MainModal.FormItem>
            <RadioGroup
              name='isQuestionInMessageEnabled'
              buttonStyle='solid'
              defaultValue={this.state.isQuestionInMessageEnabled}
              onChange={({ target: { value } }) => {
                this.setState({
                  isQuestionInMessageEnabled: value === 'true'
                })
 }
              }
              value={String(this.state.isQuestionInMessageEnabled)}
            >
              <MainModal.StyledRadio value='true'>True</MainModal.StyledRadio>
              <MainModal.StyledRadio value='false'>False</MainModal.StyledRadio>
            </RadioGroup>
          </MainModal.FormItem>
        </Form>
      </MainModal>
    )
  }
}

export default Form.create()(TopicsModal)
