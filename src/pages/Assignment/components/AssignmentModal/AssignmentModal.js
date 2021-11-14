/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Button, Form, Slider, Radio } from 'antd'
import MainModal from '../../../../components/MainModal'
import validators from '../../../../utils/formValidators'
import { BLOCK, BOLD, MAX_DIFFICULTY_RANGE } from '../../../../constants/questionBank'
import StyledAssignment from './AssignmentModal.style'
import addAssignment from '../../../../actions/assignment/addAssignment'
import updateAssignment from '../../../../actions/assignment/updateAssignment'
import addCodeTags from '../../../../utils/parsers/addCodeTags'

const RadioGroup = Radio.Group

const getDecodedValue = (val) => {
  let decodedVal = ''
  if (val) {
    if (/\s/.test(val)) {
      decodedVal = val
    } else {
      try {
        decodedVal = decodeURIComponent(val)
      } catch (err) {
        decodedVal = val
      }
    }
  }

  return decodedVal
}

class AssignmentModal extends Component {
  setDefaultValues = () => {
    const { assignment, form } = this.props
    form.setFieldsValue({
      statement: assignment.statement,
      assignmentCodeSnippet: getDecodedValue(assignment.questionCodeSnippet),
      assignmentAnswerCodeSnippet: getDecodedValue(assignment.answerCodeSnippet),
      slider: assignment.difficulty ? assignment.difficulty : 0,
      order: assignment.order,
      hint: assignment.hint,
      explanation: assignment.explanation,
      assignmentType: assignment.isHomework ? 'true' : 'false'
    })
  }

  componentDidUpdate(prevProps) {
    const { ordersInUse, form } = this.props
    if (this.props.addingAssignment && !prevProps.addingAssignment) {
      form.setFieldsValue({
        order: ordersInUse.length !== 0 ?
          ordersInUse[ordersInUse.length - 1] + 1 : 1,
        assignmentType: 'false'
      })
    }
    if (this.props.editingAssignment && !prevProps.editingAssignment) {
      this.setDefaultValues()
    }
    const { errors, notification } = this.props
    if (prevProps.hasAssignmentAddFailed !== this.props.hasAssignmentAddFailed) {
      if (this.props.hasAssignmentAddFailed) {
        const currentError = (errors.toJS()['assignmentQuestion/add']).pop()
        notification.close('loadingMessage')
        notification.error({
          message: currentError.error.errors[0].message
        })
      }
    }
    if (prevProps.isAssignmentAdded !== this.props.isAssignmentAdded) {
      if (this.props.isAssignmentAdded) {
        notification.close('loadingMessage')
        notification.success({
          message: 'Assignment added successfully!'
        })
        this.onCancel()
      }
    }
    if (prevProps.hasAssignmentUpdateFailed !== this.props.hasAssignmentUpdateFailed) {
      if (this.props.hasAssignmentUpdateFailed) {
        const currentError = (errors.toJS()['assignmentQuestion/update']).pop()
        notification.close('loadingMessage')
        notification.error({
          message: currentError.error.errors[0].message
        })
      }
    }
    if (prevProps.isAssignmentUpdated !== this.props.isAssignmentUpdated) {
      if (this.props.isAssignmentUpdated) {
        notification.close('loadingMessage')
        notification.success({
          message: 'Assignment updated successfully!'
        })
        this.onCancel()
      }
    }
  }

  insetTags = (ref, fieldName, tag) => {
    const originalText = this.props.form.getFieldValue(fieldName)
    const fieldsValue = {}
    const parsedText = addCodeTags(ref, originalText, tag)
    fieldsValue[fieldName] = parsedText
    this.props.form.setFieldsValue(fieldsValue)
  }

  onCancel = () => {
    const { closeModal, form } = this.props
    form.resetFields()
    closeModal()
  }

