import React from 'react'
import PropTypes from 'prop-types'
import { Radio } from 'antd'
import Main from './TopicNav.style'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'

const {
  learningObjectives,
  episode,
  techTalk,
  questionBank,
  badges,
  assignment,
  cheatsheet,
  workbook,
  project,
  contentComic,
  contentTechTalk,
  contentQuestions,
} = topicJourneyRoutes
function changeTab(v, props, loNav) {
  if (loNav) {
    const { learningObjectiveId } = props.match.params
    props.history.push(`${v.target.value}/${learningObjectiveId}`)
  } else {
    let { id } = props.match.params
    id = !id ? props.match.params.topicId : id
    props.history.push(`${v.target.value}/${id}`)
  }
}

const renderInnerNav = (props) => {
  if (props.loNav) {
    return (
      <Main.RadioGroup defaultValue={props.activeTab} buttonStyle='solid' onChange={(e) => changeTab(e, props, props.loNav)}>
        <Radio.Button value={contentComic}>Comic</Radio.Button>
        <Radio.Button value={contentTechTalk}>Tech Talk</Radio.Button>
        <Radio.Button value={contentQuestions}>Practice Questions</Radio.Button>
      </Main.RadioGroup>
    )
    /* eslint-disable no-else-return */
  } else {
    return (
      <Main.RadioGroup defaultValue={props.activeTab} buttonStyle='solid' onChange={(e) => changeTab(e, props)}>
        <Radio.Button value={learningObjectives}>Learning Objectives</Radio.Button>
        <Radio.Button value={episode}>Episode</Radio.Button>
        <Radio.Button value={techTalk}>Tek Talk</Radio.Button>
        <Radio.Button value={questionBank}>Questions</Radio.Button>
        <Radio.Button value={assignment}>Assignment</Radio.Button>
        <Radio.Button value={badges}>Badges</Radio.Button>
        <Radio.Button value={cheatsheet}>CheatSheet</Radio.Button>
        <Radio.Button value={workbook}>Workbook</Radio.Button>
        <Radio.Button value={project}>Project</Radio.Button>
      </Main.RadioGroup>
    )
  }
}
const TopicNav = (props) => (
  <Main>
    {renderInnerNav(props)}
  </Main>
)
TopicNav.propTypes = {
  activeTab: PropTypes.string.isRequired
}
export default TopicNav
