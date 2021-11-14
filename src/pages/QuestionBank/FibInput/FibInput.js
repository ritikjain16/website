/* eslint-disable react/no-find-dom-node */
import React from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Icon, Slider, } from 'antd'
import StyledModal from './FibInput.style'
import validators from '../../../utils/formValidators'
import { MAX_OPTIONS_FOR_EACH_BLANK, sectionValue, MAX_DIFFICULTY_RANGE, BOLD, BLOCK } from '../../../constants/questionBank'
import { getOrderAutoComplete } from '../../../utils/data-utils'

const { FIB_INPUT, EDIT_QUESTION } = sectionValue
class FibInput extends React.Component {
  state={
    editingBlank: null,
    editingAnswerPosition: null,
    editingAnswerValue: null
  }
  componentDidMount() {
    if (this.props.id === 'EditQuestion') {
      this.setFieldsValue()
    } else {
      const { form: { setFieldsValue }, ordersInUse } = this.props
      setFieldsValue({
        order: this.props.enteredOrder ? this.props.enteredOrder : getOrderAutoComplete(ordersInUse)
      })
    }
  }
  componentDidUpdate(prevprops) {
    const { id, questionType, visible } = this.props
    if (!prevprops.visible && visible &&
      id === EDIT_QUESTION && questionType === FIB_INPUT) {
      this.setFieldsValue()
    }
  }
  setFieldsValue=() => {
    const { order, hint, difficulty, keys, answers } = this.props.defaultData
    setTimeout(() => {
      this.props.form.setFieldsValue({ order,
        hint,
        slider: difficulty || 0,
        keys,
      })
      for (let blankIndex = 0; blankIndex < keys.length; blankIndex += 1) {
        for (let answerFieldIndex = 0; answerFieldIndex < keys[blankIndex].length;
          answerFieldIndex += 1) {
          this.props.form.setFieldsValue({
            [`list[${blankIndex}][${answerFieldIndex}]`]: answers[blankIndex][answerFieldIndex]
          })
        }
      }
    }, 100)
  }
    createAnswers = (param) => {
      let allKeys = this.props.form.getFieldValue('keys')
      const keyPrev = allKeys[param]
      const keysLength = allKeys[param].length
      if (keysLength < MAX_OPTIONS_FOR_EACH_BLANK) {
        keyPrev.push(keyPrev[keysLength - 1] + 1)
        allKeys = allKeys.map((keys, index) => {
          if (index === param) {
            return keyPrev
          }
          return keys
        })
        this.props.form.setFieldsValue({
          keys: allKeys
        })
      }
    }
      removeField=async (blank, targetField) => {
        let allKeys = this.props.form.getFieldValue('keys')
        let allAnswerList = this.props.form.getFieldValue('list')
        let indexToDelete
        let keyPrev = allKeys[blank]
        let answerPrev = allAnswerList[blank]
        keyPrev = keyPrev.filter((key, ind) => {
          if (key !== targetField) {
            return true
          }
          indexToDelete = ind
          return false
        })
        answerPrev = answerPrev.filter((answer, index) => index !== indexToDelete)
        allKeys = allKeys.map((keyList, index) => {
          if (index === blank) {
            return keyPrev
          }
          return keyList
        })
        allAnswerList = allAnswerList.map((ansList, index) => {
          if (index === blank) {
            return answerPrev
          }
          return ansList
        })
        await this.props.form.setFieldsValue({
          keys: allKeys
        })
        await this.props.form.setFieldsValue({
          list: allAnswerList
        }, () => { this.answerValidation() })
      }
      validateUniqueAnswers=(blankPosition, position) => (rule, value, callback) => {
        const { editingBlank, editingAnswerPosition, editingAnswerValue } = this.state
        if (editingBlank !== null && editingAnswerPosition != null) {
          const noOfAnswers = this.props.form.getFieldValue('keys')[blankPosition].length
          const answerValues = this.props.form.getFieldValue(`list[${blankPosition}]`)
          if (blankPosition === editingBlank) {
            answerValues[editingAnswerPosition] = editingAnswerValue
          }
          answerValues.forEach((answer, index) => {
            answer = answer ? answer.trim() : answer
            value = value ? value.trim() : value
            if (answer !== undefined && index !== position &&
              answer === value && index < noOfAnswers) {
              callback('Enter unique values')
            }
          })
        }
        callback()
      }
      validateAll=async (e, blankNumber, answerPosition) => {
        await this.setState({
          editingBlank: blankNumber,
          editingAnswerPosition: answerPosition,
          editingAnswerValue: e.target.value
        }, () => {
          this.answerValidation()
        })
      }
      answerValidation=(validateOnBlur = false) => {
        const noOfBlanks = this.props.form.getFieldValue('list')
        for (let blankIndex = 0; blankIndex < noOfBlanks.length; blankIndex += 1) {
          const noOfAnswers = noOfBlanks[blankIndex].length
          for (let answerFieldIndex = 0; answerFieldIndex < noOfAnswers; answerFieldIndex += 1) {
            if (validateOnBlur) {
              this.props.form.setFieldsValue({
                [`list[${blankIndex}][${answerFieldIndex}]`]: get(noOfBlanks, `[${blankIndex}][${answerFieldIndex}]`, '').trim()
              })
            }
            this.props.form.validateFields([`list[${blankIndex}][${answerFieldIndex}]`], { force: true })
          }
        }
      }
      renderAnswerSection = () => {
        const noOfBlanks = this.props.blanks
        const temp = []
        for (let blankIndex = 0; blankIndex < noOfBlanks; blankIndex += 1) {
          this.props.form.getFieldDecorator(`keys[${blankIndex}]`, { initialValue: [1] })
          const keys = this.props.form.getFieldValue(`keys[${blankIndex}]`)
          const formItems = keys.map((key, index) => (
            [
              <StyledModal.FormItem key={key}>{
              this.props.form.getFieldDecorator(`list[${blankIndex}][${index}]`, {
                rules: [{ required: true, message: 'Enter the answer' },
                { validator: this.validateUniqueAnswers(blankIndex, index) }],
              })(
                <StyledModal.TextArea style={{ width: '150px' }}
                  placeholder={`Enter the answer ${index + 1}`}
                  onBlur={() => this.answerValidation(true)}
                  onChange={(e) => this.validateAll(e, blankIndex, index)}
                />
              )
            }
              </StyledModal.FormItem>,
              keys.length > 1 &&
              <Icon key={key + 1} type='minus-circle-o' onClick={() => this.removeField(blankIndex, key)} />
            ])
          )
          temp.push(
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '5px',
            }}
              key={blankIndex}
            >
              <StyledModal.OptionDiv>{blankIndex + 1}</StyledModal.OptionDiv>
              <div style={{ display: 'flex', overflowX: 'scroll' }}>
                {
                formItems
              }
              </div>
              <StyledModal.AddOption onClick={e => this.createAnswers(blankIndex, e)}>
                + Add answer
              </StyledModal.AddOption>
            </div>
          )
        }
        return temp
      }

  codeInsertInHint = (type) => {
    let selectStart = this.fibInputHintRef.selectionStart
    let selectEnd = this.fibInputHintRef.selectionEnd
    selectStart = this.fibInputHintRef.selectionStart
    selectEnd = this.fibInputHintRef.selectionEnd
    let hint = this.props.form.getFieldValue('hint') || ''
    if (type === BOLD) {
      hint = `${hint.substring(0, selectStart)}<code><bold>${hint.substring(
        selectStart,
        selectEnd
      )}<bold><code>${hint.substring(selectEnd)}`
    } else if (type === BLOCK) {
      hint = `${hint.substring(0, selectStart)}<code><block>${hint.substring(
        selectStart,
        selectEnd
      )}<block><code>${hint.substring(selectEnd)}`
    }
    this.props.form.setFieldsValue({ hint })
    this.fibInputHintRef.focus()
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue }, ordersInUse } = this.props
    return (
      <div>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div style={{ paddingTop: '10px', minWidth: '70px' }}>Order :</div>
          <StyledModal.FormItem >
            {
                getFieldDecorator(...validators.orderNew(ordersInUse))(
                  <StyledModal.StyledInputNumber
                    placeholder='Order'
                    type='number'
                    onChange={this.props.setEnteredOrder}
                    onBlur={() => this.props.form.setFieldsValue({ order: parseInt(getFieldValue('order') || 0, 0) })}
                  />
                )
              }
          </StyledModal.FormItem>
          <div style={{ minWidth: '25%', paddingTop: '10px', margin: '0px 10px' }}>
  Orders In Use:
          </div>
          <div style={{ paddingTop: '10px', overflowX: 'scroll' }}>
            <div style={{ display: 'flex', marginLeft: '0px' }}>{ordersInUse.join()}</div>
          </div>
        </div>


        <div style={{ display: 'flex' }}>
          <div style={{ paddingTop: '10px' }}>Difficulty: </div>
          <StyledModal.Slider >
            {
                getFieldDecorator(...validators.slider)(
                  <Slider style={{ width: '200px' }} max={MAX_DIFFICULTY_RANGE} />
                )
              }
          </StyledModal.Slider>
          <div style={{ paddingTop: '10px', margin: '0px 10px' }}>{getFieldValue('slider')}</div>
        </div>

        <div style={{ marginTop: '15px' }}>
            Correct answers for Options:
        </div>
        <div style={{ margin: '10px' }}>
          {
              this.renderAnswerSection()
            }
        </div>
        {/* <div style={{ display: 'flex' }}>
          <StyledModal.FormItem>
            {
              getFieldDecorator('hint')(
                <StyledModal.TextArea
                  innerRef={node => (this.fibInputHintRef = ReactDOM.findDOMNode(node))}
                  placeholder='Hint'
                  id='hint'
                />
              )
            }
          </StyledModal.FormItem>
          <div style={{ alignSelf: 'flex-end' }}>
            <StyledModal.BoldIcon
              type='bold'
              onMouseDown={(e) => { e.preventDefault() }}
              onClick={() => this.codeInsertInHint(BOLD)}
            />
            <StyledModal.BlockIcon
              type='bold'
              onMouseDown={(e) => { e.preventDefault() }}
              onClick={() => this.codeInsertInHint(BLOCK)}
            />
          </div>
        </div> */}
      </div>
    )
  }
}
FibInput.propTypes = {
  form: PropTypes.shape({
    getFieldValue: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func,
    validateFields: PropTypes.func.isRequired
  }).isRequired,
  ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
  blanks: PropTypes.number.isRequired,
  blankUpdate: PropTypes.func.isRequired,
  defaultData: PropTypes.shape({
    order: PropTypes.number,
    hint: PropTypes.string,
    difficulty: PropTypes.number,
    fibInputOptions: PropTypes.arrayOf(PropTypes.shape({})),
    keys: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    answers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  questionType: PropTypes.string,
  setEnteredOrder: PropTypes.func.isRequired,
  enteredOrder: PropTypes.number
}

FibInput.defaultProps = {
  questionType: '',
  enteredOrder: null
}
export default FibInput