  onSave = () => {
    this.props.form.validateFields(async (err, values) => {
      const { topicId } = this.props
      const { statement, assignmentCodeSnippet, slider,
        assignmentAnswerCodeSnippet, order, hint, explanation, assignmentType
      } = values
      if (!err) {
        if (this.props.addingAssignment) {
          const addInput = {
            statement,
            questionCodeSnippet: assignmentCodeSnippet ? encodeURIComponent(assignmentCodeSnippet) : '',
            answerCodeSnippet: assignmentAnswerCodeSnippet ? encodeURIComponent(assignmentAnswerCodeSnippet) : '',
            difficulty: slider,
            order,
            hint,
            explanation,
            status: 'unpublished',
            isHomework: assignmentType === 'true'
          }
          addAssignment(addInput, topicId)
        } else if (this.props.editingAssignment) {
          const { assignment } = this.props
          const updateInput = {
            statement: statement || '',
            questionCodeSnippet: assignmentCodeSnippet ? encodeURIComponent(assignmentCodeSnippet) : '',
            answerCodeSnippet: assignmentAnswerCodeSnippet ? encodeURIComponent(assignmentAnswerCodeSnippet) : '',
            difficulty: slider,
            order,
            hint: hint || '',
            explanation: explanation || '',
            isHomework: assignmentType === 'true'
          }
          updateAssignment(updateInput, assignment.id)
        }
      }
    })
  }

