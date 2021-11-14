/* eslint-disable react/no-find-dom-node */
/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { BlocklyWorkspace } from 'tekie-blockly'
import { Slider, Checkbox, Icon, notification, Alert } from 'antd'
import { get } from 'lodash'
import StyledMcq from './Blockly.style'
import { debounce } from 'lodash'
import { MAX_MCQ_OPTIONS, MIN_MCQ_OPTIONS, MAX_DIFFICULTY_RANGE, BOLD, BLOCK } from '../../../constants/questionBank'
import validators from '../../../utils/formValidators'
import { getOrderAutoComplete } from '../../../utils/data-utils'
import { decodeBase64 } from '../../../utils/base64Utility'
import { buildCustomToolJSON, DEFAULT_WORKSPACE_CONFIG } from '../../../utils/blocklyUtils'

let optionId = 1
class Blockly extends React.Component {
  state = {
    mcqCheck: false,
  }

  mcqValidationChange(value) {
    this.setState({ mcqCheck: value })
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
    if (!prevprops.visible && this.props.visible) {
      this.setFieldsValues()
    }
  }

  setFieldsValue() {
    const { order, hint, difficulty, mcqKeys, mcqOptions } = this.props.defaultData
    const { form } = this.props
    this.props.form.setFieldsValue({ order, hint, slider: difficulty || 0, mcqKeys })
    const keys = form.getFieldValue('mcqKeys')
    keys.forEach((key, index) => {
      const checkedValue = get(this.props.defaultData, `mcqOptions[${index}].isCorrect`, false)
      this.props.form.setFieldsValue({
        [`mcqOptions[${key}]`]: mcqOptions[index].statement,
        [`mcqIsCorrect[${key}]`]: checkedValue,
        [`blocksJSON[${key}]`]: decodeBase64(get(mcqOptions[index], 'blocksJSON')),
        [`initialXML[${key}]`]: decodeBase64(get(mcqOptions[index], 'initialXML')),
      })
    })
  }

  removeOption = (removingOptionKey) => {
    const { form } = this.props
    const mcqKeys = form.getFieldValue('mcqKeys')
    if (mcqKeys.length === MIN_MCQ_OPTIONS) {
      return
    }
    // delete that option key so that option is removed and then validate the options
    form.setFieldsValue({
      mcqKeys: mcqKeys.filter(key => key !== removingOptionKey),
    }, () => this.ValidateOptionFields())
  }

  addOption = () => {
    const { form } = this.props
    const mcqKeys = form.getFieldValue('mcqKeys')
    if (mcqKeys.length < MAX_MCQ_OPTIONS) {
      optionId = Math.max(...mcqKeys) + 1
      const nextKeys = mcqKeys.concat(optionId)
      form.setFieldsValue({
        mcqKeys: nextKeys,
      })
    }
  }

  /* function used to validate mcq options to have only unique values
     it checks if the value is matching with anyother option input value and
     diplays and error if matching
  */
  uniqueOptionsValidation = (key) => (rule, value, callback) => {
    const { getFieldValue } = this.props.form
    const mcqKeys = getFieldValue('mcqKeys')
    value = value ? value.trim() : value
    mcqKeys.forEach((k) => {
      let eachValue = getFieldValue(`mcqOptions[${k}]`)
      eachValue = eachValue ? eachValue.trim() : eachValue
      if (k !== key && value === eachValue) {
        callback('option value is already present in another option')
      }
    })
    callback()
  }

  /* is called when an option input is changed
     we will sent the value to the corresponding option and when that is
    completely then we call the validateOption Fields function which validates all the
    option fields once again  */
  onInputChange=(e, k, type) => {
    const { setFieldsValue } = this.props.form
    let { value } = e.target
    value = value ? value.trim() : value
    if (type === 'initialXML') {
      setFieldsValue({ [`initialXML[${k}]`]: value }, () => this.ValidateOptionFields())
      this.clearAndInsertBlocksToWorkspace(k, value)
    } else {
      setFieldsValue({ [`blocksJSON[${k}]`]: value }, () => this.ValidateOptionFields())
    }
  }

