import React from 'react'
import { Form } from 'antd'
import PropTypes from 'prop-types'
import StyledModal from '../LearningObjectiveModal/LearningObjectiveModal.style'
import validators from '../../../../utils/formValidators'
import ActionsPanel from '../../../../components/ActionsPanel'
import Dropzone from '../../../../components/Dropzone'
import getFullPath from '../../../../utils/getFullPath'

class LearningObjectiveActions extends React.Component {
  state={
    editModalVisible: false,
    file: null,
    pqStoryImage: null,
    isThumbnailPresent: true,
    isStoryImagePresent: true
  }
  /** A ref is created to access the dropzone */
  dropzoneRef=React.createRef()
  dropZoneRefPQStoryImage=React.createRef()

  componentDidMount() {
    const { form, learningObjective } = this.props
    const { title, order, pqStory } = learningObjective
    form.setFieldsValue({
      title,
      order,
      pqStory
    })
  }
  componentDidUpdate(prevprops, prevstate) {
    if (prevstate.editModalVisible === false && this.state.editModalVisible === true) {
      const { form, learningObjective } = this.props
      const { title, order, pqStory } = learningObjective
      /** the ref (dropzoneref) is used to set the image by using ref's current property */
      if (this.dropzoneRef.current) {
        this.dropzoneRef.current.onOpen()
      }
      if (this.dropZoneRefPQStoryImage.current) {
        this.dropZoneRefPQStoryImage.current.onOpen()
      }
      const { learningObjective: { thumbnail, pqStoryImage } } = this.props
      const isThumbnail = thumbnail && thumbnail.signedUri
      const isStoryImage = pqStoryImage && pqStoryImage.signedUri
      /** isThumbnailPresent is set if defaultImage is present in lo object above */
      if (isThumbnail) {
        this.setState({ isThumbnailPresent: true })
      } else {
        this.setState({ isThumbnailPresent: false })
      }
      if (isStoryImage) {
        this.setState({ isStoryImagePresent: true })
      } else {
        this.setState({ isStoryImagePresent: false })
      }
      form.setFieldsValue({
        title,
        order,
        pqStory
      })
    }
  }
  showModal= () => () => {
    this.setState({
      editModalVisible: true
    })
  }
  closeModal=() => {
    this.setState({
      editModalVisible: false,
      file: null,
      pqStoryImage: null
    })
  }
  /** Function to validate the form if no errors then edit the lo */
  checkValidations=(e) => {
    const { form } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        this.handleEdit(values)
      }
    })
  }
  /** function to edit the learning objectives */
  handleEdit= async (values) => {
    const { title, order, pqStory } = values
    const { learningObjective } = this.props
    const input = {
      id: learningObjective.id,
      title,
      order,
      file: this.state.file,
      pqStory: (!pqStory ? '' : pqStory),
      pqStoryImage: this.state.pqStoryImage
    }
    let loImageRemoveError = false
    let pqStoryImageRemoveError = false
    if (!this.state.isThumbnailPresent && learningObjective.thumbnail) {
      /** The thumbnail is removed first by calling
       * removeThumbnail function and edit function is called */
      loImageRemoveError = true
      const removedThumbnailLOId = await this.props.removeThumbnail(learningObjective.id,
        learningObjective.thumbnail.id)

      if (removedThumbnailLOId) {
        loImageRemoveError = false
      }
    }
    if (!this.state.isStoryImagePresent && learningObjective.pqStoryImage) {
      /** The thumbnail is removed first by calling
       * removeThumbnail function and edit function is called */
      pqStoryImageRemoveError = true
      const removedThumbnailLOId = await this.props.removePQStoryImage(learningObjective.id,
        learningObjective.pqStoryImage.id)
      if (removedThumbnailLOId) {
        pqStoryImageRemoveError = false
      }
    }
    if (!loImageRemoveError && !pqStoryImageRemoveError) {
      this.props.editLearningObjective(input)
    }
    this.props.form.resetFields()
    this.setState({
      editModalVisible: false,
      file: null,
      pqStoryImage: null
    })
  }
  /** To close the edit modal */
  handleEditCancel=() => {
    this.props.form.resetFields()
    this.setState({
      editModalVisible: false,
      file: null,
      pqStoryImage: null
    })
  }
  /** To set the state after image is given in input */
  getDropzoneFile=(file, isThumbnailPresent) => {
    this.setState({
      file,
      isThumbnailPresent
    })
  }
  getDropzonePQStoryImage=(pqStoryImage, isStoryImagePresent) => {
    this.setState({
      pqStoryImage,
      isStoryImagePresent
    })
  }
  render() {
    const modalProps2 = {
      closable: false,
      visible: this.state.editModalVisible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      footer: null,
    }
    const { form, ordersInUse, learningObjective } = this.props
    const removeCurrentOrder = ordersInUse.filter(x => x !== learningObjective.order)
    return (
      <div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
        <ActionsPanel
          id={this.props.learningObjective.id}
          title='LO'
          isPublished={this.props.isPublished}
          publish={this.props.publish}
          unpublish={this.props.unpublish}
          deleteItem={this.props.deleteLearningObjective}
          openEdit={this.showModal}
        />
        <StyledModal.Modal id='editLO' {...modalProps2} title='EDIT LEARNING OBJECTIVE'>
          <div>
            <StyledModal.Row>
              <Dropzone
                width='35%'
                ref={this.dropzoneRef}
                defaultImage={getFullPath(
                  learningObjective.thumbnail ? learningObjective.thumbnail.signedUri : null
                )}
                getDropzoneFile={this.getDropzoneFile}
              />
              <Form onSubmit={this.checkValidations}
                id='loEditForm'
                style={{ width: '75%',
              paddingLeft: '5px',
              paddingRight: '5px'
                              }}
              >
                <div style={{ display: 'flex' }}>
                  <StyledModal.FormItem>
                    {form.getFieldDecorator(...validators.order(removeCurrentOrder))(
                      <StyledModal.StyledInputNumber
                        placeholder='Order'
                        id='order'
                        type='number'
                      />)}
                  </StyledModal.FormItem>
                  <StyledModal.DisplayOrder>Order in use: {removeCurrentOrder.join(',')}</StyledModal.DisplayOrder>

                </div>
                <StyledModal.FormItem>
                  {form.getFieldDecorator(...validators.title)(<StyledModal.StyledInput
                    placeholder='Title'
                    id='title'
                    autoComplete='off'
                  />)}
                </StyledModal.FormItem>
              </Form>
            </StyledModal.Row>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StyledModal.Text>EDIT PQ STORY</StyledModal.Text>
            </div>

            <StyledModal.Row>
              <Dropzone
                width='35%'
                ref={this.dropZoneRefPQStoryImage}
                defaultImage={getFullPath(
                    learningObjective.pqStoryImage ? learningObjective.pqStoryImage.signedUri : null
                  )}
                getDropzoneFile={this.getDropzonePQStoryImage}
              />
              <div style={{ width: '75%' }}>
                <StyledModal.FormItem>
                  {form.getFieldDecorator('pqStory')(
                    <StyledModal.TextArea rows={7} />)}
                </StyledModal.FormItem>
              </div>
            </StyledModal.Row>
            <StyledModal.Footer>
              <StyledModal.CancelButton
                key='cancel'
                onClick={this.handleEditCancel}
              >CANCEL
              </StyledModal.CancelButton>
              <StyledModal.saveButton
                key='save'
                onClick={this.checkValidations}
                id='editLO'
              >SAVE
              </StyledModal.saveButton>
            </StyledModal.Footer>
          </div>
        </StyledModal.Modal>
      </div>
    )
  }
}
LearningObjectiveActions.propTypes = {
  learningObjective: PropTypes.shape({
    order: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    id: PropTypes.string,
    thumbnail: PropTypes.shape({})
  }).isRequired,
  form: PropTypes.shape({
    resetFields: PropTypes.func.isRequired
  }).isRequired,
  ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
  deleteLearningObjective: PropTypes.func.isRequired,
  editLearningObjective: PropTypes.func.isRequired,
  removePQStoryImage: PropTypes.func.isRequired,
  publish: PropTypes.func.isRequired,
  unpublish: PropTypes.func.isRequired,
  isPublished: PropTypes.bool.isRequired,
  removeThumbnail: PropTypes.func.isRequired
}
export default Form.create()(LearningObjectiveActions)
