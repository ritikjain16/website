import React from 'react'
import { PropTypes } from 'prop-types'
import { Form } from 'antd'
import StyledModal from './LearningObjectiveModal.style'
import Header from '../LearningObjectiveHeader/LearningObjectiveHeader.style'
import validators from '../../../../utils/formValidators'
import constraints from '../../../../constants/constraints'
import Dropzone from '../../../../components/Dropzone'
/**
*Responsible for showing add lo button and clicking it shows the LearningObjectiveModal
*/
class LearningObjectiveModal extends React.Component {
  static propTypes={
    addLearningObjective: PropTypes.func.isRequired,
    form: PropTypes.shape({
      resetFields: PropTypes.func.isRequired
    }).isRequired,
    ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
    isFetchingLearningobjective: PropTypes.bool.isRequired,
    isAddingLearningobjective: PropTypes.bool.isRequired,
    topicConnectId: PropTypes.string.isRequired
  }
  state={
    addModalvisible: false,
    file: null,
    pqStoryImage: null
  }
  /** Ref for dropzone */
  dropZoneRef=React.createRef()
  dropZoneRefPQStoryImage=React.createRef()
  /* The below code is for the add button when the data is fetching
    this.addButton is a ref created for styledcomponent button it is used for
    accessing the dom property of disable, blur ,changing the style
  */
  componentDidUpdate(prevprops, prevstate) {
    const addLOElem = document.getElementById('add-lo-button')
    if (prevprops.isFetchingLearningobjective === false &&
      this.props.isFetchingLearningobjective === true) {
      addLOElem.disabled = true
      addLOElem.style.opacity = 0.7
    } else {
      addLOElem.disabled = false
      addLOElem.style.opacity = 1
    }
    if (prevstate.addModalvisible === true && this.state.addModalvisible === false) {
      addLOElem.blur()
    } else if (this.state.addModalvisible === true && prevstate.addModalvisible === false) {
      this.setDefaultValues()
      /** ref's current property to access the dropzone */
      if (this.dropZoneRef.current) {
        this.dropZoneRef.current.onOpen()
      }
      if (this.dropZoneRefPQStoryImage.current) {
        this.dropZoneRefPQStoryImage.current.onOpen()
      }
    }
  }
  setDefaultValues() {
    const { ordersInUse, form } = this.props
    const defaultOrderValue = ordersInUse.length > 0 ? Math.max(...ordersInUse) + 1 : 1
    form.setFieldsValue({
      title: '',
      order: defaultOrderValue,
      storyLO: ''
    })
  }
  // showModal handles the logic of opening the LearningObjectiveModal
  showModal = () => {
    this.setState({
      addModalvisible: true,
    })
  }
  /*
  On clicking the save button it adds to the LO list and sets the values of state to default
  and closes the modal
  */
  handleSave= (values) => {
    const { title, order, storyLO } = values
    const input = {
      title: title.trim(),
      order,
      topicConnectId: this.props.topicConnectId,
      file: this.state.file,
      pqStoryImage: this.state.pqStoryImage,
      pqStory: storyLO.trim()
    }
    this.props.addLearningObjective(input)
    this.props.form.resetFields()
    this.setState({
      addModalvisible: false,
      file: null,
      pqStoryImage: null
    })
  }

  // handles the logic for closing the modal when cancel button is clicked
  handleCancel = () => {
    this.props.form.resetFields()
    this.setState({
      addModalvisible: false,
      file: null,
      pqStoryImage: null
    })
  }
  getDropzoneFile=(file) => {
    this.setState({
      file
    })
  }
  getDropzoneFileForPQ=pqStoryImage => {
    this.setState({
      pqStoryImage
    })
  }
  checkValidations=e => {
    const { form } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSave(values)
      }
    })
  }
  render() {
    const modalProps1 = {
      closable: false,
      visible: this.state.addModalvisible,
      onOk: this.handleOk,
      onCancel: this.handleCancel,
      footer: null
    }
    const { form, ordersInUse } = this.props
    return (
      <div>
        <Header.ButtonContainer.YellowButton
          onClick={() => this.showModal('addLO')}
          id='add-lo-button'
        >
          <Header.ButtonContainer.PlusIcon
            type='plus'
          />ADD LO
        </Header.ButtonContainer.YellowButton>
        <StyledModal.Modal
          {...modalProps1}
          id='addLO'
          title='ADD LEARNING OBJECTIVE'
        >
          <div>
            <StyledModal.Row>
              <Dropzone
                width='35%'
                ref={this.dropZoneRef}
                getDropzoneFile={this.getDropzoneFile}
              />
              <Form onSubmit={this.checkValidations}
                id='loForm'
                style={{ width: '75%',
paddingLeft: '5px',
paddingRight: '5px'
                }}
              >
                <div style={{
                display: 'flex',
                // width: '100%'
               }}
                >
                  <StyledModal.FormItem>
                    {form.getFieldDecorator(...validators.order(
                      ordersInUse, constraints.learningObjectives.maxOrder
                    ))(
                      <StyledModal.StyledInputNumber
                        placeholder='Order'
                        id='order'
                        type='number'
                      />)}
                  </StyledModal.FormItem>
                  <StyledModal.DisplayOrder>Order in use: {ordersInUse.join(',')}</StyledModal.DisplayOrder>
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
              <StyledModal.Text>ADD PQ STORY</StyledModal.Text>
            </div>
            <StyledModal.Row>
              <Dropzone
                width='35%'
                ref={this.dropZoneRefPQStoryImage}
                getDropzoneFile={this.getDropzoneFileForPQ}
              />
              <div style={{ width: '75%' }}>
                <StyledModal.FormItem>
                  {form.getFieldDecorator('storyLO')(
                    <StyledModal.TextArea placeholder='Enter story' rows={7} />
                  )}
                </StyledModal.FormItem>
              </div>
            </StyledModal.Row>
            <StyledModal.Footer>
              <StyledModal.CancelButton
                key='cancel'
                onClick={this.handleCancel}
              >CANCEL
              </StyledModal.CancelButton>
              <StyledModal.saveButton
                key='save'
                onClick={this.checkValidations}
                id='loForm'
                loading={this.props.isAddingLearningobjective}
              >SAVE
              </StyledModal.saveButton>
            </StyledModal.Footer>
          </div>
        </StyledModal.Modal>
      </div>
    )
  }
}

export default Form.create()(LearningObjectiveModal)
