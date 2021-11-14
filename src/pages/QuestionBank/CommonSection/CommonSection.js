/* eslint-disable react/no-find-dom-node */
import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import ReactDOM from 'react-dom'
import { Form, Modal, Icon, Radio, message, Tooltip, Select } from 'antd'
import StyledModal from './CommonSection.style'
import validators from '../../../utils/formValidators'
import Blockly from '../Blockly'
import Mcq from '../Mcq'
import FibInput from '../FibInput/FibInput'
import FibBlock from '../FibBlock/FibBlock'
import Arrange from '../Arrange'
import { getOrderAutoComplete, getOrdersInUse, getSelectedValues } from '../../../utils/data-utils'
import { sectionValue, BOLD, BLOCK, BLANK, BLOCKLY_ENABLED_SECTIONS, BLOCKLY } from '../../../constants/questionBank'
import { encodeBase64 } from '../../../utils/base64Utility'
import { QUIZ } from '../../../constants/CourseComponents'
import removeTagMappingFromQuestion from '../../../actions/questionBank/removeTagMappingFromQuestion'
import { removeFromCourseComponent } from '../../../actions/contentMaker'

const { OptGroup, Option } = Select

const RadioGroup = Radio.Group
const { FIB_INPUT, FIB_BLOCK, MCQ, ARRANGE } = sectionValue


const iconStyle = {
  padding: '5px',
  borderRadius: '999px',
  cursor: 'pointer',
  border: '1px solid black',
  margin: '0 5px'
}

