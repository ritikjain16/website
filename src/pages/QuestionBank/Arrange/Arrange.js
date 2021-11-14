/* eslint-disable react/no-find-dom-node */
import React from 'react'
// import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Slider, Icon } from 'antd'
import { get } from 'lodash'
import { MAX_ARRANGE_OPTIONS, MIN_ARRANGE_OPTIONS, MAX_DIFFICULTY_RANGE, BOLD, BLOCK } from '../../../constants/questionBank'
import StyledArrange from './Arrange.style'
import validators from '../../../utils/formValidators'
import { getOrderAutoComplete } from '../../../utils/data-utils'

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

// const grid = 8

// const getItemStyle = (isDragging, draggableStyle) => ({
//   // some basic styles to make the items look a bit nicer
//   userSelect: 'none',
//   padding: grid * 2,
//   margin: `0 0 ${grid}px 0`,

//   // change background colour if dragging
//   background: isDragging ? 'lightgreen' : 'white',
//   borderStyle: 'solid',
//   borderRadius: '10px',
//   // styles we need to apply on draggables
//   ...draggableStyle,
// })

// const getListStyle = isDraggingOver => ({
//   background: isDraggingOver ? 'lightblue' : 'white',
//   padding: grid,
//   width: '300px',
// })


let optionId = 1
class Rearrange extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: this.props.defaultData.arrangeItems,
    }
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentDidMount() {
    if (this.props.id === 'EditQuestion') {
      this.setFieldsValue()
    } else {
      const { form: { setFieldsValue }, ordersInUse } = this.props
      setFieldsValue({
        order: this.props.enteredOrder ? this.props.enteredOrder :
          getOrderAutoComplete(ordersInUse),
        arrangeOptionsArray: get(this.props, 'defaultData.arrangeOptions') || []
      })
    }
  }

  componentDidUpdate(prevprops) {
    if (!prevprops.visible && this.props.visible) {
      this.setFieldsValues()
    }
  }

  setFieldsValue() {
    const { order, hint, difficulty, arrangeKeys, arrangeOptions,
      arrangeItems } = this.props.defaultData
    const { form } = this.props
    this.props.form.setFieldsValue({
      order,
      hint,
      slider: difficulty || 0,
      arrangeKeys,
      arrangeOptionsArray: arrangeOptions
    })
    const keys = form.getFieldValue('arrangeKeys')
    keys.forEach((key, index) => {
      this.props.form.setFieldsValue({
        [`arrangeOptions[${key}]`]: arrangeOptions[index].statement,
      })
    })
    this.setState({ items: arrangeItems })
  }

  returnItems() {
    return this.state.items
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    )

    this.setState({
      items,
    })
  }

    removeOption = (removingOptionKey) => {
      const { form } = this.props
      const arrangeKeys = form.getFieldValue('arrangeKeys')
      const arrangeOptionsArray = form.getFieldValue('arrangeOptionsArray')
      if (arrangeKeys.length === MIN_ARRANGE_OPTIONS) {
        return
      }
      // delete that option key so that option is removed
      const { items } = this.state
      const newItems = items.filter((item) => item.id !== removingOptionKey)
      this.setState({ items: newItems })
      form.setFieldsValue({
        arrangeKeys: arrangeKeys.filter(key => key !== removingOptionKey),
        arrangeOptionsArray: arrangeOptionsArray.filter((opt, ind) => {
          opt.correctPositions = opt.correctPositions.filter(currPosition =>
            currPosition !== removingOptionKey)
          return ind !== removingOptionKey
        })
      }, () => this.ValidateOptionFields())
    }

    addOption = () => {
      const { form } = this.props
      const { items } = this.state
      const arrangeKeys = form.getFieldValue('arrangeKeys')
      const arrangeOptionsArray = form.getFieldValue('arrangeOptionsArray')
      if (arrangeKeys.length < MAX_ARRANGE_OPTIONS) {
        optionId = Math.max(...arrangeKeys) + 1
        const nextKeys = arrangeKeys.concat(optionId)
        const newItems = [...items, { id: optionId }]
        this.setState({ items: newItems })
        form.setFieldsValue({
          arrangeKeys: nextKeys,
          arrangeOptionsArray: [...arrangeOptionsArray, { statement: '', correctPositions: [] }]
        })
      }
    }

  /* function used to validate mcq options to have only unique values
   it checks if the value is matching with anyother option input value and
   diplays and error if matching
*/
  uniqueOptionsValidation = (key) => (rule, value, callback) => {
    const { getFieldValue } = this.props.form
    const arrangeKeys = getFieldValue('arrangeKeys')
    value = value ? value.trim() : value
    arrangeKeys.forEach((k) => {
      let eachValue = getFieldValue(`arrangeOptions[${k}]`)
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
  onInputChange = (e, k) => {
    const { setFieldsValue } = this.props.form
    let { value } = e.target
    value = value ? value.trim() : value
    setFieldsValue({ [`arrangeOptions[${k}]`]: value }, () => this.ValidateOptionFields())
  }

  onInputBlur = (e, k) => {
    const { setFieldsValue } = this.props.form
    let { value } = e.target
    value = value ? value.trim() : value
    setFieldsValue({ [`arrangeOptions[${k}]`]: value }, () => this.ValidateOptionFields())
  }

  /* function to validate all the option fields once again by
  using force:true for validate fields and providing it with array of optionKeys */
  ValidateOptionFields = () => {
    const { validateFields, getFieldValue } = this.props.form
    const arrangeKeys = getFieldValue('arrangeKeys')
    const optionsArray = []
    arrangeKeys.forEach((key) => {
      optionsArray.push(`arrangeOptions[${key}]`)
    })
    validateFields(optionsArray, { force: true })
  }

  codeInsertInHint = (type) => {
    let selectStart = this.arrangeHintRef.selectionStart
    let selectEnd = this.arrangeHintRef.selectionEnd
    selectStart = this.arrangeHintRef.selectionStart
    selectEnd = this.arrangeHintRef.selectionEnd
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
    this.arrangeHintRef.focus()
  }

  onUpdatedCorrectPositions = (index, key) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    const arrangeOptionsArray = getFieldValue('arrangeOptionsArray')
    const findOptionInd = arrangeOptionsArray.findIndex((opt, ind) => ind === index)
    if (findOptionInd !== -1) {
      let { correctPositions } = arrangeOptionsArray[findOptionInd]
      if (correctPositions.includes(key)) {
        correctPositions = correctPositions.filter(value => value !== key)
      } else {
        correctPositions.push(key)
      }
      arrangeOptionsArray[findOptionInd].correctPositions = correctPositions
      setFieldsValue({ arrangeOptionsArray })
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { defaultData, ordersInUse } = this.props
    getFieldDecorator('arrangeKeys', { initialValue: defaultData.arrangeKeys })
    getFieldDecorator('arrangeOptionsArray', { arrangeOptionsArray: defaultData.arrangeOptions })
    const arrangeKeys = getFieldValue('arrangeKeys')
    const formItems = arrangeKeys.map((k, index) => (
      <StyledArrange.StyledOptions key={k}>
        <div style={{ display: 'flex', width: '60%' }}>
          <StyledArrange.FormItem
            style={{ flex: '14' }}
          >
            {getFieldDecorator(`arrangeOptions[${k}]`, {
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: 'Please Enter option or delete this field.',
                        },
                        { validator: this.uniqueOptionsValidation(k) }],
                    })(
                      <StyledArrange.TextArea
                        onChange={(e) => this.onInputChange(e, k)}
                        onBlur={(e) => this.onInputBlur(e, k)}
                        placeholder={`option ${index + 1}`}
                        id={`option${index}`}
                      />
                    )}
          </StyledArrange.FormItem>
          {arrangeKeys.length > MIN_ARRANGE_OPTIONS && (
          <Icon
            style={{ marginTop: '6%' }}
            className='dynamic-delete-button'
            type='minus-circle-o'
            disabled={arrangeKeys.length === 1}
            onClick={() => this.removeOption(k)}
          />
        )}
        </div>
        <div style={{
            width: '45%',
            marginLeft: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}
        >
          <span>Correct Orders:</span>
          {
              arrangeKeys.map(key => (
                <StyledArrange.ArrangeButton key={key}
                  active={get(getFieldValue('arrangeOptionsArray'), `[${index}].correctPositions`, []).includes(key + 1)}
                  onClick={() => this.onUpdatedCorrectPositions(index, key + 1)}
                >
                  {key + 1}
                </StyledArrange.ArrangeButton>
              ))
            }
        </div>
      </StyledArrange.StyledOptions>
    ))
    return (
      <div>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          <div style={{ paddingTop: '15px' }}>Order : </div>
          <StyledArrange.FormItem>
            {
                        getFieldDecorator(...validators.orderNew(ordersInUse))(
                          <StyledArrange.StyledInputNumber placeholder='Enter Order'
                            id='order'
                            onBlur={() => this.props.form.setFieldsValue({ order: parseInt(getFieldValue('order') || 0, 0) })}
                            onChange={this.props.setEnteredOrder}
                          />
                        )
                    }
          </StyledArrange.FormItem>
          <StyledArrange.OrderInUse >Orders In Use: {ordersInUse.join(', ')}</StyledArrange.OrderInUse>
        </div>
        <StyledArrange.SliderWrapper>
          <div style={{ paddingTop: '10px' }}>Difficulty: </div>
          <div >
            <StyledArrange.Slider>
              {getFieldDecorator(...validators.slider)(<Slider style={{ width: '200px' }} max={MAX_DIFFICULTY_RANGE} />)}
            </StyledArrange.Slider>
          </div>
          <div style={{ paddingTop: '10px', marginLeft: '10px' }}>{getFieldValue('slider')}</div>
        </StyledArrange.SliderWrapper>
        {formItems}
        {(arrangeKeys.length < MAX_ARRANGE_OPTIONS) &&
        <StyledArrange.AddOption>
          <StyledArrange.AddOptionText
            onClick={() => this.addOption()}
          >+ Add Option
          </StyledArrange.AddOptionText>
          <StyledArrange.AddOptionLine />
        </StyledArrange.AddOption>}
        {/* <StyledArrange.CorrectAnswers>Correct Order/Answer:</StyledArrange.CorrectAnswers> */}
        {/* <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId='droppable'>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                    {(eachProvided, eachSnapshot) => (
                      <div
                        ref={eachProvided.innerRef}
                        {...eachProvided.draggableProps}
                        {...eachProvided.dragHandleProps}
                        style={getItemStyle(
                            eachSnapshot.isDragging,
                            eachProvided.draggableProps.style
                          )}
                      >
                        {getFieldValue(`arrangeOptions[${item.id}]`)}
                      </div>
                      )}
                  </Draggable>
                  ))}
                {provided.placeholder}
              </div>
              )}
          </Droppable>
        </DragDropContext> */}
        {/* <div style={{ display: 'flex' }}>
          <StyledArrange.FormItem>
            {
                        getFieldDecorator('hint')(
                          <StyledArrange.TextArea
                            innerRef={node => (this.arrangeHintRef = ReactDOM.findDOMNode(node))}
                            placeholder='Hint'
                            id='hint'
                          />
                        )
                    }
          </StyledArrange.FormItem>
          <div style={{ alignSelf: 'flex-end' }}>
            <StyledArrange.BoldIcon
              type='bold'
              onMouseDown={(e) => { e.preventDefault() }}
              onClick={() => this.codeInsertInHint(BOLD)}
            />
            <StyledArrange.BlockIcon
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

Rearrange.propTypes = {
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
    arrangeKeys: PropTypes.array,
    arrangeOptions: PropTypes.arrayOf(PropTypes.shape({})),
    arrangeItems: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  setEnteredOrder: PropTypes.func.isRequired,
  enteredOrder: PropTypes.number.isRequired,
}

export default Rearrange
