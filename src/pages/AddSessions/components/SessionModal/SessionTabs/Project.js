import { get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { fetchTopicProjects } from '../../../../../actions/courseMaker'
import { PROJECT } from '../../../../../constants/CourseComponents'
import { TopContainer } from '../../../AddSessions.styles'
import SelectInput from '../../SelectInput'
import { ProjectView } from '../TopicComponents'

class Project extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchVal: '',
    }
  }
  componentDidMount = async () => {
    const { projectList, courseId } = this.props
    if (projectList.length === 0) {
      await fetchTopicProjects(courseId, PROJECT)
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { courseId } = this.props
    if (prevProps.courseId !== courseId
      && courseId) {
      await fetchTopicProjects(courseId, PROJECT)
    }
  }
  onSelect = (value) => {
    const { onValueSelect, uniqueName } = this.props
    onValueSelect(value, uniqueName, PROJECT)
  }

  onDeselect = (value) => {
    const { onValueDeselect, uniqueName } = this.props
    onValueDeselect(value, PROJECT, uniqueName)
  }
  render() {
    const { searchVal } = this.state
    const { selectedValue,
      selectedData,
      projectFetchingStatus,
      projectList
    } = this.props
    return (
      <>
        <TopContainer justify='center'>
          <SelectInput
            searchVal={searchVal}
            placeholder='Search Project'
            loading={projectFetchingStatus && get(projectFetchingStatus.toJS(), 'loading')}
            values={selectedValue}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            data={projectList}
            onChange={value => this.setState({ searchVal: value })}
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
              <ProjectView
                project={data}
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
  projectFetchingStatus: state.data.getIn(['blockBasedProjects', 'fetchStatus', 'project']),
})

export default connect(mapStateToProps)(Project)
