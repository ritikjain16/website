import { Button, Checkbox, Select, Tooltip } from 'antd'
import RadioGroup from 'antd/lib/radio/group'
import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../../components/MainModal'
import {
  getOrderAutoComplete, getOrdersInUse
} from '../../../../utils/data-utils'
import {
  AuditBuilderContainer,
  AuditModal, ScoreArea
} from '../../AuditBuilder.style'
import AuditInput from '../AuditInput'
import {
  BoolType, Mcq, Rating, Timestamp
} from './QuestionTypes'
import {
  auditType as auditTypeValues, auditQuestionType,
  auditSubTypes, NAOPTION, PARTIALOPTION,
} from '../../../../constants/auditQuestionConst'
import {
  addAuditQuestion, updateAuditQuestion
} from '../../../../actions/auditQuestion'
import getAuditTypeText, { getAuditSubTypeText } from '../../../../utils/getAuditTypeText'

const {
  bool, mcq, input, timestamp, rating
} = auditQuestionType

const { mentor } = auditTypeValues

const { b2b, b2cDemo, b2cPaid } = auditSubTypes

class AuditBuilderModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 1,
      score: 0,
      questionType: bool,
      isMandatory: false,
      statement: '',
      timestampTags: [],
      ratingDisplayType: 'star',
      maxRating: 1,
      mcqOptions: [],
      section: '',
      subSection: '',
      description: '',
      error: '',
      moreYesNoField: []
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    const { openModal } = this.props
    if (prevProps.openModal !== openModal && openModal) {
      this.setDefaultState()
    }
    if (prevState.questionType !== this.state.questionType) {
      this.setScoreByType()
    }
  }
  onStateChanged = (event) => {
    const { name, value, type, checked } = event.target
    const valueData = type === 'checkbox' ? checked : value
    this.setState({
      [name]: valueData
    })
  }

  onAddTimestampTags = (tagValue) => {
    const { timestampTags } = this.state
    const orderInUse = getOrdersInUse(timestampTags)
    const nextOrder = getOrderAutoComplete(orderInUse)
    this.setState({
      timestampTags: [...timestampTags, {
        title: tagValue,
        order: nextOrder
      }]
    })
  }

  onRemoveTag = (tagData) => {
    const { timestampTags } = this.state
    if (get(tagData, 'order')) {
      this.setState({
        timestampTags: timestampTags.filter(tag =>
          get(tag, 'order') !== get(tagData, 'order'))
      })
    }
  }

  onUpdateMcqOption = (typeOperation, option, event) => {
    const { mcqOptions } = this.state
    if (typeOperation === 'add') {
      const ordersInUse = getOrdersInUse(mcqOptions)
      const nextOrder = getOrderAutoComplete(ordersInUse)
      this.setState({
        mcqOptions: [...mcqOptions, {
          statement: '',
          isCorrect: false,
          order: nextOrder
        }]
      }, () => {
        const optionsLength = this.state.mcqOptions.length
        this.setState({
          score: optionsLength
        })
      })
    } else if (typeOperation === 'remove') {
      if (get(option, 'order')) {
        this.setState({
          mcqOptions: mcqOptions.filter(optionData =>
            get(optionData, 'order') !== get(option, 'order'))
        }, () => {
          const optionsLength = this.state.mcqOptions.length
          this.setState({
            score: optionsLength
          })
        })
      }
    } else {
      const { name, value, checked, type } = event.target
      const newMcqOptions = [...mcqOptions]
      const findInd = mcqOptions.findIndex(mcqOption => get(mcqOption, 'order') === get(option, 'order'))
      if (findInd >= 0) {
        newMcqOptions[findInd][name] = type === 'checkbox' ? checked : value
        this.setState({
          mcqOptions: newMcqOptions
        })
      }
    }
  }
  renderTypeView = () => {
    const { questionType, timestampTags, ratingDisplayType,
      maxRating, mcqOptions, moreYesNoField } = this.state
    if (questionType === rating) {
      return <Rating
        ratingDisplayType={ratingDisplayType}
        onStateChanged={this.onStateChanged}
        maxRating={maxRating}
        setRatingValue={(value) => this.setState({
          maxRating: parseInt(value, 0) || 0,
          score: parseInt(value, 0) || 0
        })}
      />
    } else if (questionType === timestamp) {
      return <Timestamp
        timestampTags={timestampTags}
        onAddTimestampTags={this.onAddTimestampTags}
        onRemoveTag={this.onRemoveTag}
      />
    } else if (questionType === mcq) {
      return <Mcq
        mcqOptions={mcqOptions}
        onUpdateMcqOption={this.onUpdateMcqOption}
      />
    } else if (questionType === bool) {
      return (
        <BoolType
          moreYesNoField={moreYesNoField}
          moreFieldOperation={this.moreFieldOperation}
        />
      )
    }
    return null
  }

  onCloseModal = () => {
    this.props.closeModal()
    this.setState({
      order: 1,
      score: 0,
      questionType: bool,
      isMandatory: false,
      statement: '',
      timestampTags: [],
      ratingDisplayType: 'star',
      maxRating: 1,
      mcqOptions: [],
      section: '',
      subSection: '',
      description: '',
      error: '',
      moreYesNoField: [],
      auditSubTypeValue: ''
    })
  }

  setDefaultState = () => {
    const { operation, editData, auditType, auditSubType } = this.props
    if (operation === 'edit') {
      const newMcqOptions = []
      const moreYesNoField = []
      let questionType = ''
      const options = get(editData, 'mcqOptions', []).map(option => get(option, 'statement').toLowerCase().trim())
      let isYesNo = 0
      options.forEach(option => {
        if (option === 'yes') {
          isYesNo += 1
        }
        if (option === 'no') {
          isYesNo += 1
        }
      })
      if (isYesNo === 2) {
        options.forEach(opt => {
          if (opt === 'na') {
            moreYesNoField.push(NAOPTION)
          }
          if (opt === 'partially correct') {
            moreYesNoField.push(PARTIALOPTION)
          }
        })
        questionType = bool
      } else {
        questionType = get(editData, 'questionType')
        get(editData, 'mcqOptions', []).forEach((option, index) => {
          newMcqOptions.push({
            order: index + 1,
            statement: get(option, 'statement'),
            isCorrect: get(option, 'isCorrect')
          })
        })
      }
      let auditSubTypeValue = ''
      if (auditType === mentor) {
        if (get(editData, 'auditSubType')) {
          auditSubTypeValue = get(editData, 'auditSubType')
        } else {
          auditSubTypeValue = auditSubType || ''
        }
      }
      this.setState({
        order: get(editData, 'order'),
        score: get(editData, 'score') || 0,
        questionType,
        isMandatory: get(editData, 'isMandatory'),
        statement: get(editData, 'statement'),
        maxRating: get(editData, 'maxRating') || 0,
        ratingDisplayType: get(editData, 'ratingDisplayType') || 'star',
        timestampTags: get(editData, 'timestampTags') || [],
        mcqOptions: newMcqOptions,
        section: get(editData, 'section.id'),
        subSection: get(editData, 'subSection.id'),
        description: get(editData, 'description'),
        moreYesNoField,
        auditSubTypeValue
      }, this.setScoreByType)
    } else {
      this.setState({
        auditSubTypeValue: auditSubType || ''
      })
      this.setScoreByType()
      this.changeOrderValue()
    }
  }

  changeOrderValue = () => {
    const { auditData } = this.props
    const orderInUse = getOrdersInUse(auditData)
    const order = getOrderAutoComplete(orderInUse)
    this.setState({
      order
    })
  }
  moreFieldOperation = (value) => {
    const { moreYesNoField } = this.state
    if (moreYesNoField.includes(value)) {
      this.setState({
        moreYesNoField: [...moreYesNoField].filter(opt => opt !== value)
      }, this.setScoreByType)
    } else {
      this.setState({
        moreYesNoField: [...moreYesNoField, value]
      }, this.setScoreByType)
    }
  }
  validateInputs = () => {
    const { score, questionType, statement, mcqOptions,
      maxRating, order } = this.state
    const { auditData, operation, editData } = this.props
    const ordersInUse = getOrdersInUse(auditData)
    let emptyStatement = 0
    let emptyCorrect = 0
    const newOrders = ordersInUse.filter(ord =>
      ord !== get(editData, 'order', 0))
    mcqOptions.forEach(option => {
      if (!get(option, 'statement')) {
        emptyStatement += 1
      }
      if (get(option, 'isCorrect')) {
        emptyCorrect += 1
      }
    })
    let error = ''
    if (score < 0) error = 'Score cannot be less than 0'
    else if (!statement) error = 'Statment Required'
    else if (questionType === mcq && mcqOptions.length === 0) {
      error = 'Please add Mcq options'
    } else if (questionType === mcq && emptyStatement > 0) {
      error = 'Mcq Options cannot be empty'
    } else if (questionType === mcq && emptyCorrect === 0) {
      error = 'Please mark atleast one mcq options as correct option'
    } else if (questionType === rating && Number(maxRating) <= 0) {
      error = 'Max Rating cannot be less than or equal to 0'
    } else if (operation === 'add' && ordersInUse.includes(Number(order))) {
      error = 'Order already in use'
    } else if (operation === 'edit' && newOrders.includes(Number(order))) {
      error = 'Order already in use'
    }
    if (error) {
      this.setState({
        error
      })
      return false
    }
    this.setState({
      error
    })
    return true
  }
  onOkClick = () => {
    if (this.validateInputs()) {
      const { score, questionType, statement, mcqOptions,
        maxRating, order, isMandatory, timestampTags,
        ratingDisplayType, section, subSection, description,
        moreYesNoField, auditSubTypeValue } = this.state
      const { operation, auditType, editData } = this.props

      let auditInput = {
        score: Number(score),
        questionType,
        order: Number(order),
        statement,
        isMandatory,
        auditType,
        description: description || ''
      }
      if (auditType === mentor && auditSubTypeValue) {
        auditInput = {
          ...auditInput,
          auditSubType: auditSubTypeValue
        }
      }
      const newMcqOptions = []
      if (questionType === bool) {
        ['Yes', 'No', ...moreYesNoField].forEach(option => {
          newMcqOptions.push({
            statement: option,
            isCorrect: false
          })
        })
        auditInput = {
          ...auditInput,
          questionType: mcq
        }
      }
      if (questionType === mcq) {
        mcqOptions.forEach(option => {
          newMcqOptions.push({
            statement: get(option, 'statement'),
            isCorrect: get(option, 'isCorrect')
          })
        })
      }
      if (questionType === rating) {
        auditInput = {
          ...auditInput,
          ratingDisplayType,
          maxRating: Number(maxRating)
        }
      }
      if (operation === 'add') {
        if (questionType === timestamp) {
          auditInput = {
            ...auditInput,
            timestampTags
          }
        }
        if (newMcqOptions.length > 0) {
          auditInput = {
            ...auditInput,
            mcqOptions: newMcqOptions
          }
        }
        addAuditQuestion({
          input: auditInput,
          sectionId: section,
          subSectionId: subSection
        }).then(res => {
          if (res && res.addAuditQuestion
            && res.addAuditQuestion.id) {
            this.onCloseModal()
          }
        })
      } else {
        if (questionType === timestamp) {
          auditInput = {
            ...auditInput,
            timestampTags: {
              replace: timestampTags
            }
          }
        }
        if (newMcqOptions.length > 0) {
          auditInput = {
            ...auditInput,
            mcqOptions: {
              replace: newMcqOptions
            }
          }
        }
        updateAuditQuestion({
          auditQuestionId: get(editData, 'id'),
          input: auditInput,
          sectionId: section,
          subSectionId: subSection
        }).then(res => {
          if (res && res.updateAuditQuestion
            && res.updateAuditQuestion.id) {
            this.onCloseModal()
          }
        })
      }
    }
  }
  filterOption = (inputValue, option) => (
    get(option, 'props.children')
      ? get(option, 'props.children')
        .toLowerCase()
        .indexOf(inputValue.toLowerCase()) >= 0
      : false
  )
  setScoreByType = () => {
    const { questionType, moreYesNoField, maxRating, mcqOptions } = this.state
    const { editData } = this.props
    let score = 0
    if (questionType === bool) {
      score = 1
      if (questionType === bool && moreYesNoField.includes(PARTIALOPTION)) {
        score = 2
      }
    }
    if (questionType === input || questionType === timestamp) {
      if (!editData) {
        score = 1
      }
    }
    if (questionType === rating && maxRating > 0) score = maxRating
    if (questionType === mcq && mcqOptions.length > 0) score = mcqOptions.length
    this.setState({
      score
    })
  }

  disableScore = () => {
    const { questionType } = this.state
    if (questionType === rating || questionType === bool || questionType === mcq) return true
    return false
  }
  render() {
    const { openModal, operation, loading, auditType,
      auditQuestionSections, auditQuestionSubSections } = this.props
    const { score, questionType, isMandatory, statement,
      order, error, section, subSection, description, auditSubTypeValue } = this.state
    return (
      <AuditModal
        visible={openModal}
        title={(
          <AuditBuilderContainer padding='0'>
            <h4 style={{ padding: '15px' }}>
              {operation === 'add' ?
                `Add Audit Question for ${getAuditTypeText(auditType)}`
                : `Edit Audit Question for ${getAuditTypeText(auditType)}`}
            </h4>
            <ScoreArea>
              <h3>Score: </h3>
              <AuditInput
                value={score || 0}
                disabled={this.disableScore()}
                name='score'
                setValue={(value) => this.setState({ score: parseInt(value, 0) || 0 })}
              />
            </ScoreArea>
          </AuditBuilderContainer>
        )}
        onCancel={this.onCloseModal}
        closable={false}
        bodyStyle={{ borderRadius: '24px' }}
        maskClosable
        width='670px'
        centered
        destroyOnClose
        footer={[
          <Button
            onClick={this.onCloseModal}
          >Cancel
          </Button>,
          <Button
            type='primary'
            onClick={this.onOkClick}
            loading={loading}
          >Ok
          </Button>,
        ]}
        wrapClassName='audit-modal'
      >
        <AuditBuilderContainer padding='0 10px'>
          <RadioGroup
            name='questionType'
            buttonStyle='solid'
            value={questionType}
            style={{ marginTop: '10px' }}
            onChange={this.onStateChanged}
          >
            {
              [bool, mcq, rating, input, timestamp].map(typeValue => (
                <MainModal.StyledRadio
                  style={{ textTransform: 'capitalize' }}
                  value={typeValue}
                >{typeValue === bool ? 'Yes/No' : typeValue}
                </MainModal.StyledRadio>
              ))
            }
          </RadioGroup>
          <AuditBuilderContainer>
            <p>Mandatory Question</p>
            <Checkbox
              checked={isMandatory}
              onChange={this.onStateChanged}
              name='isMandatory'
            />
          </AuditBuilderContainer>
        </AuditBuilderContainer>
        {
          auditType === mentor && (
            <AuditBuilderContainer justify='flex-start'>
              <h3>Audit Sub Type: </h3>
              <Select value={auditSubTypeValue}
                onChange={(value) =>
                  this.setState({
                    auditSubTypeValue: value
                  })}
                style={{ width: '200px' }}
              >
                {
                  [b2cDemo, b2cPaid, b2b].map(subType => (
                    <Select.Option value={subType} key={subType}>
                      {getAuditSubTypeText(subType)}
                    </Select.Option>
                  ))
                }
              </Select>
            </AuditBuilderContainer>
          )
        }
        <AuditBuilderContainer style={{ alignItems: 'flex-end' }} >
          <div style={{ flex: '1' }}>
            <h3>Statement</h3>
            <AuditInput
              inputType
              value={statement}
              name='statement'
            // inputRef='statement'
              setValue={(value) => this.setState({ statement: value })}
            />
          </div>
          <div>
            <h3>Question Section</h3>
            <Select value={section}
              showSearch
              optionFilterProp='children'
              filterOption={this.filterOption}
              onChange={(value) =>
              this.setState({ section: value })}
              style={{ width: '200px' }}
            >
              {
              auditQuestionSections.map(option => (
                <Select.Option value={option.id} key={option.id}>
                  <Tooltip title={get(option, 'title')}>
                    {get(option, 'title')}
                  </Tooltip>
                </Select.Option>
                ))
            }
            </Select>
          </div>
        </AuditBuilderContainer>
        <AuditBuilderContainer style={{ alignItems: 'flex-end' }}>
          <div style={{ flex: '1' }}>
            <h3>Question description</h3>
            <AuditInput
              inputType
              value={description}
              name='description'
            // inputRef='statement'
              setValue={(value) => this.setState({ description: value })}
            />
          </div>
          <div>
            <h3>Question Sub Section</h3>
            <Select value={subSection}
              disabled={!section}
              showSearch
              optionFilterProp='children'
              filterOption={this.filterOption}
              onChange={(value) =>
              this.setState({ subSection: value })}
              style={{ width: '200px' }}
            >
              {
              auditQuestionSubSections.map(option => (
                <Select.Option value={option.id} key={option.id}>
                  <Tooltip title={get(option, 'title')}>
                    {get(option, 'title')}
                  </Tooltip>
                </Select.Option>
                ))
            }
            </Select>
          </div>
        </AuditBuilderContainer>
        <AuditBuilderContainer style={{ minHeight: '300px' }}>
          {this.renderTypeView()}
        </AuditBuilderContainer>
        <AuditBuilderContainer modalGrid style={{ width: '40%' }}>
          <h4>Order : </h4>
          <AuditInput
            value={order}
            name='order'
            setValue={(value) => this.setState({ order: value })}
          />
        </AuditBuilderContainer>
        <p
          style={{
            color: 'red',
            fontSize: 'small'
          }}
        >{error && error}
        </p>
      </AuditModal>
    )
  }
}

export default AuditBuilderModal
