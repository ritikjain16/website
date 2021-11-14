import React from 'react'
import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import Main from './LONav.style'

const { TabPane } = Tabs

const LONav = props => {
  const selectLO = () => {
    if (props.learningObjectives.length !== 0) {
      if (props.params.learningObjectiveId) {
        props.selectLearningObjectiveId(props.params.learningObjectiveId)
      } else {
        props.selectLearningObjectiveId(props.learningObjectives[0].id)
      }
    } else {
      props.selectLearningObjectiveId(null)
    }
  }

  React.useEffect(() => {
    selectLO()
  }, [props.learningObjectives])

  React.useEffect(() => {
    selectLO()
  }, [])

  const onTabChange = key => {
    props.push(`/tech-talk/${props.topicId}/${key}`)
    props.selectLearningObjectiveId(key)
  }
  const learningObjectiveId = props.learningObjectives[0]
    ? props.learningObjectives[0].id
    : ''
  return (
    <Main>
      <Tabs
        activeKey={props.params.learningObjectiveId || learningObjectiveId}
        onChange={onTabChange}
      >
        {props.learningObjectives.map(learningObjective => (
          <TabPane tab={learningObjective.title} key={learningObjective.id} />
        ))}
      </Tabs>
    </Main>
  )
}

LONav.propTypes = {
  learningObjectives: PropTypes.arrayOf({}).isRequired,
  push: PropTypes.func.isRequired,
  selectLearningObjectiveId: PropTypes.func.isRequired,
  topicId: PropTypes.string.isRequired,
  params: PropTypes.shape({
    learningObjectiveId: PropTypes.string.isRequired
  }).isRequired
}
export default LONav
