import { get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { fetchTopicVideos } from '../../../../../actions/courseMaker'
import { VIDEO } from '../../../../../constants/CourseComponents'
import { TopContainer } from '../../../AddSessions.styles'
import SelectInput from '../../SelectInput'
import { VideoView } from '../TopicComponents'

class Videos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchVal: '',
    }
  }
  componentDidMount = async () => {
    const { videoList, courseId } = this.props
    if (videoList.length === 0) {
      await fetchTopicVideos(courseId)
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { courseId } = this.props
    if (prevProps.courseId !== courseId
      && courseId) {
      await fetchTopicVideos(courseId)
    }
  }
  onSelect = (value) => {
    const { onValueSelect, uniqueName } = this.props
    onValueSelect(value, uniqueName, VIDEO)
  }

  onDeselect = (value) => {
    const { onValueDeselect, uniqueName } = this.props
    onValueDeselect(value, VIDEO, uniqueName)
  }
  render() {
    const { searchVal } = this.state
    const { selectedValue, videoList,
      selectedData, videoFetchingStatus
    } = this.props
    return (
      <>
        <TopContainer justify='center'>
          <SelectInput
            searchVal={searchVal}
            placeholder='Search Video title'
            loading={videoFetchingStatus && get(videoFetchingStatus.toJS(), 'loading')}
            values={selectedValue}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            onChange={value => this.setState({ searchVal: value })}
            data={videoList}
          />
        </TopContainer>
        {
          selectedData.map(({ id, ...data }) => (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              key={id}
            >
              <VideoView
                video={data}
                onDelete={() => this.onDeselect({ id, key: id, ...data })}
              />
            </div>
          ))
        }
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  videoFetchingStatus: state.data.getIn(['videos', 'fetchStatus', 'videos']),
})

export default connect(mapStateToProps)(Videos)
