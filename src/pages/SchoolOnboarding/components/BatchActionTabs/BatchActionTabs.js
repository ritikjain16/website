import { get } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import AllotMentor from './AttotMentor'
import BatchActionNav from './BatchActionNav'
import ScheduleTime from './ScheduleTime'
import SingleBatch from './SingleBatch'
import { fetchBatchDetails } from '../../../../actions/SchoolOnboarding'

class BatchActionTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batchesData: {},
      batchId: get(props, 'match.params.batchId'),
      schoolId: get(props, 'match.params.schoolId'),
      activeTab: get(props, 'match.url')
    }
  }
  componentDidMount = async () => {
    const { history } = this.props
    const { batchId, schoolId } = this.state
    if (batchId) {
      await fetchBatchDetails(batchId)
    } else {
      history.push(`/sms/school-dashboard/${schoolId}/batches`)
    }
  }
  componentDidUpdate = async (prevProps) => {
    const { match, batchFetchingStatus, batchUpdatingStatus } = this.props
    if (get(match, 'url') !== get(prevProps, 'match.url')) {
      this.setState({
        activeTab: get(this.props, 'match.url')
      })
    }

    if (batchFetchingStatus && !get(batchFetchingStatus.toJS(), 'loading') &&
      get(batchFetchingStatus.toJS(), 'success')) {
      if (get(prevProps, 'batchData') !== get(this.props, 'batchData')) {
        this.setState({
          batchesData:
            this.props.batchData
            && this.props.batchData.toJS()
        })
      }
    }

    if ((batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'success') &&
      (prevProps.batchUpdatingStatus !== batchUpdatingStatus))) {
      await fetchBatchDetails(this.state.batchId)
    }
  }
  changeTab = (value) => {
    const { history } = this.props
    this.setState({
      activeTab: value
      // eslint-disable-next-line react/prop-types
    }, () => history.push(this.state.activeTab))
  }
  renderTabs = () => {
    const { activeTab, batchesData, batchId, schoolId } = this.state
    const { studentProfiles, studentProfilesFetchStatus,
      batchUpdatingStatus, batchUpdatingError,
      isStudentsSearchFetching, studentsSearch,
      batchSessions, batchSessionsFetchingStatus } = this.props
    if (activeTab.includes('scheduling')) {
      return (
        <ScheduleTime
          batchesData={batchesData}
          batchId={batchId}
          batchUpdatingStatus={batchUpdatingStatus}
          batchUpdatingError={batchUpdatingError}
          batchSessions={batchSessions}
          batchSessionsFetchingStatus={batchSessionsFetchingStatus}
        />
      )
    }
    if (activeTab.includes('mentors')) {
      return (
        <AllotMentor
          batchesData={batchesData}
          batchUpdatingStatus={batchUpdatingStatus}
          batchUpdatingError={batchUpdatingError}
          batchId={batchId}
        />
      )
    }
    if (activeTab.includes('students')) {
      return (
        <SingleBatch
          batchUpdatingStatus={batchUpdatingStatus}
          batchUpdatingError={batchUpdatingError}
          studentProfiles={studentProfiles}
          studentProfilesFetchStatus={studentProfilesFetchStatus}
          batchId={batchId}
          batchesData={batchesData}
          isStudentsSearchFetching={isStudentsSearchFetching}
          studentsSearch={studentsSearch && studentsSearch.toJS()}
          schoolId={schoolId}
        />
      )
    }
  }
  render() {
    const { batchesData, batchId, activeTab } = this.state
    const { history, schoolId } = this.props
    return (
      <>
        <BatchActionNav
          onBackClick={() => history.push(`/sms/school-dashboard/${schoolId}/batches`)}
          viewBatchDetails={batchesData}
          batchId={batchId}
          activeTab={activeTab}
          schoolId={schoolId}
          changeTab={this.changeTab}
        />
        {this.renderTabs()}
      </>
    )
  }
}

BatchActionTabs.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      batchId: PropTypes.string.isRequired,
      schoolId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  schoolId: PropTypes.string.isRequired,
}

export default BatchActionTabs
