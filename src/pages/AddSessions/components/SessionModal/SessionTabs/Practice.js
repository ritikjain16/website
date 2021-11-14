import { get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { fetchTopicProjects } from '../../../../../actions/courseMaker'
import { PRACTICE } from '../../../../../constants/CourseComponents'
import { TopContainer } from '../../../AddSessions.styles'
import SelectInput from '../../SelectInput'
import { PracticeView } from '../TopicComponents'

class Practice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchVal: '',
    }
  }
  componentDidMount = async () => {
    const { practiceList, courseId } = this.props
    if (practiceList.length === 0) {
      await fetchTopicProjects(courseId, PRACTICE)
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { courseId } = this.props
    if (prevProps.courseId !== courseId
      && courseId) {
      await fetchTopicProjects(courseId, PRACTICE)
    }
  }
  onSelect = (value) => {
    const { onValueSelect, uniqueName } = this.props
    onValueSelect(value, uniqueName, PRACTICE)
  }

  onDeselect = (value) => {
    const { onValueDeselect, uniqueName } = this.props
    onValueDeselect(value, PRACTICE, uniqueName)
  }
  render() {
    const { searchVal } = this.state
    const { selectedValue,
      selectedData,
      practiceFetchingStatus,
      practiceList
    } = this.props
    return (
      <>
        <TopContainer justify='center'>
          <SelectInput
            searchVal={searchVal}
            placeholder='Search Practice'
            onChange={value => this.setState({ searchVal: value })}
            loading={practiceFetchingStatus && get(practiceFetchingStatus.toJS(), 'loading')}
            values={selectedValue}
            onSelect={this.onSelect}
            onDeselect={this.onDeselect}
            data={practiceList}
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
              <PracticeView
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
  practiceFetchingStatus: state.data.getIn(['blockBasedProjects', 'fetchStatus', 'practice']),
})

export default connect(mapStateToProps)(Practice)
