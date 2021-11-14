import React from 'react'
import PropTypes from 'prop-types'
import { get, sortBy } from 'lodash'
import Header from './QuestionsTable.style'
import QuestionsBody from '../QuestionsBody'
import QuestionModal from '../CommonSection'
import { getDataById } from '../../../utils/data-utils'
import TopicNav from '../../../components/TopicNav'
import topicJourneyRoutes from '../../../constants/topicJourneyRoutes'
import EmulatorModal from '../EmulatorModal'

export default class QuestionsTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      addModalVisible: false,
      editModalVisible: false,
      editQuestionId: '',
      emulatorModalVisible: false,
      emulatorViewQuestionId: '',
      emulatorViewQuestions: {},
      cancelClicked: false,
      showAnswers: false,
      showHint: false,
      contentTags: []
    }
    this.showModal = this.showModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.openEdit = this.openEdit.bind(this)
  }
  componentDidUpdate(prevprops, prevstate) {
    const addQuestionElem = document.getElementById('add-btn')
    if (prevprops.isFetchingQuestionbank === false &&
      this.props.isFetchingQuestionbank === true) {
      addQuestionElem.disabled = true
      addQuestionElem.style.opacity = 0.7
    } else {
      addQuestionElem.disabled = false
      addQuestionElem.style.opacity = 1
    }
    if (prevstate.addModalVisible === true && this.state.addModalVisible === false) {
      addQuestionElem.blur()
    }

    const { contentTagsFetchStatus, contentTags } = this.props
    if (contentTagsFetchStatus && !get(contentTagsFetchStatus.toJS(), 'loading')
      && get(contentTagsFetchStatus.toJS(), 'success') &&
      (prevprops.contentTagsFetchStatus !== contentTagsFetchStatus)) {
      this.setState({
        contentTags: contentTags && contentTags.toJS() || []
      })
    }
  }
  showModal() {
    this.setState({
      addModalVisible: true
    })
  }
  closeModal() {
    this.setState({
      addModalVisible: false,
      editModalVisible: false,
      emulatorModalVisible: false,
      cancelClicked: true,
      showAnswers: false,
      showHint: false
    })
  }
  openEdit=(id) => () => {
    this.setState({
      editModalVisible: true,
      editQuestionId: id
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

  getKeysFibInput=(fibInputOptions) => {
    const keys = []
    if (!fibInputOptions || fibInputOptions.length === 0) {
      return keys
    }
    fibInputOptions.forEach(blank => {
      const optionLength = blank.answers.length
      const temp = []
      for (let i = 0; i < optionLength; i += 1) {
        temp.push(i + 1)
      }
      keys.push(temp)
    })
    return keys
  }
  getAnswersFibInput=(fibInputOptions) => {
    const answers = []
    if (!fibInputOptions || fibInputOptions.length === 0) {
      return answers
    }
    fibInputOptions.forEach(blank => {
      const optionLength = blank.answers.length
      const temp = []
      for (let i = 0; i < optionLength; i += 1) {
        temp.push(blank.answers[i])
      }
      answers.push(temp)
    })
    return answers
  }
  addButtonSection=(questionBanks) => (
    <Header>
      <Header.Text>
        Total Questions: {
          questionBanks ? questionBanks.length : 0}
      </Header.Text>
      <Header.ButtonContainer>
        <Header.AddButton
          type='primary'
          icon='plus'
          onClick={this.showModal}
          id='add-btn'
          disabled={this.props.isFetchingQuestionbank}
        >
          ADD QUESTION
        </Header.AddButton>
      </Header.ButtonContainer>
    </Header>
  )

  getKeys=(options) => {
    const keys = []
    if (options && options.length > 0) {
      for (let i = 0; i < options.length; i += 1) {
        keys.push(i)
      }
    }
    return keys
  }

  getArrangeItems = options => {
    const items = []
    if (options && options.length > 0) {
      const sortedOptions = sortBy(options, 'correctPosition')
      for (let i = 0; i < sortedOptions.length; i += 1) {
        items.push({ id: sortedOptions[i].displayOrder - 1 })
      }
    }
    return items
  }

  isEmptyOrUndefined=(data) => {
    if (typeof data === 'undefined' || data === 'undefined') {
      return true
    } else if (Array.isArray(data) && data.length === 0) {
      return true
    }
    return false
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

   render() {
     const { questionBanks,
       learningObjectives, removeMappingWithLo, editQuestionBank,
       addQuestionBank } = this.props
     const defaultEditData = getDataById(questionBanks, this.state.editQuestionId)
     const emulatorViewData = getDataById(questionBanks, this.state.emulatorViewQuestionId)
     const defaultData = {
       assessmentType: 'practiceQuestion',
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
       explanation: ''
     }
     const { contentTags } = this.state
     return (
       <div>
         <TopicNav activeTab={topicJourneyRoutes.questionBank} />
         {this.addButtonSection(questionBanks)}
         <QuestionModal
           id='AddQuestion'
           visible={this.state.addModalVisible}
           onCancel={this.closeModal}
           title='ADD QUESTION'
           questionsData={questionBanks}
           onSave={addQuestionBank}
           learningObjectives={learningObjectives}
           topicConnectId={this.props.topicConnectId}
           contentTags={contentTags}
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
            explanation: defaultData.explanation
          }}
         />
         <EmulatorModal
           id='EmulatorModal'
           visible={this.state.emulatorModalVisible}
           onCancel={this.closeModal}
           topicTitle={this.props.topicTitle}
           emulatorViewData={emulatorViewData}
           emulatorViewQuestions={this.state.emulatorViewQuestions}
           questionId={this.state.emulatorViewQuestionId}
           questionOrderIdMap={this.getQuestionIdOrderMapping()}
           openEmulatorView={(id) => this.openEmulatorView(id)}
           cancelClicked={this.state.cancelClicked}
           showAnswers={this.state.showAnswers}
           showHint={this.state.showHint}
           emulatorViewAnswers={(showAnswerState) => this.emulatorViewAnswers(showAnswerState)}
           emulatorViewHint={(showHintState) => this.emulatorViewHint(showHintState)}
           emulatorViewQuestionOrder={this.getEmulatorViewQuestionOrder()}
         />
         <QuestionModal
           id='EditQuestion'
           visible={this.state.editModalVisible}
           onCancel={this.closeModal}
           onSave={editQuestionBank}
           title='EDIT QUESTION'
           questionsData={questionBanks}
           learningObjectives={learningObjectives}
           topicConnectId={this.props.topicConnectId}
           removeMappingWithLo={removeMappingWithLo}
           contentTags={contentTags}
           defaultData={{
            id: defaultEditData.id,
            order: defaultEditData.order,
            difficulty: defaultEditData.difficulty,
            assessmentType: defaultEditData.assessmentType,
            questionType: defaultEditData.questionType,
            statement: defaultEditData.statement,
            questionLayoutType: defaultEditData.questionLayoutType,
            answerCodeSnippet: this.isEmptyOrUndefined(defaultEditData.answerCodeSnippet) ?
            defaultData.answerCodeSnippet
            : defaultEditData.answerCodeSnippet,
            questionCodeSnippet: this.isEmptyOrUndefined(defaultEditData.questionCodeSnippet) ?
            defaultData.questionCodeSnippet
            : defaultEditData.questionCodeSnippet,
            explanation: defaultEditData.explanation,
            hint: defaultEditData.hint,
            fibInputOptions: defaultEditData.fibInputOptions,
            fibBlocksOptions: this.isEmptyOrUndefined(defaultEditData.fibBlocksOptions) ?
                              defaultData.fibBlocksOptions : defaultEditData.fibBlocksOptions,
            keys: this.getKeysFibInput(defaultEditData.fibInputOptions),
            answers: this.getAnswersFibInput(defaultEditData.fibInputOptions),
            mcqOptions: this.isEmptyOrUndefined(defaultEditData.mcqOptions) ?
              defaultData.mcqOptions :
              defaultEditData.mcqOptions,
            learningObjective: defaultEditData.learningObjective &&
                              defaultEditData.learningObjective.id,
            mcqKeys: this.isEmptyOrUndefined(defaultEditData.mcqOptions) ?
            defaultData.mcqKeys :
            this.getKeys(defaultEditData.mcqOptions),
            arrangeOptions: this.isEmptyOrUndefined(defaultEditData.arrangeOptions) ?
              defaultData.arrangeOptions :
              sortBy(defaultEditData.arrangeOptions, 'displayOrder'),
            arrangeKeys: this.isEmptyOrUndefined(defaultEditData.arrangeOptions) ?
              defaultData.arrangeKeys :
              this.getKeys(defaultEditData.arrangeOptions),
            arrangeItems: this.isEmptyOrUndefined(defaultEditData.arrangeOptions) ?
              defaultData.arrangeItems :
               this.getArrangeItems(defaultEditData.arrangeOptions),
             hints: get(defaultEditData, 'hints') || [],
            tags: get(defaultEditData, 'tags') || []
      }}
         />
         <QuestionsBody {...this.props}
           openEdit={(id) => this.openEdit(id)}
           openEmulatorView={(id) => this.openEmulatorView(id)}
           setEmulatorViewQuestions={(questions) => this.setEmulatorViewQuestions(questions)}
         />
       </div>
     )
   }
}
QuestionsTable.propTypes = {
  questionBanks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  learningObjectives: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  addQuestionBank: PropTypes.func.isRequired,
  topicConnectId: PropTypes.string.isRequired,
  editQuestionBank: PropTypes.func.isRequired,
  removeMappingWithLo: PropTypes.func.isRequired,
  isFetchingQuestionbank: PropTypes.bool.isRequired
}
