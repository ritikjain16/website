import { get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { fetchMessageQuestionAndComic } from '../../../../../actions/courseMaker'
import { LEARNING_OBJECTIVE } from '../../../../../constants/CourseComponents'
import { CloseIcon, LoView, TopContainer } from '../../../AddSessions.styles'
import SelectInput from '../../SelectInput'
import { ComicView, MessageView, QuestionView } from '../TopicComponents'

class LearningObjective extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchVal: '',
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { courseId } = this.props
    if (prevProps.courseId !== courseId
      && courseId) {
      await fetchMessageQuestionAndComic(courseId)
    }
  }
  onSelect = (value) => {
    const { onValueSelect, uniqueName } = this.props
    onValueSelect(value, uniqueName, LEARNING_OBJECTIVE)
  }

  onDeselect = (value) => {
    const { onValueDeselect, uniqueName } = this.props
    onValueDeselect(value, LEARNING_OBJECTIVE, uniqueName)
  }
  render() {
    const { searchVal } = this.state
    const { learningObectiveFetchingStatus,
      loList, selectedValue,
      selectedData
    } = this.props
    return (
      <>
        <TopContainer justify='center'>
          <SelectInput
            searchVal={searchVal}
            placeholder='Search Lo'
            loading={learningObectiveFetchingStatus && get(learningObectiveFetchingStatus.toJS(), 'loading')}
            values={selectedValue}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            onChange={value => this.setState({ searchVal: value })}
            data={loList}
          />
        </TopContainer>
        <div style={{ width: '100%' }}>
          {
            selectedData.map(({ messages, questionBank, comicStrips, id }) => (
              <LoView
                key={id}
              >
                <CloseIcon
                  style={{ border: '1px solid', right: '8px', padding: '5px', zIndex: '10' }}
                  onClick={() => this.onDeselect({ key: id, id, ...messages, questionBank })}
                />
                {messages && messages.length > 0 && <MessageView messages={messages} />}
                {questionBank && questionBank.length > 0 &&
                  <QuestionView questions={questionBank} />}
                {comicStrips && comicStrips.length > 0 && (
                  <ComicView comicStrips={comicStrips} />
                )}
              </LoView>
            ))
          }
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  learningObectiveFetchingStatus: state.data.getIn(['learningObjectives', 'fetchStatus', 'learningObjectives']),
})

export default connect(mapStateToProps)(LearningObjective)