  /* function to validate all the option fields once again by
  using force:true for validate fields and providing it with array of optionKeys */
  ValidateOptionFields=() => {
    const { validateFields, getFieldValue } = this.props.form
    const mcqKeys = getFieldValue('mcqKeys')
    const optionsArray = []
    mcqKeys.forEach((key) => {
      optionsArray.push(`mcqOptions[${key}]`)
    })
    validateFields(optionsArray, { force: true })
  }

  clearAndInsertBlocksToWorkspace = debounce((key, xml) => {
    try {
      if (window !== 'undefined') {
        let blocklyWorkspace = window[`${key}Workspace`]
        let blocklyObject = window[`${key}Blockly`]
        if (blocklyObject && blocklyWorkspace && xml) {
          blocklyWorkspace.clear()
          blocklyObject.Xml.domToWorkspace(blocklyObject.Xml.textToDom(xml), blocklyWorkspace);
        }
      }
    } catch (e) {
      notification.warn({
        message: e.message
      })
      console.error('Blockly', e)
    }
  }, 1000)

  codeInsertInHint = (type) => {
    let selectStart = this.mcqHintRef.selectionStart
    let selectEnd = this.mcqHintRef.selectionEnd
    selectStart = this.mcqHintRef.selectionStart
    selectEnd = this.mcqHintRef.selectionEnd
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
    this.mcqHintRef.focus()
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { defaultData, ordersInUse } = this.props
    getFieldDecorator('mcqKeys', { initialValue: defaultData.mcqKeys })
    const mcqKeys = getFieldValue('mcqKeys')
    const formItems = mcqKeys.map((k, index) => (
      <StyledMcq.StyledOptions key={k}>
        <StyledMcq.FormItem
          style={{ flex: '14' }}
        >
          {getFieldDecorator(`blocksJSON[${k}]`, {
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please Enter option or delete this field.',
            }],
            })(
              <StyledMcq.Input
                onChange={(e) => this.onInputChange(e, k)}
                placeholder={`blocksJSON for ${index + 1}`}
                id={`blocksJSON${index}`}
              />
          )}
          {getFieldDecorator(`initialXML[${k}]`, {
            rules: [{
              required: true,
              whitespace: true,
              message: 'Please Enter option or delete this field.',
            }],
            })(
              <StyledMcq.Input
                onChange={(e) => this.onInputChange(e, k, 'initialXML')}
                placeholder={`initialXML for ${index + 1}`}
                id={`initialXML${index}`}
              />
          )}
        </StyledMcq.FormItem>
        <StyledMcq.FormItem>
          <StyledMcq.BlocklyItem>
            {buildCustomToolJSON(getFieldValue(`blocksJSON[${k}]`)) && (
              <BlocklyWorkspace
                useDefaultToolbox
                customTools={buildCustomToolJSON(getFieldValue(`blocksJSON[${k}]`))}
                workspaceConfiguration={DEFAULT_WORKSPACE_CONFIG({ readOnly: true })}
                initialXml={getFieldValue(`initialXML[${k}]`) || ''}
                blocklyKey={k.toString()}
              />
            )}
          </StyledMcq.BlocklyItem>
        </StyledMcq.FormItem>
        <StyledMcq.FormItem
          className='mcqOption'
        >
          {getFieldDecorator(`mcqIsCorrect[${k}]`, {
            valuePropName: 'checked',
            initialValue: false,
            rules: [{
              required: this.state.mcqCheck,
              type: 'boolean',
              message: 'Should Select Atleast one Checkbox.',
            }],
          })(
            <Checkbox key={k} />
          )
          }
        </StyledMcq.FormItem>
        {mcqKeys.length > MIN_MCQ_OPTIONS && (
        <Icon
          style={{ marginTop: '6%' }}
          className='dynamic-delete-button'
          type='minus-circle-o'
          disabled={mcqKeys.length === 1}
          onClick={() => this.removeOption(k)}
        />
        )}
      </StyledMcq.StyledOptions>
    ))
    return (
      <div>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div style={{ paddingTop: '15px' }}>Order : </div>
          <StyledMcq.FormItem>
            {
            getFieldDecorator(...validators.orderNew(ordersInUse))(
              <StyledMcq.StyledInputNumber placeholder='Enter Order' id='order'
                onBlur={() => this.props.form.setFieldsValue({ order: parseInt(getFieldValue('order') || 0, 0) })}
                onChange={this.props.setEnteredOrder} />
            )
          }
          </StyledMcq.FormItem>
          <StyledMcq.OrderInUse>Orders In Use: {ordersInUse.join(', ')}</StyledMcq.OrderInUse>
        </div>
        <StyledMcq.SliderWrapper>
          <div style={{ paddingTop: '10px' }}>Difficulty: </div>
          <div >
            <StyledMcq.Slider>
              {getFieldDecorator(...validators.slider)(<Slider style={{ width: '200px' }} max={MAX_DIFFICULTY_RANGE} />)}
            </StyledMcq.Slider>
          </div>
          <div style={{ paddingTop: '10px', marginLeft: '10px' }}>{getFieldValue('slider')}</div>
        </StyledMcq.SliderWrapper>
        <Alert
          message={(
            <>
              Create Blocks using following link -&nbsp;
              <a href="https://blockly-demo.appspot.com/static/demos/blockfactory/index.html" target="_blank">
                Blockly Dev Tool
              </a>
            </>
          )}
          type="info" showIcon
        />
        <Alert
          style={{
            margin: '8px 0px'
          }}
          message={(
            <>
              Tutorial for creating custom blocks -&nbsp;
              <a href="https://smithgajjar.notion.site/Blockly-Blocks-Creation-Tutorial-7438c84f4dfb4ddfa2c6f71c2ec2cc71" target="_blank">
                Click Here
              </a>
            </>
          )}
          type="info" showIcon
        />
        <div>
          {formItems}
        </div>
        {this.state.mcqCheck &&
        <StyledMcq.McqError>Atleast one option has to be Correct</StyledMcq.McqError>
        }
        {(mcqKeys.length < MAX_MCQ_OPTIONS) &&
        <StyledMcq.AddOption>
          <StyledMcq.AddOptionText
            onClick={() => this.addOption()}
          >+ Add Option
          </StyledMcq.AddOptionText>
          <StyledMcq.AddOptionLine />
        </StyledMcq.AddOption>}
        <div style={{ display: 'flex' }}>
          <StyledMcq.FormItem>
            {
              getFieldDecorator('hint')(
                <StyledMcq.TextArea
                  innerRef={node => (this.mcqHintRef = ReactDOM.findDOMNode(node))}
                  placeholder='Hint'
                  id='hint'
                />
              )
            }
          </StyledMcq.FormItem>
          <div style={{ alignSelf: 'flex-end' }}>
            <StyledMcq.BoldIcon
              type='bold'
              onMouseDown={(e) => { e.preventDefault() }}
              onClick={() => this.codeInsertInHint(BOLD)}
            />
            <StyledMcq.BlockIcon
              type='bold'
              onMouseDown={(e) => { e.preventDefault() }}
              onClick={() => this.codeInsertInHint(BLOCK)}
            />
          </div>
        </div>
      </div>
    )
  }
}

Blockly.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  ordersInUse: PropTypes.arrayOf(PropTypes.number).isRequired,
  defaultData: PropTypes.shape({
    order: PropTypes.number,
    hint: PropTypes.string,
    difficulty: PropTypes.number,
    mcqKeys: PropTypes.array,
    mcqOptions: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  enteredOrder: PropTypes.number.isRequired,
  setEnteredOrder: PropTypes.func.isRequired
}

export default Blockly
