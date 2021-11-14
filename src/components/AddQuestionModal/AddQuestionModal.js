import React from 'react'
import { Form, Select, Collapse, message } from 'antd'
import { PropTypes } from 'prop-types'
import validators from '../../utils/formValidators'
import QuestionModal from './AddQuestionModal.style'
import ModalFooter from '../ModalFooter'
import NUMBER_OF_OPTIONS from '../../constants/questionModal'

/**
* it is responsible for rendering Add Question button  and modal
* when Add Question Button is clicked
*/
class AddQuestionModal extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    /** onSave function called when form is Submitted successfully */
    onSave: PropTypes.func.isRequired,
    /** array of orders which are already in use in PracticeQuestions */
    ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
    /** concepts are array of different conceptCards in the current topic */
    concepts: PropTypes.arrayOf(PropTypes.object),
    /** onCancel function which handles the closing of the modal */
    onCancel: PropTypes.func.isRequired,
    /** visible is boolean to know whether is to be visible i.e open or not */
    visible: PropTypes.bool.isRequired,
    /** headerText is the text to be displayed on the top of the modal */
    headerText: PropTypes.string.isRequired,
    /** isPracticeQuestions is the boolean value to determine if the
     *  route is practice-questions or quiz
    */
    isPracticeQuestions: PropTypes.bool,
    /** it is the antd from injected as a prop */
    form: PropTypes.shape({
      /** it is function to reset all the fields in the form */
      resetFields: PropTypes.func.isRequired
    }).isRequired,
    validationOptionError: PropTypes.string,
    setOptionValidationError: PropTypes.func.isRequired,
    defaultValues: PropTypes.shape({}).isRequired,
    isLoading: PropTypes.bool.isRequired,
    removeMappingWithConceptCard: PropTypes.func,
    learningObjectives: PropTypes.arrayOf(PropTypes.object),
    topicConnectId: PropTypes.string
  }

  static defaultProps = {
    /** default value of isPracticeQuestions is set to false */
    isPracticeQuestions: false,
    validationOptionError: null,
    removeMappingWithConceptCard: () => {},
    concepts: [],
    learningObjectives: [],
    id: '',
    topicConnectId: ''
  }


  componentDidUpdate(prevProps) {
    if (this.props.visible === false && prevProps.visible === true) {
      this.resetModalFields()
    }
    if (this.props.visible === true && prevProps.visible === false) {
      this.setDefaultValues()
    }
  }

  setDefaultValues() {
    const { form, defaultValues } = this.props
    const { questionStatement, order,
      type, logicalExplanation, conceptCard, options, learningObjective } = defaultValues
    form.setFieldsValue({
      questionStatement,
      order,
      type,
      logicalExplanation,
      conceptCard,
      learningObjective
    })
    for (let i = 1; options && i <= options.length; i += 1) {
      const isChecked = options[i - 1].isCorrect === true
      form.setFieldsValue({
        [`optionInput${i}`]: options[i - 1].statement || '',
        [`optionExplanation${i}`]: options[i - 1].explanation || '',
        [`optionIstrue${i}`]: isChecked
      })
    }
  }

  validateOptions=(values) => {
    for (let i = 1; i <= NUMBER_OF_OPTIONS; i += 1) {
      if ((values[`optionInput${i}`] === '') && (values[`optionExplanation${i}`] !== '' || values[`optionIstrue${i}`] === true)) {
        this.props.setOptionValidationError(`optionStament cannot be empty in option ${i}`)
        return false
      }
    }
    return true
  }

  handleSave = (values) => {
    const { onSave, defaultValues, isPracticeQuestions,
      removeMappingWithConceptCard, topicConnectId } = this.props
    if (this.validateOptions(values)) {
      const { questionStatement, order, type, logicalExplanation,
        conceptCard, learningObjective } = values
      const { id } = defaultValues
      const options = []
      for (let i = 1; i <= NUMBER_OF_OPTIONS; i += 1) {
        const option = {}
        if (values[`optionInput${i}`] && values[`optionInput${i}`] !== '') {
          Object.assign(option, { statement: values[`optionInput${i}`] })
        }
        if (values[`optionExplanation${i}`] && values[`optionExplanation${i}`] !== '') {
          Object.assign(option, { explanation: values[`optionExplanation${i}`] })
        }
        if ((values[`optionInput${i}`] && values[`optionInput${i}`] !== '') || (values[`optionExplanation${i}`] && values[`optionExplanation${i}`] !== '')) {
          Object.assign(option, { isCorrect: values[`optionIstrue${i}`] })
          options.push(option)
        }
      }
      // topicConnectId is to be taken from this.match.param.id
      const input = {
        id,
        order,
        type,
        statement: questionStatement,
        explanation: logicalExplanation,
        conceptCardConnectId: (defaultValues.conceptCard !== conceptCard)
          ? conceptCard
          : null,
        options,
        learningObjectivesConnectId: (defaultValues.learningObjective !== learningObjective)
          ? learningObjective
          : null,
        topicConnectId
      }
      // this condition checks for practiceQuestions
      if (isPracticeQuestions === true) {
        /* here removeMappingAndUpdatePracticeQuestion is called only when the conceptCard
         is changed in the modal here additional checks are made just to ensure it doesn't break
         down else if 1)conceptCard is not changed the we do normal update of practiceQuestion
        2) or if it is just the addition of new PracticeQuestion the corresponding action is
        called  */
        if (defaultValues.conceptCard !== conceptCard && defaultValues.conceptCard &&
          removeMappingWithConceptCard && input.id) {
          this.removeMappingAndUpdatePracticeQuestion(input, defaultValues.conceptCard)
        } else {
          onSave(input)
        }
      } else {
        onSave(input)
      }
    }
  }

  /* This function is asynchronous. It tries to remove the connection of PracticeQuestion
 with which it is currently connected if the connection is removed successfully then
 action for updation is called */
  async removeMappingAndUpdatePracticeQuestion(input, conceptCardId) {
    const { removeMappingWithConceptCard, onSave } = this.props
    const hideLoadingMessage = message.loading('Updating...', 0)
    const removeMappingInput = {
      conceptCardId,
      practiceQuestionId: input.id
    }
    const returnedPracticeQuestion = await removeMappingWithConceptCard(removeMappingInput)
    if (returnedPracticeQuestion.id) {
      hideLoadingMessage()
      onSave(input)
    } else {
      hideLoadingMessage()
    }
  }


  checkValidations = e => {
    const { form } = this.props
    e.preventDefault()
    form.validateFields((err, values) => {
      if (!err) {
        this.handleSave(values)
      }
    })
  }

  resetModalFields = () => {
    this.props.form.resetFields()
  }

  renderOptions = () => {
    const renderOptions = []
    const { form } = this.props
    const { Panel } = Collapse
    for (let i = 1; i <= NUMBER_OF_OPTIONS; i += 1) {
      renderOptions.push(
        <Panel header={`Option${i}`} key={i}>
          <QuestionModal.OptionGrouping>
            <QuestionModal.FormItem>
              {form.getFieldDecorator(...validators.optionIsTrue[i - 1])(
                <QuestionModal.StyledCheckBox />
              )}
            </QuestionModal.FormItem>
            <div>
              <QuestionModal.FormItem>
                {form.getFieldDecorator(...validators.optionInput[i - 1])(
                  <QuestionModal.OptionInput
                    autosize={{ minRows: 2 }}
                    placeholder={`option ${i}`}
                  />
                )}
              </QuestionModal.FormItem>
              <QuestionModal.FormItem>
                {form.getFieldDecorator(...validators.optionExplanation[i - 1])(
                  <QuestionModal.OptionExplanation
                    autosize={{ minRows: 2 }}
                    placeholder={`Explanation ${i}`}
                  />
                )}
              </QuestionModal.FormItem>
            </div>
          </QuestionModal.OptionGrouping>
        </Panel>
      )
    }
    return renderOptions
  }

  render() {
    const {
      id,
      visible,
      onCancel,
      concepts,
      ordersInUse,
      validationOptionError,
      form,
      isLoading,
      learningObjectives
    } = this.props
    const { Option } = Select
    return (
      <div>
        <QuestionModal
          visible={visible}
          onOk={this.handleOk}
          style={{ top: 60 }}
          onCancel={onCancel}
          footer={null}
        >
          <QuestionModal.HeaderText>{this.props.headerText}</QuestionModal.HeaderText>
          <Form onSubmit={this.checkValidations} id={id}>
            <QuestionModal.SingleRow>
              <div>
                {
            (this.props.isPracticeQuestions) ?
              <QuestionModal.FormItem>
                {form.getFieldDecorator(...validators.conceptCard)(
                  <QuestionModal.Dropdown placeholder='Select Concept'>
                    {concepts.map((concept) => (
                      <Option key={concept.id} value={concept.id}>{concept.title}</Option>
                    ))}
                  </QuestionModal.Dropdown>
                      )}
              </QuestionModal.FormItem> :
              <QuestionModal.FormItem>
                {form.getFieldDecorator(...validators.learningObjective)(
                  <QuestionModal.Dropdown placeholder='Select LO' >
                    {learningObjectives.map((learningObjective) => (
                      <Option key={learningObjective.id} value={learningObjective.id}>
                        {learningObjective.title}
                      </Option>
                ))
                }
                  </QuestionModal.Dropdown>
                )}
              </QuestionModal.FormItem>
          }
              </div>
              <div>
                <QuestionModal.FormItem>
                  {form.getFieldDecorator(...validators.type)(
                    <QuestionModal.Dropdown placeholder='Select Type' >
                      <Option key='mcq' value='mcq'>MCQ</Option>
                    </QuestionModal.Dropdown>
                  )}
                </QuestionModal.FormItem>
              </div>
              <QuestionModal.FormItem>
                {form.getFieldDecorator(...validators.order(ordersInUse))(
                  <QuestionModal.StyledInput
                    placeholder='Order'
                    id='orderInput'
                    type='number'
                  />
                )}
              </QuestionModal.FormItem>
            </QuestionModal.SingleRow>
            <QuestionModal.QuestionHeading>Question Section</QuestionModal.QuestionHeading>
            <QuestionModal.FormItem>
              {form.getFieldDecorator(...validators.questionStatement)(
                <QuestionModal.StyledTextArea
                  autosize={{ minRows: 2 }}
                  placeholder='Question Statement'
                  id='questionStatement'
                />
              )}
            </QuestionModal.FormItem>
            <QuestionModal.FormItem>
              {form.getFieldDecorator(...validators.logicalExplanation)(
                <QuestionModal.StyledTextArea
                  autosize={{ minRows: 2 }}
                  placeholder='Logical Explanation'
                  id='logicalExplanation'
                />
              )}
            </QuestionModal.FormItem>
            <QuestionModal.StyledOptions>
              <QuestionModal.OptionsHeading>Option Section</QuestionModal.OptionsHeading>
              <QuestionModal.ErrorText>{(validationOptionError !== null) &&
                <div>{validationOptionError}</div>}
              </QuestionModal.ErrorText>
              <Collapse bordered={false} accordion>
                {this.renderOptions()}
              </Collapse>
            </QuestionModal.StyledOptions>
            <ModalFooter id={id} isLoading={isLoading} handleCancel={onCancel} />
          </Form>
        </QuestionModal>
      </div>
    )
  }
}

export default Form.create()(AddQuestionModal)
