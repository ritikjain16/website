import { get } from 'lodash'
import React from 'react'
import { fetchContentLearningObjective, fetchQuestions } from '../../../actions/contentMaker'
import { fetchContentTags } from '../../../actions/contentTags'
import TopicNav from '../../../components/TopicNav'
import { PRACTICE_QUESTION } from '../../../constants/CourseComponents'
import topicJourneyRoutes from '../../../constants/topicJourneyRoutes'
import QuestionsTable from './components/QuestionTable/QuestionTable'
import { QuestionContainer, StyledButton } from './ContentQuestions.style'

class ContentQuestions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loId: this.props.match.params.learningObjectiveId,
      addModalVisible: false,
    }
  }
  componentDidMount = async () => {
    const { loId } = this.state
    if (!this.props.topicTitle) {
      fetchContentLearningObjective({ loId })
    }
    await fetchQuestions({
      loId,
      key: PRACTICE_QUESTION
    })
    fetchContentTags(`{ and: [
        {status:published}
      ]
    }`, 0, 0)
  }
  render() {
    const { questionsFetchingStatus, questionBanksMeta, topicTitle } = this.props
    const { loId, addModalVisible } = this.state
    return (
      <>
        <TopicNav activeTab={topicJourneyRoutes.contentQuestions} loNav />
        <QuestionContainer justify='flex-end'>
          <QuestionContainer>
            <h4>Total Questions: {questionBanksMeta || 0}</h4>
            <StyledButton
              icon='plus'
              id='add-btn'
              disabled={questionsFetchingStatus && get(questionsFetchingStatus.toJS(), 'loading')}
              onClick={() => this.setState({ addModalVisible: true })}
            >
              ADD QUESTION
            </StyledButton>
          </QuestionContainer>
        </QuestionContainer>
        <QuestionsTable
          addModalVisible={addModalVisible}
          onCloseAdd={() => this.setState({ addModalVisible: false })}
          learningObjectives={[{ title: topicTitle, id: loId }]}
          {...this.props}
          learningObjectiveId={loId}
          assessmentType={PRACTICE_QUESTION}
        />
      </>
    )
  }
}

export default ContentQuestions
