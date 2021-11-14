import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TopicAssetsMain from './TopicAssets.style'
import toastrMessage from '../../utils/messages'
import Loader from '../../utils/Loader'

class TopicAssets extends Component {
  componentDidMount() {
    const topicId = this.props.match.params.id
    this.props.fetchTopicAssets(topicId)
  }
  componentDidUpdate(prevProps) {
    const { tafetchError } = this.props
    toastrMessage(tafetchError, prevProps.tafetchError, 'error', tafetchError)
  }
  render() {
    // method to assign default count to 0 incase concept card is null
    const getTopicAssetData = (data) => data.map(row => {
      const textMessageCount = row.textMessageCount == null ?
        0 : row.textMessageCount.messagesMeta.count
      const imageMessageCount = row.textMessageCount == null ?
        0 : row.imageMessageCount.messagesMeta.count
      const terminalInputMessageCount = row.textMessageCount == null ?
        0 : row.terminalInputMessageCount.messagesMeta.count
      const terminalOutputMessageCount = row.textMessageCount == null ?
        0 : row.terminalOutputMessageCount.messagesMeta.count
      const quizCount = row.quizCount == null ? 0 : row.quizCount.count
      const practiceQuestionCount = row.practiceQuestionCount == null ?
        0 : row.practiceQuestionCount.count
      return {
        id: row.id,
        order: row.order,
        title: row.title,
        textMessageCount,
        imageMessageCount,
        terminalInputMessageCount,
        terminalOutputMessageCount,
        quizCount,
        practiceQuestionCount
      }
    })
    // sorting the LOs according to order
    const orderedTopicAssets = getTopicAssetData(this.props.topicAssets).sort((a, b) =>
      a.order - b.order)
    const columns = [{
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 50,
    }, {
      title: 'Learning objectives',
      dataIndex: 'title',
      key: 'learningObjectives',
      width: 300,
    }, {
      title: 'Text Messages',
      dataIndex: 'textMessageCount',
      key: 'loTextMessageCount',
      width: 100,
    }, {
      title: 'Image Messages',
      dataIndex: 'imageMessageCount',
      key: 'loImageMessageCount',
      width: 100,
    }, {
      title: 'Terminal Input Messages',
      dataIndex: 'terminalInputMessageCount',
      key: 'loTerminalInputMessageCount',
      width: 150,
    }, {
      title: 'Terminal Output Messages',
      dataIndex: 'terminalOutputMessageCount',
      key: 'loTerminalOutputMessageCount',
      width: 150,
    }, {
      title: 'Practice Questions',
      dataIndex: 'practiceQuestionCount',
      key: 'practiceQuestions',
      width: 100,
    }, {
      title: 'Quiz Questions',
      dataIndex: 'quizCount',
      key: 'quizzes',
      width: 80,
    }]
    return (
      this.props.isFetching === true ? <Loader /> :
      <TopicAssetsMain
        dataSource={orderedTopicAssets}
        columns={columns}
        rowKey='id'
        pagination={false}
        size='small'
        scroll={{ x: 600 }}
      />
    )
  }
}

TopicAssets.defaultProps = {
  tafetchError: null
}

TopicAssets.propTypes = {
  fetchTopicAssets: PropTypes.func.isRequired,
  topicAssets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isFetching: PropTypes.bool.isRequired,
  tafetchError: PropTypes.string,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }).isRequired
}

export default TopicAssets
