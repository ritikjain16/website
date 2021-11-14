/* eslint-disable react/no-find-dom-node */
import React from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Icon, Slider, Checkbox } from 'antd'
import StyledModal from './FibBlock.style'
import validators from '../../../utils/formValidators'
import { getOrderAutoComplete } from '../../../utils/data-utils'
import { MAX_BLOCKS_COUNT, MIN_BLOCKS_COUNT, MAX_DIFFICULTY_RANGE, BOLD, BLOCK } from '../../../constants/questionBank'

const { platform } = navigator
class FibBlock extends React.Component {
  fibBlockUniqueKey = MIN_BLOCKS_COUNT
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
    if (!prevprops.visible && this.props.visible && this.props.id === 'EditQuestion') {
      this.setFieldsValue()
    }
  }
  setFieldsValue=() => {
    const { order, hint, difficulty, fibBlocksOptions } = this.props.defaultData
    const fibBlockStatements = fibBlocksOptions.map(fibBlock => fibBlock.statement)
    const statementsCount = fibBlockStatements.length
    const keysForEditQuestion = []
    this.fibBlockUniqueKey = 0
    for (let j = 0; j < statementsCount; j += 1) {
      keysForEditQuestion.push(this.fibBlockUniqueKey)
      this.fibBlockUniqueKey += 1
    }
    setTimeout(() => {
      this.props.form.setFieldsValue({ order,
        hint,
        slider: difficulty || 0,
        fibBlockOptionKeys: keysForEditQuestion
      })
      for (let j = 0; j < statementsCount; j += 1) {
        this.props.form.setFieldsValue({
          [`fibBlockOptionValues[${j}]`]: fibBlockStatements[j] || ''
        })
      }
      for (let j = 0; j < this.props.blanks; j += 1) {
        const tempList = []
        fibBlocksOptions.forEach((block, index) => {
          if (block.correctPositions.includes(j + 1)) {
            tempList.push(index)
          }
        })
        this.props.form.setFieldsValue({
          [`fibBlockCheckBox[${j}]`]: tempList
        })
      }
    }, 0)
  }
  createOptions = () => {
    const { getFieldValue } = this.props.form
    const keys = getFieldValue('fibBlockOptionKeys')
    if (keys.length < MAX_BLOCKS_COUNT) {
      keys.push(this.fibBlockUniqueKey)
      this.fibBlockUniqueKey += 1
      this.props.form.setFieldsValue({
        fibBlockOptionKeys: keys
      })
      this.props.validateAnswerCodeSnippet()
    }
  }

  removeOptions=(target) => {
    const keys = this.props.form.getFieldValue('fibBlockOptionKeys')
    const optionValues = this.props.form.getFieldValue('fibBlockOptionValues')
    const checkBoxValues = this.props.form.getFieldValue('fibBlockCheckBox')
    let indexToDelete
    const modifiedKeys = keys.filter((key, index) => {
      if (key !== target) {
        return true
      }
      indexToDelete = index
      return false
    })
    const modifiedValues = optionValues.filter((answer, index) => {
      if (index !== indexToDelete) {
        return true
      }
      return false
    })
    let modifiedCheckBoxValues
    if (checkBoxValues !== undefined && checkBoxValues !== null) {
      modifiedCheckBoxValues = checkBoxValues.map(checkBoxRow =>
        checkBoxRow && checkBoxRow.filter(checkBoxValue => checkBoxValue !== target))
    }
    this.props.form.setFieldsValue({
      fibBlockOptionKeys: modifiedKeys,
      fibBlockOptionValues: modifiedValues,
      fibBlockCheckBox: modifiedCheckBoxValues
    }, () => { this.props.form.validateFields({ force: true }) })
  }
  validateAll= () => {
    this.props.form.validateFields(['fibBlockOptionValues'], { force: true })
    this.validateOptionsValue()
  }
  validateOptionsValue = () => {
    this.props.form.validateFields((_, values) => {
      const blockValues = get(values, 'fibBlockOptionValues', [])
      blockValues.forEach((__, ind) => {
        blockValues[ind] = get(blockValues, `[${ind}]`, '').trim()
      })
      this.props.form.setFieldsValue({ fibBlockOptionValues: blockValues })
    })
  }
  renderOptionSection=() => {
    const { getFieldDecorator, getFieldValue } = this.props.form
    getFieldDecorator('fibBlockOptionKeys', { initialValue: [0, 1] })
    const keys = getFieldValue('fibBlockOptionKeys')
    const formItems = keys.map((key, index) => (
      <div key={key} style={{ display: 'flex' }}>
        <StyledModal.FormItem>
          {this.props.form.getFieldDecorator(`fibBlockOptionValues[${index}]`, {
              rules: [
                { required: true, message: 'Enter the block value' },
              ]
          })(
            <StyledModal.Input placeholder='Enter the block value'
              onChange={(e) => {
                this.validateAll(e, index)
              }}
              onBlur={() => this.validateOptionsValue()}
            />
          )}
        </StyledModal.FormItem>
        {keys.length > MIN_BLOCKS_COUNT &&
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Icon style={{ fontSize: '20px', marginLeft: '10px' }}key={`${key}dIcon`} type='minus-circle-o' onClick={() => this.removeOptions(key)} />
          </div>
        }
      </div>))
    return formItems
  }

  renderAnswerSection = () => {
    const noOfBlanks = this.props.blanks
    const temp = []
    const keys = this.props.form.getFieldValue('fibBlockOptionKeys')
    for (let blankIndex = 0; blankIndex < noOfBlanks; blankIndex += 1) {
      const formItems = keys.map((key, index) =>
        (
          <Checkbox key={`${key}row${blankIndex}`}
            value={key}
            style={{ display: 'flex', alignItems: 'center' }}
          >{this.props.form.getFieldValue('fibBlockOptionValues')[index]}
          </Checkbox>
        )
      )
      temp.push(
        <div style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '5px',
              justifyContent: 'flex-start'
            }}
          key={blankIndex}
        >
          <StyledModal.OptionDiv>{blankIndex + 1}</StyledModal.OptionDiv>
          <StyledModal.FormItem style={{ display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              overflowX: 'scroll',
              marginLeft: '5px',
              padding: platform === 'macIntel' ? '16px' : '5px'
              }}
          >
            {this.props.form.getFieldDecorator(`fibBlockCheckBox[${blankIndex}]`,
            { valuePropName: 'value', rules: [{ required: true, message: 'Choose atleast one' }] })(
              <Checkbox.Group style={{ display: 'flex', height: '40px' }}>
                {
                  formItems
                }
              </Checkbox.Group>)}
          </StyledModal.FormItem>
        </div>
      )
    }
    return temp
  }

  codeInsertInHint = (type) => {
    let selectStart = this.fibBlockHintRef.selectionStart
    let selectEnd = this.fibBlockHintRef.selectionEnd
    selectStart = this.fibBlockHintRef.selectionStart
    selectEnd = this.fibBlockHintRef.selectionEnd
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
    this.fibBlockHintRef.focus()
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue },
      ordersInUse } = this.props
    return (
      <div>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div style={{ paddingTop: '10px', minWidth: '70px' }}>Order :</div>
          <StyledModal.FormItem style={{ flex: 0 }}>
            {
              getFieldDecorator(...validators.orderNew(ordersInUse))(
                <StyledModal.StyledInputNumber placeholder='Order'
                  type='number'
                  onChange={this.props.setEnteredOrder}
                  onBlur={() => this.props.form.setFieldsValue({ order: parseInt(getFieldValue('order') || 0, 0) })}
                />
              )
            }
          </StyledModal.FormItem>
          <div style={{ minWidth: '25%', paddingTop: '10px', margin: '0px 10px' }}>Orders In Use:</div>
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
        <div style={{ marginTop: '10px' }}>
          {
            this.renderOptionSection()
          }
          <div>
            <StyledModal.AddOption onClick={this.createOptions}>
                    +Add Block
            </StyledModal.AddOption>
          </div>
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
                  innerRef={node => (this.fibBlockHintRef = ReactDOM.findDOMNode(node))}
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
FibBlock.propTypes = {
  form: PropTypes.shape({
    getFieldValue: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func
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
    answers: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
    fibBlocksOptions: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  enteredOrder: PropTypes.number.isRequired,
  setEnteredOrder: PropTypes.func.isRequired,
  validateAnswerCodeSnippet: PropTypes.func.isRequired,
}
export default FibBlock
