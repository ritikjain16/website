import { Button, Checkbox, notification } from 'antd'
import React from 'react'
import moment from 'moment'
import { get, sortBy } from 'lodash'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import {
  AuditBuilderContainer, AuditTab, AuditTable,
  AuditTypeCheckbox, AuditTypeFilterBox, StyledButton
} from '../../AuditBuilder.style'
import shuffle from '../../../../assets/shuffle.png'
import { AuditBuilderModal, AuditViewModal } from '../AuditBuilderModal'
import AuditTableAction from './AuditTableAction'
import AuditPublisher from './AuditPublisher'
import { updateAuditQuestions } from '../../../../actions/auditQuestion'
import { PUBLISHED_STATUS } from '../../../../constants/questionBank'
import { auditSubTypes, auditType as auditTypeValues } from '../../../../constants/auditQuestionConst'
import getAuditTypeText, { getAuditSubTypeText } from '../../../../utils/getAuditTypeText'

const { b2cDemo, b2cPaid, b2b } = auditSubTypes

const { mentor, preSales, postSales } = auditTypeValues

class AuditBuilderTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: [],
      isReordering: false,
      openModal: false,
      operation: '',
      editData: null,
      showAuditView: false,
      auditViewData: null,
      auditQuestionSections: [],
      auditQuestionSubSections: [],
    }
  }

  componentDidUpdate = (prevProps) => {
    const { auditQuestionFetchStatus, auditQuestionDeleteStatus,
      auditQuestionDeleteFailure, auditQuestionUpdateStatus,
      auditQuestionUpdateFailure, auditQuestionsUpdateStatus,
      auditQuestionsUpdateFailure, auditQuestionAddStatus,
      auditQuestionAddFailure, auditQuestionSectionsFetchStatus, } = this.props
    if (auditQuestionFetchStatus && !get(auditQuestionFetchStatus.toJS(), 'loading')
      && get(auditQuestionFetchStatus.toJS(), 'success') &&
      (prevProps.auditQuestionFetchStatus !== auditQuestionFetchStatus)) {
      this.setTableData()
    }

    if (auditQuestionAddStatus && !get(auditQuestionAddStatus.toJS(), 'loading')
      && get(auditQuestionAddStatus.toJS(), 'success') &&
      (prevProps.auditQuestionAddStatus !== auditQuestionAddStatus)) {
      notification.success({
        message: 'Audit Question added successfully'
      })
      this.setTableData()
    } else if (auditQuestionAddStatus && !get(auditQuestionAddStatus.toJS(), 'loading')
      && get(auditQuestionAddStatus.toJS(), 'failure') &&
      (prevProps.auditQuestionAddFailure !== auditQuestionAddFailure)) {
      if (auditQuestionAddFailure && auditQuestionAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(auditQuestionAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (auditQuestionDeleteStatus && !get(auditQuestionDeleteStatus.toJS(), 'loading')
      && get(auditQuestionDeleteStatus.toJS(), 'success') &&
      (prevProps.auditQuestionDeleteStatus !== auditQuestionDeleteStatus)) {
      notification.success({
        message: 'Audit Question deleted successfully'
      })
      this.setTableData()
    } else if (auditQuestionDeleteStatus && !get(auditQuestionDeleteStatus.toJS(), 'loading')
      && get(auditQuestionDeleteStatus.toJS(), 'failure') &&
      (prevProps.auditQuestionDeleteFailure !== auditQuestionDeleteFailure)) {
      if (auditQuestionDeleteFailure && auditQuestionDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(auditQuestionDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (auditQuestionUpdateStatus && !get(auditQuestionUpdateStatus.toJS(), 'loading')
      && get(auditQuestionUpdateStatus.toJS(), 'success') &&
      (prevProps.auditQuestionUpdateStatus !== auditQuestionUpdateStatus)) {
      notification.success({
        message: 'Audit Question updated successfully'
      })
      this.setTableData()
    } else if (auditQuestionUpdateStatus && !get(auditQuestionUpdateStatus.toJS(), 'loading')
      && get(auditQuestionUpdateStatus.toJS(), 'failure') &&
      (prevProps.auditQuestionUpdateFailure !== auditQuestionUpdateFailure)) {
      if (auditQuestionUpdateFailure && auditQuestionUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(auditQuestionUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (auditQuestionsUpdateStatus && !get(auditQuestionsUpdateStatus.toJS(), 'loading')
      && get(auditQuestionsUpdateStatus.toJS(), 'success') &&
      (prevProps.auditQuestionsUpdateStatus !== auditQuestionsUpdateStatus)) {
      notification.success({
        message: 'Audit Question reordered successfully'
      })
      this.setTableData()
    } else if (auditQuestionsUpdateStatus && !get(auditQuestionsUpdateStatus.toJS(), 'loading')
      && get(auditQuestionsUpdateStatus.toJS(), 'failure') &&
      (prevProps.auditQuestionsUpdateFailure !== auditQuestionsUpdateFailure)) {
      if (auditQuestionsUpdateFailure && auditQuestionsUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(auditQuestionsUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    if (auditQuestionSectionsFetchStatus && !get(auditQuestionSectionsFetchStatus.toJS(), 'loading')
      && get(auditQuestionSectionsFetchStatus.toJS(), 'success') &&
      (prevProps.auditQuestionSectionsFetchStatus !== auditQuestionSectionsFetchStatus)) {
      this.setState({
        auditQuestionSections:
          this.props.auditQuestionSections && this.props.auditQuestionSections.toJS() || [],
        auditQuestionSubSections:
          this.props.auditQuestionSubSections && this.props.auditQuestionSubSections.toJS() || []
      })
    }
  }
  onReorderClick = () => {
    this.setState({
      isReordering: true
    })
  }

  onCancelClick = () => {
    this.setState({
      isReordering: false
    }, this.setTableData)
  }

  onOpenModal = (data) => {
    if (data) {
      this.setState({
        openModal: true,
        operation: 'edit',
        editData: data
      })
    } else {
      this.setState({
        openModal: true,
        operation: 'add'
      })
    }
  }
  onAuditView = (data) => {
    if (data) {
      this.setState({
        auditViewData: data,
        showAuditView: true
      })
    } else {
      this.setState({
        auditViewData: null,
        showAuditView: false
      })
    }
  }
  onCloseModal = () => {
    this.setState({
      openModal: false,
      operation: '',
      editData: null
    })
  }

  setTableData = () => {
    const { auditQuestions, getTotalScore, auditType, auditSubType } = this.props
    let auditQuestionsArray = auditQuestions && auditQuestions.toJS() || []
    auditQuestionsArray = auditQuestionsArray.filter(audit => get(audit, 'auditType') === auditType)
    if (auditType === mentor && auditSubType) {
      auditQuestionsArray = auditQuestionsArray.filter(audit =>
        get(audit, 'auditSubType') === auditSubType)
    }
    const publishedAudit = auditQuestionsArray.filter(auditData =>
      get(auditData, 'status') === PUBLISHED_STATUS)
    let totalScore = 0
    publishedAudit.map(audit => totalScore += get(audit, 'score', 0))
    getTotalScore(totalScore)
    this.setState({
      tableData: sortBy(auditQuestionsArray, 'order'),
    })
  }
  getQuestionType = (questionType, record) => {
    const mcqOptions = get(record, 'mcqOptions', []).map(option => get(option, 'statement').toLowerCase().trim())
    let isYesNo = 0
    mcqOptions.forEach(option => {
      if (option === 'yes') {
        isYesNo += 1
      }
      if (option === 'no') {
        isYesNo += 1
      }
    })
    if (isYesNo === 2) {
      questionType = 'Yes/No'
    }
    return questionType
  }
  getTableColumn = () => {
    const { auditType } = this.props
    const column = [
      {
        title: 'Order',
        dataIndex: 'order',
        key: 'order',
        align: 'center',
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
        align: 'center',
        width: 100,
      },
      {
        title: 'Statement',
        dataIndex: 'statement',
        key: 'statement',
        align: 'left',
        width: 500,
        render: (statement, record) => (
          <div>
            <p style={{ margin: '0' }}>{statement}</p>
            <span style={{ opacity: '0.5', fontSize: 'small' }}>{get(record, 'description')}</span>
          </div>)
      },
      {
        title: 'Question Type',
        dataIndex: 'questionType',
        key: 'questionType',
        align: 'center',
        render: (questionType, record) => this.getQuestionType(questionType, record)
      },
      {
        title: 'Is Mandatory',
        dataIndex: 'isMandatory',
        key: 'isMandatory',
        align: 'center',
        width: 150,
        render: (isMandatory) => <Checkbox checked={isMandatory} />
      },
      {
        title: 'Section',
        dataIndex: 'section',
        key: 'section',
        align: 'center',
        width: 150,
        render: (section) => get(section, 'title') || '-'
      },
      {
        title: 'Sub Section',
        dataIndex: 'subSection',
        key: 'subSection',
        align: 'center',
        width: 150,
        render: (subSection) => get(subSection, 'title') || '-'
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 150,
        render: (createdAt) => moment(createdAt).format('ll')
      },
      {
        title: 'Modified At',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 150,
        render: (updatedAt) => moment(updatedAt).format('ll')
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 100,
        render: (status, record) => (
          <AuditPublisher
            status={status}
            auditQuestionId={record.id}
          />
        )
      },
      {
        title: 'Actions',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        align: 'center',
        render: (id, record) => (
          <AuditTableAction
            record={record}
            auditQuestionId={id}
            openEmulatorView={this.openEmulatorView}
            setEmulatorViewQuestions={this.setEmulatorViewQuestions}
            questions={this.state.tableData}
            openEdit={() => this.onOpenModal(record)}
            onAuditView={() => this.onAuditView(record)}
          />
        )
      }
    ]
    if (auditType === mentor) {
      column.splice(4, 0, {
        title: 'Audit SubType',
        dataIndex: 'auditSubType',
        key: 'auditSubType',
        align: 'center',
        width: 200,
        render: (auditSubType) => getAuditSubTypeText(auditSubType) || '-'
      })
    }
    return column
  }

  droppableTableBody = ({ ...props }) => {
    const { isReordering } = this.state
    if (isReordering) {
      return (
        <Droppable
          droppableId='auditBuilder'
        >
          {(provided) => (
            <tbody
              ref={provided.innerRef}
              {...props}
              {...provided.droppableProps}
              className={props.className}
            />
          )}
        </Droppable>
      )
    }
    return <tbody {...props} />
  }

  draggableTableRow = ({ index, ...props }) => {
    const { isReordering } = this.state
    if (isReordering) {
      return (
        <Draggable
          key={props['data-row-key']}
          draggableId={props['data-row-key'].toString()}
          index={index}
        >
          {(provided) => (
            <tr
              ref={provided.innerRef}
              {...props}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            />
          )}
        </Draggable>
      )
    }
    return <tr {...props} />
  }

  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  onDragEnd = (result) => {
    const { destination, source } = result
    const { tableData } = this.state
    if (destination && result.reason !== 'CANCEL') {
      const data = [...tableData]
      const draggedAudit = this.reorder(
        data,
        source.index,
        destination.index
      )
      this.setState({
        tableData: draggedAudit
      })
    }
    return null
  };

  onSaveReorder = async () => {
    const { tableData } = this.state
    const input = tableData.map((auditQuestion, index) => ({
      id: auditQuestion.id,
      fields: {
        order: index + 1
      }
    }))
    await updateAuditQuestions({
      input,
    })
    this.setState({
      isReordering: false
    })
  }
  render() {
    const { isReordering, tableData,
      openModal, editData, operation,
      showAuditView, auditViewData,
      auditQuestionSections, auditQuestionSubSections } = this.state
    const defaultBtnStyle = { border: '1px solid #FAAD14', color: '#FAAD14' }
    const { auditQuestionFetchStatus, auditType,
      auditQuestionUpdateStatus, auditQuestionAddStatus,
      auditQuestionsUpdateStatus, searchKey, onStateChange, history,
      auditSubType, onauditSubTypeChange } = this.props
    const updateLoading = auditQuestionUpdateStatus && get(auditQuestionUpdateStatus.toJS(), 'loading')
    const addLoading = auditQuestionAddStatus && get(auditQuestionAddStatus.toJS(), 'loading')
    return (
      <>
        <AuditBuilderContainer justify='space-between'>
          <AuditBuilderContainer padding='0'>
            <h3>Audit Type</h3>
            {
              [preSales, mentor, postSales].map(type => (
                <AuditTypeCheckbox
                  name='auditType'
                  checked={auditType === type}
                  onChange={(e) => onStateChange(e, false)}
                  value={type}
                >
                  <AuditTypeFilterBox checked={auditType === type}>
                    <span>{getAuditTypeText(type)}</span>
                  </AuditTypeFilterBox>
                </AuditTypeCheckbox>
              ))
            }
          </AuditBuilderContainer>
          <div>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => history.push(`/ums/auditBuilder-viewForm/${auditType}`)}
            >View {getAuditTypeText(auditType)} Form
            </Button>
            {
            isReordering ? (
              <>
                <Button
                  style={{ ...defaultBtnStyle, marginRight: '20px' }}
                  onClick={this.onCancelClick}
                >Cancel
                </Button>
                <StyledButton
                  onClick={this.onSaveReorder}
                  loading={auditQuestionsUpdateStatus
                      && get(auditQuestionsUpdateStatus.toJS(), 'loading')}
                >Save
                </StyledButton>
              </>
            ) : (
              <Button
                type='default'
                onClick={this.onReorderClick}
                style={defaultBtnStyle}
                disabled={searchKey !== 'All' || auditSubType}
              ><img
                src={shuffle}
                alt='shuffle'
                style={{ marginRight: '10px', width: '30px' }}
              />
                Reorder
              </Button>
            )
          }
          </div>
        </AuditBuilderContainer>
        {
          auditType === mentor && (
            <AuditBuilderContainer justify='flex-start'>
              <h4>Audit Sub Type</h4>
              {
                [b2cDemo, b2cPaid, b2b].map(type => (
                  <AuditTab
                    checked={auditSubType === type}
                    onClick={() => onauditSubTypeChange(type)}
                  >
                    {getAuditSubTypeText(type)}
                  </AuditTab>
                ))
              }
            </AuditBuilderContainer>
          )
        }
        <AuditViewModal
          visible={showAuditView}
          auditViewData={auditViewData}
          onClose={() => this.onAuditView()}
        />
        <AuditBuilderModal
          openModal={openModal}
          editData={editData}
          operation={operation}
          auditType={auditType}
          auditSubType={auditSubType}
          closeModal={this.onCloseModal}
          auditData={tableData}
          loading={operation === 'add' ? addLoading : updateLoading}
          auditQuestionSections={auditQuestionSections}
          auditQuestionSubSections={auditQuestionSubSections}
        />
        <AuditBuilderContainer addAudit style={{ marginBottom: '15px' }}>
          <StyledButton
            icon='plus'
            onClick={() => this.onOpenModal()}
            disabled={auditQuestionFetchStatus && get(auditQuestionFetchStatus.toJS(), 'loading')}
          >Add Audit Question
          </StyledButton>
        </AuditBuilderContainer>
        <DragDropContext
          onDragEnd={this.onDragEnd}
        >
          <AuditTable
            columns={this.getTableColumn()}
            dataSource={tableData}
            scroll={{ x: 'max-content' }}
            loading={auditQuestionFetchStatus && get(auditQuestionFetchStatus.toJS(), 'loading')}
            pagination={false}
            components={{
              body: {
                // Custom tbody
                wrapper: (value) => this.droppableTableBody(value),
                // Custom td
                row: (value) => this.draggableTableRow(value)
              }
            }}
            onRow={(record, index) => ({
              index,
              record,
            })}
          />
        </DragDropContext>
      </>
    )
  }
}

export default AuditBuilderTable
