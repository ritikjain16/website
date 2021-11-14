/* eslint max-len: 0 */
import React, { useEffect, useState } from 'react'
import { get, sortBy } from 'lodash'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import TopicNav from '../../components/TopicNav'
import LONav from './components/LONav'
import Main from './TechTalk.style'
import SplitScreen from './components/SplitScreen'
import TechTalkForm from './components/TechTalkForm'
// import Emulator from './components/Emulator'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'
import requestToGraphql from '../../utils/requestToGraphql'

const TechTalk = props => {
  const [selectedLearningObjectiveId, setSelectedLearningObjectiveId] = useState(
    props.match.params.learningObjectiveId || (
      props.learningObjectives[0] && props.learningObjectives[0].id
    ))
  const [isFetchingQuestionBank, setIsFetchingQuestionBank] = useState(true)
  const [questionBank, setQuestionBank] = useState([])
  const { topicId } = props.match.params
  const filteredLO = props.learningObjectives.filter(learningObjective => (
    get(learningObjective, 'topics', []).map(topic => get(topic, 'id')).includes(topicId)
  ))

  const isMessageOfLearningObjectiveFetched = learningObjectiveId => {
    const foundMessage = props.messages.find(message =>
      message.learningObjective.id === learningObjectiveId
    )
    return !!(foundMessage && foundMessage.id)
  }

  const fetchMessages = learningObjectiveId => {
    if (!isMessageOfLearningObjectiveFetched(learningObjectiveId)) {
      props.fetchMessages(learningObjectiveId)
    }
  }

  useEffect(() => {
    setSelectedLearningObjectiveId(props.selectedLearningObjectiveId)
  }, [props.selectedLearningObjectiveId])

  useEffect(() => {
    if (filteredLO.length === 0) {
      props.fetchLearningObjectives(topicId)
    }
    if (!props.hasStickeremojisFetched) {
      props.fetchStickerEmoji()
    }
    props.fetchTopics(topicId)
  }, [])

  useEffect(() => {
    props.addMessageUI([...props.messages.map(message => ({
      id: message.id,
      statement: message.statement,
      alignmentType: message.alignment,
      messageType: message.type,
      order: message.order,
      terminalInput: message.terminalInput,
      terminalOutput: message.terminalOutput,
      stickerCode: get(message, 'sticker.code'),
      imageURI: get(message, 'image.signedUri'),
      learningObjectiveId: get(message, 'learningObjective.id')
    })), { id: 'addForm', statement: '', alignmentType: 'left', messageType: 'text', order: 'add', learningObjectiveId: props.selectedLearningObjectiveId }])
  }, [props.hasMessagesFetched])

  const fetchQuestions = async (loId, searchTerm, callback) => {
    const filter = `and: [
          {
            learningObjectives_some: {
              id: "${loId}"
            }   
          }
          { assessmentType: practiceQuestion }
          ${searchTerm && searchTerm.length > 0 ? `{ statement_startsWith: "${searchTerm}" }` : ''}
        ]`
    const questionsBank = await requestToGraphql(gql`{
      questionBanks(
        orderBy : createdAt_DESC
        filter: {
          ${filter} 
        }
      ) {
        id
        statement
      }
    }`)
    const questions = get(questionsBank, 'data.questionBanks', [])
    if (callback) {
      callback(questions)
    } else {
      setQuestionBank(questions)
    }
  }

  const fetchData = async () => {
    setIsFetchingQuestionBank(true)
    if (filteredLO.length !== 0) {
      if (props.match.params.learningObjectiveId) {
        fetchMessages(props.match.params.learningObjectiveId)
        await fetchQuestions(props.match.params.learningObjectiveId)
      } else if (filteredLO[0]) {
        fetchMessages(filteredLO[0].id)
        await fetchQuestions(filteredLO[0].id)
      }
    }
    setIsFetchingQuestionBank(false)
  }

  useEffect(() => {
    fetchData()
  }, [props.learningObjectives, props.match.params])

  const renderBody = () => (
    <Main headerHeight={props.headerHeight}>
      <SplitScreen {...props}
        mobileBreak={717}
        screenLeftStyle={{
        minWidth: '55%'
      }}
      >
        <TechTalkForm
          fetchQuestions={fetchQuestions}
          messages={sortBy(props.messages.filter(message =>
            message.learningObjective.id === selectedLearningObjectiveId
          ), 'order')}
          isFetchingQuestionBank={isFetchingQuestionBank}
          questionBank={questionBank}
          learningObjectiveId={selectedLearningObjectiveId}
          addMessage={props.addMessage}
          editMessage={props.editMessage}
          editMessages={props.editMessages}
          hasAddedMessage={props.hasAddedMessage}
          hasEditedMessage={props.hasEditedMessage}
          hasDeletedMessage={props.hasDeletedMessage}
          deletedMessageId={props.deletedMessageId}
          hasMessagesFetched={props.hasMessagesFetched}
          learningObjectives={props.learningObjectives}
          deleteMessage={props.deleteMessage}
          removeImageMessage={props.removeImageMessage}
          editedMessageId={props.editedMessageId}
          stickerEmojis={props.stickerEmojis}
        />
        <div />
        {/* <Emulator editMessages={props.editMessages} /> */}
      </SplitScreen>
    </Main>
  )

  return (
    <React.Fragment>
      <TopicNav activeTab={topicJourneyRoutes.techTalk} />
      <LONav
        learningObjectives={filteredLO}
        topicId={topicId}
        push={props.history.push}
        params={props.match.params}
        selectLearningObjectiveId={props.selectLearningObjectiveId}
      />
      {renderBody()}
    </React.Fragment>
  )
}

TechTalk.propTypes = {
  headerHeight: PropTypes.string.isRequired,
  fetchMessages: PropTypes.func.isRequired,
  fetchTopics: PropTypes.func.isRequired,
  fetchStickerEmoji: PropTypes.func.isRequired,
  deletedMessageId: PropTypes.string.isRequired,
  fetchLearningObjectives: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  editMessage: PropTypes.func.isRequired,
  editMessages: PropTypes.func.isRequired,
  deleteMessage: PropTypes.func.isRequired,
  addMessageUI: PropTypes.func.isRequired,
  removeImageMessage: PropTypes.func.isRequired,
  selectLearningObjectiveId: PropTypes.func.isRequired,
  selectedLearningObjectiveId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf({}).isRequired,
  learningObjectives: PropTypes.arrayOf({}).isRequired,
  hasAddedMessage: PropTypes.bool.isRequired,
  hasMessagesFetched: PropTypes.bool.isRequired,
  hasStickeremojisFetched: PropTypes.bool.isRequired,
  isFetchingMessage: PropTypes.bool.isRequired,
  hasEditedMessage: PropTypes.bool.isRequired,
  hasDeletedMessage: PropTypes.bool.isRequired,
  editedMessageId: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      topicId: PropTypes.string.isRequired,
      learningObjectiveId: PropTypes.string.isRequired,
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
}

export default TechTalk
