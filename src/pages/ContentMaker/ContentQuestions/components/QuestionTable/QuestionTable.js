import { Button, notification } from 'antd'
import { get, sortBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { getDataById, getFailureStatus, getSuccessStatus } from '../../../../../utils/data-utils'
import EmulatorModal from '../../../../QuestionBank/EmulatorModal'
import QuestionModal from '../../../../QuestionBank/CommonSection/CommonSection'
import { QuestionBankTable, StyledButton } from '../../ContentQuestions.style'
import QuestionActions from './QuestionActions'
import QuestionPublisher from './QuestionPublisher'
import { addQuestionBank, fetchQuestions, updateQuestionBank, updateQuestionBanks } from '../../../../../actions/contentMaker'
import { DraggableTableRow, DroppableTableBody } from '../../../../../components/DraggableAntdTables'
import {
  getAnswersFibInput, getArrangeItems, getKeys,
  getKeysFibInput, isEmptyOrUndefined, reorder
} from '../../../../../utils/questionBankUtils'
import { PRACTICE_QUESTION, QUIZ } from '../../../../../constants/CourseComponents'
import AssignModal from '../../../AssignModal'
import AssignedView from '../../../AssignModal/AssignedView'
import parseChatStatement from '../../../../../utils/parseStatement'

class QuestionsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      childColumn: [],
      activeReorderType: '',
      emulatorModalVisible: false,
      emulatorViewQuestionId: '',
      emulatorViewQuestions: {},
      editModalVisible: false,
      editQuestionId: '',
      cancelClicked: false,
      showAnswers: false,
      showHint: false,
      tableData: [],
      tableLoading: true,
      openAssignModal: false,
      assignModalData: null,
      contentTags: []
    }
  }
  componentDidUpdate = (prevProps) => {
    const { questionsFetchingStatus, questionAddStatus, questionsUpdateFailure,
      questionAddFailure, questionUpdateStatus, questionUpdateFailure,
      questionDeleteStatus, questionDeleteFailure, questionsUpdateStatus,
      learningObjectiveId, assessmentType, quizFetchingStatus,
      quizUpdateStatus, quizUpdateFailure, quizAddStatus,
      quizAddFailure, quizDeleteStatus, quizDeleteFailure,
      contentTagsFetchStatus, contentTags, fetchQuizCount } = this.props

    if (contentTagsFetchStatus && !get(contentTagsFetchStatus.toJS(), 'loading')
      && get(contentTagsFetchStatus.toJS(), 'success') &&
      (prevProps.contentTagsFetchStatus !== contentTagsFetchStatus)) {
      this.setState({
        contentTags: contentTags && contentTags.toJS() || []
      })
    }
    if (assessmentType === PRACTICE_QUESTION) {
      if (getSuccessStatus(questionsFetchingStatus, prevProps.questionsFetchingStatus)) {
        this.convertDataToTable()
      }

      if (getSuccessStatus(questionAddStatus, prevProps.questionAddStatus)) {
        notification.success({
          message: 'Question added successfully'
        })
        this.convertDataToTable()
      } else {
        getFailureStatus(questionAddStatus, questionAddFailure, prevProps.questionAddFailure)
      }

      if (getSuccessStatus(questionUpdateStatus, prevProps.questionUpdateStatus)) {
        this.convertDataToTable()
        notification.success({
          message: 'Question Updated successfully'
        })
      } else {
        getFailureStatus(questionUpdateStatus,
          questionUpdateFailure, prevProps.questionUpdateFailure)
      }

      if (getSuccessStatus(questionsUpdateStatus, prevProps.questionsUpdateStatus)) {
        notification.success({
          message: 'Question`s order Updated successfully'
        })
        fetchQuestions({
          loId: learningObjectiveId,
          key: assessmentType
        }).then(() => this.setState({ tableLoading: true }))
      } else {
        getFailureStatus(questionsUpdateStatus,
          questionsUpdateFailure, prevProps.questionsUpdateFailure)
      }

      if (getSuccessStatus(questionDeleteStatus, prevProps.questionDeleteStatus)) {
        notification.success({
          message: 'Question deleted successfully'
        })
        this.convertDataToTable()
      } else {
        getFailureStatus(questionDeleteStatus,
          questionDeleteFailure, prevProps.questionDeleteFailure)
      }
    } else if (assessmentType === QUIZ) {
      if (getSuccessStatus(quizFetchingStatus, prevProps.quizFetchingStatus)) {
        this.convertDataToTable()
      }

      if (getSuccessStatus(quizUpdateStatus, prevProps.quizUpdateStatus)) {
        this.convertDataToTable()
        notification.success({
          message: 'Quiz Updated successfully'
        })
      } else {
        getFailureStatus(quizUpdateStatus,
          quizUpdateFailure, prevProps.quizUpdateFailure)
      }

      if (getSuccessStatus(quizAddStatus, prevProps.quizAddStatus)) {
        notification.success({
          message: 'Quiz added successfully'
        })
        fetchQuizCount(false)
        this.convertDataToTable()
      } else {
        getFailureStatus(quizAddStatus, quizAddFailure, prevProps.quizAddFailure)
      }

      if (getSuccessStatus(quizDeleteStatus, prevProps.quizDeleteStatus)) {
        notification.success({
          message: 'Quiz deleted successfully'
        })
        fetchQuizCount(false)
        this.convertDataToTable()
      } else {
        getFailureStatus(quizDeleteStatus,
          quizDeleteFailure, prevProps.quizDeleteFailure)
      }
    }
  }
  closeModal = () => {
    const { addModalVisible, onCloseAdd } = this.props
    if (addModalVisible) {
      onCloseAdd()
    }
    this.setState({
      emulatorModalVisible: false,
      cancelClicked: true,
      showAnswers: false,
      showHint: false,
      editModalVisible: false,
      editQuestionId: ''
    })
  }
  openEmulatorView=(id) => {
    this.setState({
      emulatorModalVisible: true,
      emulatorViewQuestionId: id,
    })
  }

  setEmulatorViewQuestions=(questions) => {
    this.setState({
      emulatorModalVisible: true,
      emulatorViewQuestions: questions,
      cancelClicked: false
    })
  }

  emulatorViewAnswers=(showAnswerState) => {
    this.setState({
      showAnswers: showAnswerState
    })
  }

  emulatorViewHint=(showHintState) => {
    this.setState({
      showHint: showHintState
    })
  }

  openEdit = (id) => {
    this.setState({
      editModalVisible: true,
      editQuestionId: id
    })
  }

  getQuestionIdOrderMapping=() => {
    const questions = this.state.emulatorViewQuestions
    const questionsIdOrderMap = {}
    for (let index = 0; index < questions.length; index += 1) {
      questionsIdOrderMap[questions[index].id] = index + 1
    }
    return questionsIdOrderMap
  }

  getQuestionIdAtGivenOrder=() => {
    const questions = this.state.emulatorViewQuestions
    return questions.get()
  }

  getEmulatorViewQuestionOrder=() => {
    const questions = this.state.emulatorViewQuestions
    let questionOrder = 0
    for (questionOrder; questionOrder < questions.length; questionOrder += 1) {
      if (questions[questionOrder].id === this.state.emulatorViewQuestionId) {
        break
      }
    }
    return questionOrder
  }

  getSplitedValue = (value) => {
    if (value) {
      const splittedValue = value.split('|')
      if (splittedValue.length > 0) {
        return splittedValue[0]
      }
    }
    return ''
  }

  onAddSave = async (input, selectedCourse = [], selectedLo) => {
    let coursesId = []
    if (selectedCourse) {
      coursesId = selectedCourse.map(course => get(course, 'key'))
    }
    let losId = []
    if (selectedLo) {
      losId = selectedLo.map(lo => this.getSplitedValue(get(lo, 'key')))
    }
    const { assessmentType, learningObjectiveId } = this.props
    const { tags, ...inputProps } = input
    const tagsConnectIds = tags.map(tag => get(tag, 'id'))
    const { addQuestionBank: data } =
      await addQuestionBank({
        learningObjectiveConnectId:
          assessmentType === PRACTICE_QUESTION ? [learningObjectiveId] : losId,
        input: inputProps,
        key: assessmentType,
        coursesId,
        tagsConnectIds
      })
    if (data && data.id) return data
    return {}
  }

  onEditSave = async ({ id, ...input }, selectedCourse = []) => {
    let coursesId = []
    if (selectedCourse) {
      coursesId = selectedCourse.map(course => get(course, 'key'))
    }
    const { assessmentType } = this.props
    const { mcqOptions, fibBlocksOptions, fibInputOptions, arrangeOptions,
      hints, tags, ...inputprops } = input
    if (mcqOptions) {
      Object.assign(inputprops,
        { mcqOptions: { replace: mcqOptions } })
    }
    if (fibInputOptions) {
      Object.assign(inputprops,
        { fibInputOptions: { replace: fibInputOptions } })
    }
    if (fibBlocksOptions) {
      Object.assign(inputprops,
        { fibBlocksOptions: { replace: fibBlocksOptions } })
    }
    if (arrangeOptions) {
      Object.assign(inputprops,
        { arrangeOptions: { replace: arrangeOptions } })
    }
    if (hints) {
      Object.assign(inputprops,
        { hints: { replace: hints } })
    }
    const tagsConnectIds = tags.map(tag => get(tag, 'id'))
    const { updateQuestionBank: data } = await updateQuestionBank({
      questionId: id,
      input: inputprops,
      key: assessmentType,
      coursesId,
      tagsConnectIds,
    })
    if (data && data.id) return data
    return {}
  }

  onOpenAssignModal = (data) => {
    this.setState({
      assignModalData: data,
      openAssignModal: true
    })
  }

  convertDataToTable = () => {
    const { learningObjectiveId, questionBanks, quizData,
      assessmentType, selectedCourse, searchKey,
      selectedTopic } = this.props
    let newQuestionBanks
    if (assessmentType === PRACTICE_QUESTION) {
      newQuestionBanks = questionBanks && questionBanks.toJS()
        && questionBanks.toJS().length > 0 ? questionBanks.toJS() : []
      newQuestionBanks = newQuestionBanks.filter(question =>
        get(question, 'learningObjectives', []).map(lo => get(lo, 'id')).includes(learningObjectiveId))
    } else if (assessmentType === QUIZ) {
      newQuestionBanks = quizData && quizData.toJS()
        && quizData.toJS().length > 0 ? quizData.toJS() : []
      if (searchKey === 'course' && selectedCourse) {
        newQuestionBanks = newQuestionBanks.filter(lo =>
          get(lo, 'courses', []).map(course => course.id).includes(selectedCourse))
      } else if (searchKey === 'topic' && selectedTopic) {
        newQuestionBanks = newQuestionBanks.filter(lo =>
          get(lo, 'topics', []).map(topic => topic.id).includes(selectedTopic))
      }
    }
    this.setState({
      tableData: sortBy(newQuestionBanks, 'createdAt').reverse()
    }, () => {
      const childColumn = [
        {
          title: 'Order',
          dataIndex: 'order',
          key: 'order',
          align: 'center',
        },
        {
          title: 'Statement',
          dataIndex: 'statement',
          key: 'statement',
          align: 'center',
          width: 500,
          render: (statement) => <span>{parseChatStatement({ statement })}</span>
        },
        {
          title: 'Question Type',
          dataIndex: 'questionType',
          key: 'questionType',
          align: 'center',
        },
        {
          title: 'Difficulty',
          dataIndex: 'difficulty',
          key: 'difficulty',
          align: 'center',
          width: 150,
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
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          width: 100,
          render: (status, record) => (
            <QuestionPublisher status={status}
              questionId={record.id}
              assessmentType={assessmentType}
            />
          )
        },
        {
          title: 'Actions',
          dataIndex: 'id',
          key: 'id',
          width: 200,
          align: 'center',
          render: (id) => (
            <QuestionActions
              questionId={id}
              openEmulatorView={this.openEmulatorView}
              setEmulatorViewQuestions={this.setEmulatorViewQuestions}
              questions={this.state.tableData}
              openEdit={this.openEdit}
              assessmentType={assessmentType}
            />
          )
        }
      ]
      if (assessmentType === QUIZ) {
        const quizColumns = [...childColumn]
        quizColumns.splice(5, 0,
          {
            title: 'Assign Course, Topic & LO',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            width: 400,
            render: (_, record) => (
              <AssignedView
                componentName={QUIZ}
                record={record}
                onAssignClick={() => this.onOpenAssignModal(record)}
              />
            )
          }
        )
        this.setState({
          childColumn: quizColumns
        })
        return
      }
      this.setState({
        childColumn
      })
    })
  }
  getTypeRow = () => {
    const { activeReorderType } = this.state
    const { assessmentType } = this.props
    const columns = [
      {
        title: 'Order',
        dataIndex: 'order',
        key: 'order',
        align: 'center',
      },
      {
        title: 'Statement',
        dataIndex: 'statement',
        key: 'statement',
        align: 'center',
        width: 500,
        render: () => ({ props: { colSpan: 0 } })
      },
      {
        title: 'Question Type',
        dataIndex: 'questionType',
        key: 'questionType',
        align: 'center',
        render: () => ({ props: { colSpan: 0 } })
      },
      {
        title: 'Difficulty',
        dataIndex: 'difficulty',
        key: 'difficulty',
        align: 'center',
        width: 150,
        render: () => ({ props: { colSpan: 0 } })
      },
      {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 150,
        render: () => ({ props: { colSpan: 0 } })
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 100,
        render: () => ({ props: { colSpan: 0 } }),
      },
      {
        title: 'Actions',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        align: 'center',
        render: (text, row) => ({
          props: {
            colSpan: assessmentType === QUIZ ? 8 : 7
          },
          children: (
            <>
              {
                activeReorderType === row ? (
                  <>
                    <Button
                      type='dashed'
                      onClick={() => this.setState({ activeReorderType: '' }, () => this.convertDataToTable())}
                    >Cancel
                    </Button>&nbsp;<StyledButton onClick={this.onReorderSave}>Save</StyledButton>
                  </>
                ) : (
                  <StyledButton
                    type='primary'
                    disabled={activeReorderType && activeReorderType !== row}
                    onClick={() => this.setState({ activeReorderType: row })}
                  >Reorder
                  </StyledButton>
                )
              }
            </>
          )
        })
      }
    ]
    if (assessmentType === QUIZ) {
      const quizColumns = [...columns]
      quizColumns.splice(5, 0,
        {
          title: 'Assign Course, Topic & LO',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          width: 200,
          render: () => ({ props: { colSpan: 0 } }),
        }
      )
      return quizColumns
    }
    return columns
  }

  onDragEnd = (result) => {
    const { destination, source } = result
    const { activeReorderType, tableData } = this.state
    // nothing to do
    if (destination && destination.droppableId === activeReorderType && result.reason !== 'CANCEL') {
      const data = [...tableData]
      const draggedQuestion = reorder(
        data,
        source.index,
        destination.index
      )
      this.setState({
        tableData: draggedQuestion
      })
    }
    return null
  };

  onReorderSave = async () => {
    const { activeReorderType, tableData } = this.state
    const { assessmentType } = this.props
    if (activeReorderType && tableData.length > 0) {
      this.setState({ tableLoading: false })
      const input = tableData.map((question, index) => ({
        id: question.id,
        fields: {
          order: index + 1
        }
      }))
      await updateQuestionBanks({
        input,
        key: assessmentType
      })
      this.setState({ activeReorderType: '' })
    }
  }

  expandedRow = row => {
    const { childColumn, tableData, activeReorderType } = this.state
    return (
      <>
        <DragDropContext
          onDragEnd={this.onDragEnd}
        >
          <QuestionBankTable
            columns={childColumn}
            dataSource={tableData}
            pagination={false}
            showHeader={false}
            rowKey={row}
            components={{
              body: {
                // Custom tbody
                wrapper: (val) =>
                  <DroppableTableBody
                    columnId={row}
                    tasks={tableData}
                    activeReorderType={activeReorderType}
                    {...val}
                  />,
                // Custom td
                row: (val) =>
                  <DraggableTableRow
                    tasks={tableData}
                    rowId={row}
                    activeReorderType={activeReorderType}
                    {...val}
                  />
              }
            }}
            // Set props on per row (td)
            onRow={(record, index) => ({
              index,
              record,
            })}
          />
        </DragDropContext>
      </>
    )
  }

  onCloseAssignModal = () => {
    this.setState({
      assignModalData: null,
      openAssignModal: false
    })
  }
  render() {
    const { tableData, editModalVisible,
      editQuestionId, tableLoading, assignModalData,
      openAssignModal, childColumn,
      emulatorModalVisible, emulatorViewQuestions,
      emulatorViewQuestionId, cancelClicked, showAnswers,
      showHint, contentTags } = this.state
    const { questionsFetchingStatus, addModalVisible,
      learningObjectiveId, learningObjectives, assessmentType,
      quizFetchingStatus, coursesList,
      quizUpdateStatus, coursesFetchStatus, groupedLOs, allLoList } = this.props
    const defaultEditData = getDataById(tableData, editQuestionId)
    const defaultData = {
      assessmentType,
      questionType: 'fibInput',
      statement: '',
      questionLayoutType: 'editor',
      order: 1,
      hint: '',
      answerCodeSnippet: '',
      questionCodeSnippet: '',
      difficulty: 0,
      fibInputOptions: [],
      mcqKeys: [0, 1],
      arrangeKeys: [0, 1],
      mcqOptions: [{ statement: '', isCorrect: false }, { statement: '', isCorrect: false }],
      arrangeOptions: [{ statement: '', correctPositions: [] }, { statement: '', correctPositions: [] }],
      arrangeItems: [{ id: 0 }, { id: 1 }],
      fibBlocksOptions: [{ statement: '', correctPositions: [] },
        { statement: '', correctPositions: [] }],
      explanation: '',
      courses: []
    }

    const isTableLoading = tableLoading && (assessmentType === PRACTICE_QUESTION ?
      questionsFetchingStatus && get(questionsFetchingStatus.toJS(), 'loading') :
      quizFetchingStatus && get(quizFetchingStatus.toJS(), 'loading'))

    const emulatorViewData = getDataById(tableData, emulatorViewQuestionId)
    return (
      <>
        <QuestionModal
          id='AddQuestion'
          visible={addModalVisible}
          onCancel={this.closeModal}
          title='ADD QUESTION'
          questionsData={tableData}
          onSave={this.onAddSave}
          learningObjectives={learningObjectives}
          learningObjectiveId={learningObjectiveId}
          contentMaker={assessmentType}
          coursesList={coursesList}
          contentTags={contentTags}
          groupedLOs={groupedLOs}
          allLoList={allLoList}
          defaultData={{
            assessmentType: defaultData.assessmentType,
            questionType: defaultData.questionType,
            statement: defaultData.statement,
            questionLayoutType: defaultData.questionLayoutType,
            order: defaultData.order,
            hint: defaultData.hint,
            answerCodeSnippet: defaultData.answerCodeSnippet,
            questionCodeSnippet: defaultData.questionCodeSnippet,
            difficulty: defaultData.difficulty,
            fibInputOptions: defaultData.fibInputOptions,
            mcqKeys: defaultData.mcqKeys,
            arrangeKeys: defaultData.arrangeKeys,
            mcqOptions: defaultData.mcqOptions,
            arrangeOptions: defaultData.arrangeOptions,
            arrangeItems: defaultData.arrangeItems,
            fibBlocksOptions: defaultData.fibBlocksOptions,
            explanation: defaultData.explanation,
            courses: [],
            learningObjectives: []
          }}
        />
        <QuestionModal
          id='EditQuestion'
          visible={editModalVisible}
          onCancel={this.closeModal}
          onSave={this.onEditSave}
          title='EDIT QUESTION'
          questionsData={tableData}
          learningObjectiveId={learningObjectiveId}
          coursesList={coursesList}
          contentMaker={assessmentType}
          contentTags={contentTags}
          defaultData={{
            id: defaultEditData.id,
            order: defaultEditData.order,
            difficulty: defaultEditData.difficulty,
            assessmentType: defaultEditData.assessmentType,
            questionType: defaultEditData.questionType,
            statement: defaultEditData.statement,
            questionLayoutType: defaultEditData.questionLayoutType,
            answerCodeSnippet: isEmptyOrUndefined(defaultEditData.answerCodeSnippet) ?
            defaultData.answerCodeSnippet
            : defaultEditData.answerCodeSnippet,
            questionCodeSnippet: isEmptyOrUndefined(defaultEditData.questionCodeSnippet) ?
            defaultData.questionCodeSnippet
            : defaultEditData.questionCodeSnippet,
            explanation: defaultEditData.explanation,
            hint: defaultEditData.hint,
            fibInputOptions: defaultEditData.fibInputOptions,
            fibBlocksOptions: isEmptyOrUndefined(defaultEditData.fibBlocksOptions) ?
                              defaultData.fibBlocksOptions : defaultEditData.fibBlocksOptions,
            keys: getKeysFibInput(defaultEditData.fibInputOptions),
            answers: getAnswersFibInput(defaultEditData.fibInputOptions),
            mcqOptions: isEmptyOrUndefined(defaultEditData.mcqOptions) ?
              defaultData.mcqOptions :
              defaultEditData.mcqOptions,
            learningObjective: defaultEditData.learningObjective &&
                              defaultEditData.learningObjective.id,
            mcqKeys: isEmptyOrUndefined(defaultEditData.mcqOptions) ?
            defaultData.mcqKeys :
            getKeys(defaultEditData.mcqOptions),
            arrangeOptions: isEmptyOrUndefined(defaultEditData.arrangeOptions) ?
              defaultData.arrangeOptions :
              sortBy(defaultEditData.arrangeOptions, 'displayOrder'),
            arrangeKeys: isEmptyOrUndefined(defaultEditData.arrangeOptions) ?
              defaultData.arrangeKeys :
              getKeys(defaultEditData.arrangeOptions),
            arrangeItems: isEmptyOrUndefined(defaultEditData.arrangeOptions) ?
              defaultData.arrangeItems :
              getArrangeItems(defaultEditData.arrangeOptions),
            courses: isEmptyOrUndefined(defaultEditData.courses) ?
              defaultData.courses : get(defaultEditData, 'courses'),
            hints: get(defaultEditData, 'hints') || [],
            tags: get(defaultEditData, 'tags') || [],
            learningObjectives: get(defaultEditData, 'learningObjectives') || []
          }}
          groupedLOs={groupedLOs}
          allLoList={allLoList}
        />
        <EmulatorModal
          id='EmulatorModal'
          visible={emulatorModalVisible}
          onCancel={this.closeModal}
          topicTitle={this.props.topicTitle}
          emulatorViewData={emulatorViewData}
          emulatorViewQuestions={emulatorViewQuestions}
          questionId={emulatorViewQuestionId}
          questionData={tableData}
          questionOrderIdMap={this.getQuestionIdOrderMapping()}
          openEmulatorView={(id) => this.openEmulatorView(id)}
          cancelClicked={cancelClicked}
          showAnswers={showAnswers}
          showHint={showHint}
          emulatorViewAnswers={(showAnswerState) => this.emulatorViewAnswers(showAnswerState)}
          emulatorViewHint={(showHintState) => this.emulatorViewHint(showHintState)}
          emulatorViewQuestionOrder={this.getEmulatorViewQuestionOrder()}
        />
        {
          assessmentType === QUIZ ? (
            <>
              <AssignModal
                openAssignModal={openAssignModal}
                assignModalData={assignModalData}
                coursesList={coursesList}
                saveLoading={quizUpdateStatus && get(quizUpdateStatus.toJS(), 'loading')}
                coursesFetchStatus={coursesFetchStatus && get(coursesFetchStatus.toJS(), 'loading')}
                componentName={QUIZ}
                onCloseAssignModal={this.onCloseAssignModal}
                allLoList={allLoList}
                groupedLOs={groupedLOs}
              />
              <QuestionBankTable
                columns={childColumn}
                dataSource={tableData}
                pagination={false}
                loading={isTableLoading}
                scroll={{ x: 'max-content' }}
              />
            </>
          ) : (
            <QuestionBankTable
              dataSource={tableData.length > 0 ? [assessmentType] : []}
              columns={this.getTypeRow()}
              rowClassName={() => 'antdTable-row antdTable-child-row'}
              scroll={{ x: 'max-content' }}
              pagination={false}
              defaultExpandAllRows
              expandIconAsCell={false}
              loading={isTableLoading}
              expandedRowRender={this.expandedRow}
              rowKey={record => record}
              expandedRowKeys={tableData.length > 0 ? [assessmentType] : []}
              expandIcon={null}
            />
          )
        }
      </>
    )
  }
}

export default QuestionsTable
