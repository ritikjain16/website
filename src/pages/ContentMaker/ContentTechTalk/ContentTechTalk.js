import React from 'react'
import { fetchContentLearningObjective, fetchTechTalk } from '../../../actions/contentMaker'
import TopicNav from '../../../components/TopicNav'
import topicJourneyRoutes from '../../../constants/topicJourneyRoutes'
import SplitScreen from './components/SplitScreen'
import TechTalkForm from './components/TechTalkForm'
import Main from './ContentTechTalk.style'

class ContentTechTalk extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loId: this.props.match.params.learningObjectiveId,
    }
  }
  componentDidMount = async () => {
    const { loId } = this.state
    if (!this.props.topicTitle) {
      fetchContentLearningObjective({ loId })
    }
    await fetchTechTalk(loId)
  }

  render() {
    const { loId } = this.state
    return (
      <>
        <TopicNav activeTab={topicJourneyRoutes.contentTechTalk} loNav />
        <Main headerHeight={800}>
          <SplitScreen {...this.props} mobileBreak={717}>
            <TechTalkForm
              learningObjectiveId={loId}
              {...this.props}
            />
            <div />
          </SplitScreen>
        </Main>
      </>
    )
  }
}

export default ContentTechTalk