class CommonSection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blanks: 0,
      section: FIB_INPUT,
      enteredOrder: null,
      selectedQuestionLayout: 'editor',
      selectedCourse: [],
      selectedLO: [],
      hints: [
        {
          hint: '',
          hintPretext: ''
        }
      ],
      tags: []
    }
    this.mcq = React.createRef()
    this.arrange = React.createRef()
  }
  componentDidMount() {
    const { defaultData, form } = this.props
    form.setFieldsValue({
      assessmentType: defaultData.assessmentType,
      questionType: defaultData.questionType,
      explanation: defaultData.explanation,
      questionLayoutType: defaultData.questionLayoutType
    })
    this.setState({
      section: defaultData.questionType,
      selectedQuestionLayout: defaultData.questionLayoutType
    })
    if (this.props.assessmentType) {
      this.setSelectedCourse()
    }
  }
  componentDidUpdate(prevprops) {
    if (this.props.visible && !prevprops.visible) {
      this.setFieldsValues()
    }
  }
  setFieldsValues = () => {
    const { defaultData } = this.props
    const { assessmentType, questionType, learningObjective,
      statement, explanation, answerCodeSnippet, questionCodeSnippet,
      questionLayoutType, hints, tags } = defaultData
    let newHint = []
    if (get(defaultData, 'hint')) {
      newHint.push({ hint: get(defaultData, 'hint'), hintPretext: '' })
    }
    if (hints && hints.length > 0) {
      newHint = hints
    }
    if (newHint.length === 0) {
      newHint = [{ hint: '', hintPretext: '' }]
    }
    setTimeout(() => {
      this.blankUpdate(decodeURIComponent(answerCodeSnippet))
      this.props.form.setFieldsValue({
        assessmentType,
        questionType,
        learningObjective,
        statement,
        questionLayoutType,
        answerCodeSnippet: answerCodeSnippet ? decodeURIComponent(answerCodeSnippet) : '',
        explanation,
        questionCodeSnippet: questionCodeSnippet ? decodeURIComponent(questionCodeSnippet) : '',
      })
      if (assessmentType) this.setSelectedCourse()
      this.setState({
        section: defaultData.questionType,
        selectedQuestionLayout: defaultData.questionLayoutType,
        hints: newHint,
        tags: tags || []
      })
    }, 0)
  }
  title = () => [this.props.title]
  validateAnswerCodeSnippet = () => {
    this.props.form.validateFields(['answerCodeSnippet'], { force: true })
  }
  setSelectedCourse = () => {
    const { defaultData, coursesList = [], allLoList = [], contentMaker } = this.props
    if (contentMaker === QUIZ) {
      const newSelectedCourse = getSelectedValues(defaultData, coursesList, 'courses')
      const newSelectedLo = getSelectedValues(defaultData, allLoList, 'learningObjectives')
      this.setState({
        selectedCourse: newSelectedCourse,
        selectedLO: newSelectedLo
      })
    }
  }

  getSplitedValue = (value, index) => {
    if (value) {
      const splittedValue = value.split('|')
      if (splittedValue.length > 0) {
        return splittedValue[index]
      }
    }
    return ''
  }
  getLoList = () => {
    const { selectedCourse } = this.state
    const { groupedLOs } = this.props
    const newGroupedLo = Object.keys(groupedLOs).filter(key => selectedCourse.map(course => get(course, 'key')).includes(this.getSplitedValue(key, 1)))
    const newGroupedLoList = {}
    newGroupedLo.forEach(key => {
      newGroupedLoList[key] = get(groupedLOs, key) || []
    })
    return newGroupedLoList
  }
  check = () => {
    const { section, hints, tags, selectedCourse, selectedLO } = this.state
    let mcqCheckCount = 0
    if (section === MCQ) {
      const { getFieldValue } = this.props.form
      const keys = this.props.form.getFieldValue('mcqKeys')
      keys.forEach(k => {
        const value = getFieldValue(`mcqIsCorrect[${k}]`)
        if (value === true) {
          mcqCheckCount += 1
        }
      })
    }
    if (mcqCheckCount === 0 && section === MCQ) {
      this.mcq.current.mcqValidationChange(true)
      this.props.form.validateFields()
    } else {
      if (section === MCQ) {
        this.mcq.current.mcqValidationChange(false)
      }
      this.props.form.validateFields({ force: true }, async (err, val) => {
        if (!err) {
          const { onSave, topicConnectId, defaultData, removeMappingWithLo } = this.props
          const {
            order,
            learningObjective,
            questionType,
            assessmentType,
            questionLayoutType,
            statement,
            answerCodeSnippet,
            questionCodeSnippet,
            slider: difficulty,
            list,
            hint,
            mcqOptions: mcqOptionsValues,
            mcqKeys,
            mcqIsCorrect,
            blocksJSON,
            initialXML,
            fibBlockOptionValues,
            fibBlockCheckBox = [],
            arrangeKeys,
            arrangeOptions: arrangeOptionValues,
            fibBlockOptionKeys,
            explanation,
            arrangeOptionsArray
          } = val
          const fibInputOptions = []
          const mcqOptions = []
          const fibBlocksOptions = []
          const arrangeOptions = []
          if (section === FIB_INPUT) {
            if (list) {
              list.forEach((blank = [], ind) => {
                const answersOfBlank = []
                blank.forEach(answer => {
                  answersOfBlank.push(answer)
                })
                fibInputOptions.push({
                  correctPosition: ind + 1,
                  answers: answersOfBlank
                })
              })
            }
          } else if (section === FIB_BLOCK) {
            const mapKeysValues = {}
            for (let i = 0; i < fibBlockOptionKeys.length; i += 1) {
              mapKeysValues[fibBlockOptionKeys[i]] = fibBlockOptionValues[i]
            }
            fibBlockOptionValues.forEach((blockValue, index) => {
              const correctPositions = []
              fibBlockCheckBox.forEach((checkBoxRow, blankPosition) => {
                const isElementPresent = checkBoxRow.some(key => mapKeysValues[key] === blockValue)
                if (isElementPresent) {
                  correctPositions.push(blankPosition + 1)
                }
              })
              fibBlocksOptions.push({
                displayOrder: index + 1,
                statement: blockValue,
                correctPositions
              })
            })
          } else if (section === MCQ) {
            mcqKeys.forEach(k => {
              mcqOptions.push({
                statement: mcqOptionsValues ? mcqOptionsValues[`${k}`] : '',
                isCorrect: mcqIsCorrect[`${k}`],
                blocksJSON: blocksJSON ? encodeBase64(blocksJSON[`${k}`]) : null,
                initialXML: initialXML ? encodeBase64(initialXML[`${k}`]) : null
              })
            })
          } else if (section === ARRANGE) {
            arrangeKeys.forEach((key, index) => {
              const { correctPositions } = arrangeOptionsArray[key]
              arrangeOptions.push({
                displayOrder: index + 1,
                statement: arrangeOptionValues[`${key}`],
                correctPositions
              })
            })
          }
          const input = {
            id: defaultData.id,
            order,
            questionType,
            assessmentType,
            questionLayoutType,
            statement: statement.trim(),
            answerCodeSnippet: answerCodeSnippet ? encodeURIComponent(answerCodeSnippet) : '',
            questionCodeSnippet: questionCodeSnippet ? encodeURIComponent(questionCodeSnippet) : '',
            // ...(codeSnippet ? { codeSnippet: encodeURIComponent(codeSnippet) } : {}),
            difficulty,
            fibInputOptions,
            hint: hint ? hint.trim() : '',
            // ...(hint ? { hint: hint.trim() } : {}),
            mcqOptions,
            arrangeOptions,
            fibBlocksOptions,
            explanation: explanation ? explanation.trim() : '',
            hints,
            tags
            // ...(explanation ? { explanation: explanation.trim() } : {})
          }
          let response
          if (
            defaultData.learningObjective &&
            defaultData.learningObjective !== learningObjective &&
            removeMappingWithLo &&
            input.id
          ) {
            response = this.removeMappingAndUpdate(
              input,
              defaultData.learningObjective,
              learningObjective
            )
          } else {
            /* here if learning objective is not changed in edit we should not send the
           same learning objective again if sent error is raised from backend saying they
          are already connected  */
            /* if it is just addition then however it will be different from default value */
            let learningObjectiveConnectId = learningObjective
            if (defaultData.learningObjective === learningObjective) {
              learningObjectiveConnectId = null
            }
            if (assessmentType === QUIZ) {
              response = await onSave(input, selectedCourse, selectedLO)
            } else {
              response = await onSave(input, learningObjectiveConnectId, topicConnectId)
            }
          }
          if (response.id) {
            this.onCancel()
          }
        }
      })
    }
  }

  removeMappingAndUpdate = async (input, oldlearningObjectiveId, newLearningObjective) => {
    const { removeMappingWithLo, onSave } = this.props
    const hideLoadingMessage = message.loading('Updating...', 0)
    const removeMappingInput = {
      learningObjectiveId: oldlearningObjectiveId,
      questionBankId: input.id
    }
    const returnedQuestionBank = await removeMappingWithLo(removeMappingInput)
    if (returnedQuestionBank.id) {
      hideLoadingMessage()
      return onSave(input, newLearningObjective, this.props.topicConnectId)
    }
    hideLoadingMessage()
    return {}
  }

  onCancel = () => {
    this.props.form.resetFields()
    this.props.form.setFieldsValue({
      assessmentType: 'practiceQuestion',
      questionType: 'fibInput',
      questionLayoutType: 'editor',
      arrangeOptionsArray: []
    })
    this.setState({
      section: 'fibInput',
      blanks: 0,
      enteredOrder: null,
      hints: [],
      tags: [],
    })
    this.props.onCancel()
  }
  codeInsert = (type) => {
    let selectStart = this.textRef.selectionStart
    let selectEnd = this.textRef.selectionEnd
    selectStart = this.textRef.selectionStart
    selectEnd = this.textRef.selectionEnd
    let statement = this.props.form.getFieldValue('statement')
    if (type === BOLD) {
      statement = `${statement.substring(0, selectStart)}<code><bold>${statement.substring(
        selectStart,
        selectEnd
      )}</bold></code>${statement.substring(selectEnd)}`
    } else if (type === BLOCK) {
      statement = `${statement.substring(0, selectStart)}<code><block>${statement.substring(
        selectStart,
        selectEnd
      )}</block></code>${statement.substring(selectEnd)}`
    } else if (type === BLANK) {
      statement = `${statement.substring(0, selectEnd)}<code><blank></blank></code>${statement.substring(selectEnd)}`
    }
    this.props.form.setFieldsValue({ statement })
    this.textRef.focus()
  }

  codeInsertInExplanation = (type) => {
    let selectStart = this.explanationRef.selectionStart
    let selectEnd = this.explanationRef.selectionEnd
    selectStart = this.explanationRef.selectionStart
    selectEnd = this.explanationRef.selectionEnd
    let explanation = this.props.form.getFieldValue('explanation')
    if (type === BOLD) {
      explanation = `${explanation.substring(0, selectStart)}<bold>${explanation.substring(
        selectStart,
        selectEnd
      )}</bold>${explanation.substring(selectEnd)}`
    } else if (type === BLOCK) {
      explanation = `${explanation.substring(0, selectStart)}<block>${explanation.substring(
        selectStart,
        selectEnd
      )}</block>${explanation.substring(selectEnd)}`
    }
    this.props.form.setFieldsValue({ explanation })
    this.explanationRef.focus()
  }
  setEnteredOrder = value => {
    this.setState({
      enteredOrder: value
    })
  }
  setOrder = (lo, assessmentType) => {
    const ordersInUse = this.ordersInUse(this.props.questionsData, lo, assessmentType)
    const {
      form: { setFieldsValue }
    } = this.props
    this.setState({
      enteredOrder: null
    })
    setFieldsValue({
      order: getOrderAutoComplete(ordersInUse)
    })
  }

  addNewBlank = () => {
    this.setState({
      blanks: this.state.blanks + 1
    })
  }
  blankUpdate = v => {
    const regex = /___/g
    /** It won't work */
    /** const codeSnippet = this.props.form.getFieldValue('codeSnippet') */
    const noOfBlanks = ((v || '').match(regex) || []).length
    this.setState({
      blanks: noOfBlanks <= 6 ? noOfBlanks : 6
    })
  }
  ordersInUse = (questionsData, learningObjectiveId, assessmentType, id = 'AddQuestion') => {
    const { contentMaker } = this.props
    if (!contentMaker && !learningObjectiveId || questionsData.length === 0) {
      return []
    }
    if (id !== 'AddQuestion') {
      if (contentMaker) {
        const filteredQuestions = questionsData.filter(
          question =>
            question.assessmentType === assessmentType &&
            question.id !== id
        )
        return getOrdersInUse(filteredQuestions)
      }
      const filteredQuestions = questionsData.filter(
        question =>
          get(question, 'learningObjectives', []).map(lo => get(lo, 'id')).includes(learningObjectiveId) &&
          question.assessmentType === assessmentType &&
          question.id !== id
      )
      return getOrdersInUse(filteredQuestions)
    }
    if (contentMaker) {
      const filteredQuestions = questionsData.filter(
        question =>
          question.assessmentType === assessmentType
      )
      return getOrdersInUse(filteredQuestions)
    }
    const filteredQuestions = questionsData.filter(
      question =>
        get(question, 'learningObjectives', []).map(lo => get(lo, 'id')).includes(learningObjectiveId) &&
        question.assessmentType === assessmentType
    )
    return getOrdersInUse(filteredQuestions)
  }

  assessmentChange = e => {
    this.setState({ section: e.target.value })
  }

  renderDifferentSections(ordersInUse) {
    const { section, selectedQuestionLayout } = this.state
    const { contentMaker } = this.props
    if (contentMaker) ordersInUse = [...new Set(ordersInUse)]
    if (section === FIB_INPUT) {
      return (
        <FibInput
          questionsData={this.props.questionsData}
          form={this.props.form}
          validateAnswerCodeSnippet={this.validateAnswerCodeSnippet}
          ordersInUse={ordersInUse}
          blanks={this.state.blanks}
          addNewBlank={this.addNewBlank}
          blankUpdate={this.blankUpdate}
          defaultData={this.props.defaultData}
          visible={this.props.visible}
          id={this.props.id}
          questionType={this.props.defaultData.questionType}
          setEnteredOrder={this.setEnteredOrder}
          enteredOrder={parseInt(this.state.enteredOrder, 10)}
        />
      )
    } else if (section === FIB_BLOCK) {
      return (
        <FibBlock
          questionsData={this.props.questionsData}
          form={this.props.form}
          validateAnswerCodeSnippet={this.validateAnswerCodeSnippet}
          ordersInUse={ordersInUse}
          blanks={this.state.blanks}
          addNewBlank={this.addNewBlank}
          blankUpdate={this.blankUpdate}
          defaultData={this.props.defaultData}
          visible={this.props.visible}
          id={this.props.id}
          setEnteredOrder={this.setEnteredOrder}
          enteredOrder={parseInt(this.state.enteredOrder, 10)}
        />
      )
    } else if (section === ARRANGE) {
      return (
        <Arrange
          ref={this.arrange}
          form={this.props.form}
          validateAnswerCodeSnippet={this.validateAnswerCodeSnippet}
          defaultData={this.props.defaultData}
          visible={this.props.visible}
          ordersInUse={ordersInUse}
          id={this.props.id}
          setEnteredOrder={this.setEnteredOrder}
          enteredOrder={parseInt(this.state.enteredOrder, 10)}
        />
      )
    } else if (section === MCQ && selectedQuestionLayout !== BLOCKLY) {
      return (
        <Mcq
          ref={this.mcq}
          form={this.props.form}
          validateAnswerCodeSnippet={this.validateAnswerCodeSnippet}
          defaultData={this.props.defaultData}
          visible={this.props.visible}
          ordersInUse={ordersInUse}
          id={this.props.id}
          setEnteredOrder={this.setEnteredOrder}
          enteredOrder={parseInt(this.state.enteredOrder, 10)}
        />
      )
    } else if (section === MCQ && selectedQuestionLayout === BLOCKLY) {
      return (
        <Blockly
          ref={this.mcq}
          form={this.props.form}
          validateAnswerCodeSnippet={this.validateAnswerCodeSnippet}
          defaultData={this.props.defaultData}
          visible={this.props.visible}
          ordersInUse={ordersInUse}
          id={this.props.id}
          setEnteredOrder={this.setEnteredOrder}
          enteredOrder={parseInt(this.state.enteredOrder, 10)}
        />
      )
    }
    return null
  }

  onSelect = (value) => {
    const { selectedCourse } = this.state
    const courseList = [...selectedCourse, value]
    this.setState({
      selectedCourse: courseList
    })
  }

  onDeselect = (value) => {
    const { selectedCourse } = this.state
    const courseList = selectedCourse.filter(course =>
      get(course, 'key') !== get(value, 'key'))
    const { id, defaultData } = this.props
    if (id === 'EditQuestion') {
      const addedCourses = get(defaultData, 'courses', []).map(course => get(course, 'id'))
      if (addedCourses.includes(get(value, 'key'))) {
        removeFromCourseComponent(get(value, 'key'), get(defaultData, 'id'), QUIZ)
      }
    }
    this.setState({
      selectedCourse: courseList
    })
  }

  onSelectLo = (value) => {
    const { selectedLO } = this.state
    const loList = [...selectedLO, value]
    this.setState({
      selectedLO: loList
    })
  }

  onDeselectLo = (value) => {
    const { selectedLO } = this.state
    const loList = selectedLO.filter(course =>
      get(course, 'key') !== get(value, 'key'))
    this.setState({
      selectedLO: loList
    })
  }
  onUpdateHints = ({ type, index, value, field, elementRef, tag }) => {
    const { hints } = this.state
    let newHints = [...hints]
    if (type === 'add') {
      newHints = [...hints, { hint: '', hintPretext: '' }]
    } else if (type === 'remove') {
      newHints = [...hints].filter((hint, ind) => ind !== index)
    } else if (type === 'change') {
      [...hints][index][field] = value
      newHints = [...hints]
    } else if (type === 'insert') {
      const hintElement = document.getElementById(elementRef)
      if (hintElement) {
        const { selectionStart, selectionEnd } = hintElement
        let nextTextValue = ''
        if (tag === BOLD) {
          nextTextValue =
            `${value.slice(0, selectionStart)}<bold>${value.slice(selectionStart, selectionEnd)}</bold>${value.slice(selectionEnd)}`
        } else if (tag === BLOCK) {
          nextTextValue =
            `${value.slice(0, selectionStart)}<block>${value.slice(selectionStart, selectionEnd)}</block>${value.slice(selectionEnd)}`
        }
        [...hints][index].hint = nextTextValue
        hintElement.focus()
        newHints = [...hints]
      }
    }
    this.setState({
      hints: newHints
    })
  }
  render() {
    const {
      questionsData, contentTags, title,
      form: { getFieldDecorator, getFieldValue },
      contentMaker,
      defaultData: { id }
    } = this.props
    const ordersInUse = this.ordersInUse(
      questionsData,
      getFieldValue('learningObjective'),
      getFieldValue('assessmentType'),
      id
    )
    const toHideStyle = { display: contentMaker ? 'none' : 'block' }
    const { hints, tags, selectedLO, selectedCourse } = this.state
    const isEditForm = title === 'EDIT QUESTION'
    return (
      <Modal
        title={this.title()}
        visible={this.props.visible}
        onCancel={this.onCancel}
        onOk={this.check}
        style={{ top: 10 }}
        maskClosable={false}
        width='50%'
      >
        <Form onSubmit={this.check}>
          <div style={{ display: 'flex' }}>
            <StyledModal.FormItem style={toHideStyle}>
              {getFieldDecorator(...validators.assessmentType)(
                <RadioGroup
                  name='assessmentType'
                  buttonStyle='solid'
                  onChange={at =>
                    this.setOrder(getFieldValue('learningObjective'), at.target.value)
                  }
                >
                  <StyledModal.StyledRadio value='practiceQuestion'>PQ</StyledModal.StyledRadio>
                  <StyledModal.StyledRadio value='quiz'>Quiz</StyledModal.StyledRadio>
                </RadioGroup>
              )}
            </StyledModal.FormItem>
            {
              contentMaker && contentMaker === QUIZ && (
                <div style={{ width: '100%' }}>
                  <StyledModal.FormItem>
                    <StyledModal.StyledSelect
                      placeholder='Select Courses'
                      value={selectedCourse}
                      mode='multiple'
                      labelInValue
                      disabled={isEditForm}
                      onSelect={this.onSelect}
                      onDeselect={this.onDeselect}
                      style={{ width: '100%' }}
                    >
                      {get(this.props, 'coursesList', []).map(course => (
                        <Option value={course.id} key={course.id}>
                          {course.title}
                        </Option>
                    ))}
                    </StyledModal.StyledSelect>
                  </StyledModal.FormItem>
                  <StyledModal.FormItem>
                    <StyledModal.StyledSelect
                      placeholder='Select LO'
                      value={selectedLO}
                      mode='multiple'
                      labelInValue
                      disabled={isEditForm}
                      onSelect={this.onSelectLo}
                      onDeselect={this.onDeselectLo}
                      style={{ width: '100%' }}
                    >
                      {Object.keys(this.getLoList()).map((groupedLO, ind) => (
                        <OptGroup key={groupedLO} label={this.getSplitedValue(groupedLO, 0)}>
                          {
                            this.getLoList()[groupedLO].map((item, i) => (
                              <Option value={`${get(item, 'id')}|${ind}${i}`}
                                key={get(item, 'id')}
                              >{get(item, 'title')}
                              </Option>
                            ))
                          }
                        </OptGroup>))}
                    </StyledModal.StyledSelect>
                  </StyledModal.FormItem>
                </div>
              )
            }
            {
              !contentMaker && (
                <StyledModal.FormItem>
                  {
                    getFieldDecorator(...validators.learningObjective)(
                      <StyledModal.StyledSelect
                        placeholder='Select Learning Objective'
                        onChange={lo => this.setOrder(lo, getFieldValue('assessmentType'))}
                      >
                        {this.props.learningObjectives.map(loObj => (
                          <Option value={loObj.id} key={loObj.id}>
                            {loObj.title}
                          </Option>
                        ))}
                      </StyledModal.StyledSelect>
                    )
                  }
                </StyledModal.FormItem>
              )
            }
          </div>

          <StyledModal.FormItem>
            {getFieldDecorator(...validators.questionType)(
              <RadioGroup
                name='questionType'
                buttonStyle='solid'
                style={{ marginTop: '20px' }}
                onChange={e => this.assessmentChange(e)}
              >
                <StyledModal.StyledRadio value='fibInput'>FIB Input</StyledModal.StyledRadio>
                <StyledModal.StyledRadio value='fibBlock'>FIB Block</StyledModal.StyledRadio>
                <StyledModal.StyledRadio value='arrange'>Arrange</StyledModal.StyledRadio>
                <StyledModal.StyledRadio value='mcq'>MCQ</StyledModal.StyledRadio>
              </RadioGroup>
            )}
          </StyledModal.FormItem>
          <StyledModal.FormItem>
            {getFieldDecorator(...validators.questionLayoutType)(
              <RadioGroup
                name='questionLayoutType'
                buttonStyle='solid'
                style={{ marginTop: '20px' }}
                onChange={(e) => this.setState({
                  selectedQuestionLayout: e.target.value
                })}
              >
                <StyledModal.StyledRadio value='editor'>code</StyledModal.StyledRadio>
                <StyledModal.StyledRadio value='text'>text</StyledModal.StyledRadio>
                {BLOCKLY_ENABLED_SECTIONS.includes(this.state.section) && (
                  <StyledModal.StyledRadio value='blockly'>blockly</StyledModal.StyledRadio>
                )}
              </RadioGroup>
            )}
          </StyledModal.FormItem>
          <div style={{ display: 'flex' }}>
            <StyledModal.FormItem>
              {getFieldDecorator(...validators.statement)(
                <StyledModal.TextArea
                  innerRef={node => (this.textRef = ReactDOM.findDOMNode(node))}
                  onBlur={() => this.props.form.setFieldsValue({ statement: getFieldValue('statement').trim() })}
                  placeholder='Add Question'
                />
              )}
            </StyledModal.FormItem>
            <div style={{ alignSelf: 'flex-end' }}>
              <StyledModal.BoldIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.codeInsert(BOLD)}
              />
              <StyledModal.BlockIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.codeInsert(BLOCK)}
              />
              <StyledModal.MinusIcon
                type='minus'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.codeInsert(BLANK)}
              />
            </div>
          </div>
          <div>
            <StyledModal.FormItem>
              {
                getFieldDecorator('questionCodeSnippet')(
                  <StyledModal.TextArea placeholder='Enter question code snippet'
                    rows={5}
                    onBlur={() => this.props.form.setFieldsValue({ questionCodeSnippet: getFieldValue('questionCodeSnippet').trim() })}
                  />
                )
              }
            </StyledModal.FormItem>
          </div>
          <div>
            <StyledModal.FormItem>
              {
                getFieldDecorator(...validators.answerCodeSnippet(this.state.section,
                  this.props.form))(
                    <StyledModal.TextArea placeholder='Enter answer code snippet(To add a blank or block)'
                      onBlur={() => this.props.form.setFieldsValue({ answerCodeSnippet: getFieldValue('answerCodeSnippet').trim() })}
                      onChange={(event) => this.blankUpdate(event.target.value)}
                      rows={5}
                    />
                )
              }
            </StyledModal.FormItem>
          </div>
          {this.renderDifferentSections(ordersInUse)}
          <div>
            <h2>Hints: </h2>
            {
              hints.map((hint, ind) => (
                <>
                  <h4>Hint {ind + 1} <Icon
                    type='close'
                    style={iconStyle}
                    onClick={() => this.onUpdateHints({
                      type: 'remove',
                      index: ind
                    })}
                  />
                  </h4>
                  <div style={{ display: 'flex' }}>
                    <StyledModal.FormItem>
                      <StyledModal.TextArea
                        placeholder='Enter the Hint'
                        id={`hint${ind}`}
                        value={get(hint, 'hint')}
                        onChange={({ target: { value } }) => this.onUpdateHints({
                          type: 'change',
                          index: ind,
                          value,
                          field: 'hint'
                        })}
                      />
                    </StyledModal.FormItem>
                    <div style={{ alignSelf: 'flex-end' }}>
                      <StyledModal.BoldIcon
                        type='bold'
                        onMouseDown={(e) => { e.preventDefault() }}
                        onClick={() => this.onUpdateHints({
                          type: 'insert',
                          index: ind,
                          value: get(hint, 'hint'),
                          tag: BOLD,
                          elementRef: `hint${ind}`
                        })}
                      />
                      <StyledModal.BlockIcon
                        type='bold'
                        onMouseDown={(e) => { e.preventDefault() }}
                        onClick={() => this.onUpdateHints({
                          type: 'insert',
                          index: ind,
                          value: get(hint, 'hint'),
                          tag: BLOCK,
                          elementRef: `hint${ind}`
                        })}
                      />
                    </div>
                  </div>
                  <StyledModal.FormItem style={{ width: '89%' }}>
                    <StyledModal.TextArea
                      placeholder='Hint Pretext'
                      value={get(hint, 'hintPretext')}
                      onChange={({ target: { value } }) => this.onUpdateHints({
                        type: 'change',
                        index: ind,
                        value,
                        field: 'hintPretext'
                      })}
                    />
                  </StyledModal.FormItem>
                  </>
              ))
            }
            <div style={{ display: 'flex', justifyContent: 'center', width: '89%' }}>
              <Tooltip title='Add new Hint'>
                <Icon
                  type='plus'
                  style={iconStyle}
                  onClick={() => this.onUpdateHints({ type: 'add' })}
                />
              </Tooltip>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
            <Select
              style={{ marginBottom: '10px', width: 200 }}
              showSearch
              filterOption={(inputValue, option) => (
                option.props.children &&
                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
              )}
              placeholder='Search Tags'
              onSelect={(value) => {
                this.setState({
                  tags: [...tags, contentTags.find(({ id: tagId }) => tagId === value)]
                })
              }}
            >
              {
                contentTags && contentTags.length > 0 &&
                  contentTags.filter(t => ![...tags.map((tag) => tag.id)]
                    .includes(t.id)).map((tag) => (
                      <Select.Option value={tag.id} key={tag.id} >{tag.title}</Select.Option>
                    ))
              }
            </Select>
            <div style={{ display: 'flex', flexWrap: 'wrap' }} >
              {tags && tags.map((tag) => (
                <StyledModal.TagBox key={tag.id} color='#750000' >
                  <Icon type='close'
                    style={{ visibility: 'visible' }}
                    onClick={() => {
                      this.setState({
                        tags: tags.filter(t => t.id !== tag.id)
                      })
                      if (isEditForm && id) {
                        removeTagMappingFromQuestion(id, tag.id)
                      }
                    }}
                  />
                  {tag.title}
                </StyledModal.TagBox>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <StyledModal.FormItem>
              {
              getFieldDecorator('explanation')(
                <StyledModal.TextArea
                  innerRef={node => (this.explanationRef = ReactDOM.findDOMNode(node))}
                  placeholder='Enter the Explanation'
                />
              )
            }
            </StyledModal.FormItem>
            <div style={{ alignSelf: 'flex-end' }}>
              <StyledModal.BoldIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.codeInsertInExplanation(BOLD)}
              />
              <StyledModal.BlockIcon
                type='bold'
                onMouseDown={(e) => { e.preventDefault() }}
                onClick={() => this.codeInsertInExplanation(BLOCK)}
              />
            </div>
          </div>
        </Form>
      </Modal>
    )
  }
}
CommonSection.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  questionsData: PropTypes.arrayOf(PropTypes.shape({})),
  learningObjectives: PropTypes.arrayOf(PropTypes.shape({})),
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired
  }).isRequired,
  onSave: PropTypes.func,
  topicConnectId: PropTypes.string.isRequired,
  defaultData: PropTypes.shape({
    questionType: PropTypes.string,
    answerCodeSnippet: PropTypes.string,
    questionCodeSnippet: PropTypes.string,
    questionLayoutType: PropTypes.string
  }).isRequired,
  id: PropTypes.string.isRequired,
  removeMappingWithLo: PropTypes.func,
}
CommonSection.defaultProps = {
  questionsData: [],
  onSave: () => { },
  learningObjectives: [],
  removeMappingWithLo: () => { }
}
export default Form.create()(CommonSection)