  render() {
    const { id, visible, title, ordersInUse, isAssignmentAdding, isAssignmentUpdating,
      form: { getFieldDecorator, getFieldValue
      }, editingAssignment, assignment } = this.props
    if (editingAssignment) {
      const order = assignment ? assignment.order : 0
      for (let index = 0; index < ordersInUse.length; index += 1) {
        if (order === ordersInUse[index]) {
          ordersInUse.splice(index, 1)
        }
      }
    }

    return (
      <MainModal
        visible={visible}
        title={title}
        onCancel={() => this.onCancel()}
        maskClosable={false}
        footer={[
          <Button onClick={this.onCancel}>CANCEL</Button>,
          <MainModal.SaveButton
            type='primary'
            htmlType='submit'
            form={id}
            onClick={this.onSave}
          > {isAssignmentAdding || isAssignmentUpdating ? 'Saving...' : 'SAVE'}
          </MainModal.SaveButton>
        ]}
      >
        <Form>
          <div>
            <StyledAssignment.FormItem>
              {getFieldDecorator(...validators.assignmentType)(
                <RadioGroup
                  name='assignmentType'
                  buttonStyle='solid'
                >
                  <StyledAssignment.StyledRadio value='true'>Yes</StyledAssignment.StyledRadio>
                  <StyledAssignment.StyledRadio value='false'>No</StyledAssignment.StyledRadio>
                </RadioGroup>
              )}
            </StyledAssignment.FormItem>
          </div>
          <div style={{ display: 'flex' }}>
            <StyledAssignment.FormItem>
              {getFieldDecorator(...validators.statement)(
                <StyledAssignment.TextArea
                  placeholder='Enter Question'
                  innerRef={node => (this.statementRef = ReactDOM.findDOMNode(node))}
                />
              )}
            </StyledAssignment.FormItem>
            <div style={{ alignSelf: 'flex-end' }}>
              <StyledAssignment.BoldIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.insetTags(this.statementRef, 'statement', BOLD)}
              />
              <StyledAssignment.BlockIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.insetTags(this.statementRef, 'statement', BLOCK)}
              />
            </div>
          </div>
          <div
            style={{
                marginTop: '15px'
              }}
          >
            <StyledAssignment.FormItem>
              {
                getFieldDecorator('assignmentCodeSnippet')(
                  <StyledAssignment.TextArea placeholder='Enter Question code snippet'
                    rows={5}
                  />
                )
              }
            </StyledAssignment.FormItem>
          </div>
          <div
            style={{
                marginTop: '15px'
              }}
          >
            <StyledAssignment.FormItem>
              {
                getFieldDecorator('assignmentAnswerCodeSnippet')(
                  <StyledAssignment.TextArea placeholder='Enter Answer code snippet'
                    rows={5}
                  />
                )
              }
            </StyledAssignment.FormItem>
          </div>
          <div
            style={{
                marginTop: '15px'
              }}
          >
            <StyledAssignment.SliderWrapper>
              <div style={{ paddingTop: '10px' }}>Difficulty: </div>
              <div >
                <StyledAssignment.Slider>
                  {getFieldDecorator(...validators.slider)(<Slider style={{ width: '200px' }} max={MAX_DIFFICULTY_RANGE} />)}
                </StyledAssignment.Slider>
              </div>
              <div style={{ paddingTop: '10px', marginLeft: '10px' }}>{getFieldValue('slider')}</div>
            </StyledAssignment.SliderWrapper>
          </div>
          <div
            style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
          >
            <div
              style={{
                  marginTop: '15px',
                  width: '200px'
                }}
            >
              {
                !this.props.editingAssignment ?
                  <StyledAssignment.FormItem>
                    {getFieldDecorator(...validators.order(ordersInUse, 100))(
                      <StyledAssignment.Input
                        placeholder='Order'
                        id='orderInput'
                        type='number'
                      />
                      )}
                  </StyledAssignment.FormItem>
                    :
                  <StyledAssignment.FormItem>
                    {getFieldDecorator(...validators.order(ordersInUse, 100))(
                      <StyledAssignment.Input
                        placeholder='Order'
                        id='orderInput'
                        type='number'
                      />
                      )}
                  </StyledAssignment.FormItem>
              }
            </div>
            <div
              style={{
                  width: '200px'
                }}
            >
              <StyledAssignment.FormItem>
                <StyledAssignment.OrderHelperText>Orders in use: {ordersInUse.join(',')}</StyledAssignment.OrderHelperText>
              </StyledAssignment.FormItem>
            </div>
          </div>
          <div
            style={{
                display: 'flex',
                marginTop: '15px'
              }}
          >
            <StyledAssignment.FormItem>
              {
                getFieldDecorator('hint')(
                  <StyledAssignment.TextArea
                    placeholder='Hint'
                    id='hint'
                    innerRef={node => (this.hintRef = ReactDOM.findDOMNode(node))}
                  />
                )
              }
            </StyledAssignment.FormItem>
            <div style={{ alignSelf: 'flex-end' }}>
              <StyledAssignment.BoldIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.insetTags(this.hintRef, 'hint', BOLD)}
              />
              <StyledAssignment.BlockIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.insetTags(this.hintRef, 'hint', BLOCK)}
              />
            </div>
          </div>
          <div
            style={{
                display: 'flex',
                marginTop: '15px'
              }}
          >
            <StyledAssignment.FormItem>
              {
                getFieldDecorator('explanation')(
                  <StyledAssignment.TextArea
                    placeholder='Enter the Explanation'
                    innerRef={node => (this.explanationRef = ReactDOM.findDOMNode(node))}
                  />
                )
              }
            </StyledAssignment.FormItem>
            <div style={{ alignSelf: 'flex-end' }}>
              <StyledAssignment.BoldIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.insetTags(this.explanationRef, 'explanation', BOLD)}
              />
              <StyledAssignment.BlockIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.insetTags(this.explanationRef, 'explanation', BLOCK)}
              />
            </div>
          </div>
        </Form>
      </MainModal>
    )
  }
}

AssignmentModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    validateFields: PropTypes.func,
    setFieldsValue: PropTypes.func,
    getFieldValue: PropTypes.func
  }).isRequired,
  addingAssignment: PropTypes.bool.isRequired,
  updatingAssignment: PropTypes.bool.isRequired,
  ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
  editingAssignment: PropTypes.bool.isRequired,
  assignments: PropTypes.shape([]),
  isAssignmentAdding: PropTypes.bool.isRequired,
  errors: PropTypes.shape([]),
  notification: PropTypes.shape({}).isRequired,
  hasAssignmentAddFailed: PropTypes.bool.isRequired,
  isAssignmentAdded: PropTypes.bool.isRequired,
  assignment: PropTypes.shape({}),
  isAssignmentUpdating: PropTypes.bool.isRequired,
  hasAssignmentUpdateFailed: PropTypes.bool.isRequired,
  isAssignmentUpdated: PropTypes.bool.isRequired,
  topicId: PropTypes.string.isRequired
}

AssignmentModal.defaultProps = {
  assignments: [],
  errors: [],
  assignment: {}
}

export default Form.create()(AssignmentModal)
