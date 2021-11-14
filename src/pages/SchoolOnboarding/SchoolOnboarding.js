import React, { Component } from 'react'
import { get, sortBy } from 'lodash'
import { SyncOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import {
  fetchSchoolList, fetchSchoolGrades, fetchCampaigns
} from '../../actions/SchoolOnboarding'
import {
  FlexContainer, SchoolDetails, StyledButton, StyledDivider,
} from './SchoolOnBoarding.style'
import {
  SchoolSectionNav, DashboardCounts, GradesTab, StudentsTab,
  SearchInput, CampaignTab, BatchesTab, AddStudentModal, BatchActionTabs
} from './components'
import getFullPath from '../../utils/getFullPath'
import copyToClipboard from '../../utils/copyToClipboard'

class SchoolOnboarding extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chosenSchool: '',
      chosenGrade: '',
      activeTab: get(props, 'match.path'),
      showBatches: false,
      schoolsList: [],
      classGrades: [],
      campaigns: [],
      addStudentModal: false,
      modalTitle: '',
      editStudent: null,
      sectionToAdd: '',
      gradeToAdd: '',
      chosenCampaign: '',
      completeCampaign: [],
      loading: false,
      coursesList: [],
      dashboardCount: {}
    }
  }
  showBatchesAction = () => {
    const { match } = this.props
    const activeRoute = get(match, 'path')
    const tabsArray = [
      '/sms/school-dashboard/grade',
      '/sms/school-dashboard/:schoolId/grade',
      '/sms/school-dashboard/:schoolId/students',
      '/sms/school-dashboard/:schoolId/campaigns',
      '/sms/school-dashboard/:schoolId/batches'
    ]
    if (!tabsArray.includes(activeRoute)) {
      return true
    }
    return false
  }
  async componentDidMount() {
    const { schools } = await fetchSchoolList()
    this.setState({ schoolsList: schools || [] }, () => {
      const { schoolsList } = this.state
      const { history, match: { params } } = this.props
      if (params.schoolId) {
        this.setState({
          chosenSchool: params.schoolId,
        })
      } else if (schoolsList.length > 0) {
        this.setState({
          chosenSchool: get(schoolsList[0], 'id'),
        },
        () => history.push(`/sms/school-dashboard/${this.state.chosenSchool}/grade`))
      }
    })
    this.setState({
      showBatches: this.showBatchesAction()
    })
  }
  componentDidUpdate = async (prevProps, prevState) => {
    const { chosenSchool, activeTab, campaigns } = this.state
    const { schoolClassGradesFetchStatus, match,
      schoolClassesAddStatus, schoolClassesDeleteStatus,
      campaignsFetchStatus, campaignsUpdateStatus, campaignsAddStatus,
      campaignsUpdateBatchStatus, campaignsDeleteStatus,
      parentSignUpStatus, courseFetchingStatus } = this.props
    if (get(match, 'path') !== get(prevProps, 'match.path')) {
      this.setState({
        activeTab: get(this.props, 'match.path'),
        showBatches: this.showBatchesAction()
      })
    }
    if (prevState.chosenSchool !== chosenSchool && chosenSchool) {
      if (activeTab === '/sms/school-dashboard/:schoolId/campaigns' ||
        activeTab === '/sms/school-dashboard/:schoolId/batches') {
        await fetchCampaigns(chosenSchool)
      }
      await fetchSchoolGrades(chosenSchool)
    }
    if (prevState.activeTab !== activeTab &&
      (activeTab === '/sms/school-dashboard/:schoolId/campaigns' ||
      activeTab === '/sms/school-dashboard/:schoolId/batches') &&
      campaigns.length === 0 && chosenSchool) {
      fetchCampaigns(chosenSchool)
    }
    if ((schoolClassGradesFetchStatus && !get(schoolClassGradesFetchStatus.toJS(), 'loading')
      && get(schoolClassGradesFetchStatus.toJS(), 'success') &&
      (prevProps.schoolClassGradesFetchStatus !== schoolClassGradesFetchStatus))) {
      this.setState({
        classGrades:
          this.props.schoolClassesGrades && sortBy(this.props.schoolClassesGrades.toJS(), 'order'),
        dashboardCount: this.props.schoolDashboardCount && this.props.schoolDashboardCount.toJS(),
        chosenGrade: ''
      }, () => {
        const { classGrades } = this.state
        if (classGrades.length > 0) {
          this.setState({
            chosenGrade:
              prevState.chosenGrade ?
                prevState.chosenGrade :
                get(classGrades[0], 'grade')
          })
        }
      })
    }


    const campaignFetchingStatus = campaignsFetchStatus && !get(campaignsFetchStatus.toJS(), 'loading')
      && get(campaignsFetchStatus.toJS(), 'success') && (prevProps.campaignsFetchStatus !== campaignsFetchStatus)
    const campaignUpdatingStatus = campaignsUpdateStatus && !get(campaignsUpdateStatus.toJS(), 'loading')
      && get(campaignsUpdateStatus.toJS(), 'success') && (prevProps.campaignsUpdateStatus !== campaignsUpdateStatus)
    const campaignAddingStatus = campaignsAddStatus && !get(campaignsAddStatus.toJS(), 'loading')
      && get(campaignsAddStatus.toJS(), 'success') && (prevProps.campaignsAddStatus !== campaignsAddStatus)
    const campaignsUpdatingBatchStatus = campaignsUpdateBatchStatus && !get(campaignsUpdateBatchStatus.toJS(), 'loading')
      && get(campaignsUpdateBatchStatus.toJS(), 'success') && (prevProps.campaignsUpdateBatchStatus !== campaignsUpdateBatchStatus)
    const campaignDeletingStatus = campaignsDeleteStatus && !get(campaignsDeleteStatus.toJS(), 'loading')
      && get(campaignsDeleteStatus.toJS(), 'success') && (prevProps.campaignsDeleteStatus !== campaignsDeleteStatus)
    if (campaignUpdatingStatus
      || campaignAddingStatus
      || campaignDeletingStatus
      || campaignsUpdatingBatchStatus) {
      await fetchSchoolGrades(chosenSchool)
      this.getCampaigns()
    }

    if (campaignFetchingStatus) {
      this.getCampaigns()
    }


    const schoolAddingStatus = schoolClassesAddStatus && !get(schoolClassesAddStatus.toJS(), 'loading')
      && get(schoolClassesAddStatus.toJS(), 'success') && (prevProps.schoolClassesAddStatus !== schoolClassesAddStatus)
    const schoolDeletingStatus = schoolClassesDeleteStatus && !get(schoolClassesDeleteStatus.toJS(), 'loading')
      && get(schoolClassesDeleteStatus.toJS(), 'success') && (prevProps.schoolClassesDeleteStatus !== schoolClassesDeleteStatus)
    const studentAddingStatus = parentSignUpStatus && !get(parentSignUpStatus.toJS(), 'loading')
      && get(parentSignUpStatus.toJS(), 'success') && (prevProps.parentSignUpStatus !== parentSignUpStatus)
    if (schoolAddingStatus || schoolDeletingStatus || studentAddingStatus) {
      await fetchSchoolGrades(chosenSchool)
    }


    if ((courseFetchingStatus && !get(courseFetchingStatus.toJS(), 'loading')
      && get(courseFetchingStatus.toJS(), 'success') &&
      (prevProps.courseFetchingStatus !== courseFetchingStatus))) {
      this.setState({
        coursesList: this.props.courses && this.props.courses.toJS()
      })
    }
  }

  getCampaigns = () => {
    const { chosenSchool } = this.state
    this.setState({
      campaigns: this.props.campaigns ? this.props.campaigns.toJS().filter((cam) => get(cam, 'school.id') === chosenSchool) : []
    }, () => {
      if (this.state.campaigns) {
        this.setState({
          completeCampaign:
            this.state.campaigns.filter(({ batchCreationStatus }) => batchCreationStatus === 'complete'),
        }, () => {
          const { completeCampaign } = this.state
          if (completeCampaign.length > 0) {
            this.setState({
              chosenCampaign: get(completeCampaign[0], 'id')
            })
          }
        })
      }
    })
  }
  getSchoolName = (id) => {
    const { schoolsList, chosenSchool } = this.state
    let schoolName = ''
    if (schoolsList && schoolsList.length > 0 && chosenSchool) {
      schoolName = get(schoolsList.find((school) => get(school, 'id') === id), 'name')
    }
    return schoolName
  }

  onSchoolChange = () => {
    let newActiveTab = ''
    const { history } = this.props
    const { chosenSchool, activeTab } = this.state
    if (activeTab.includes('grade')) {
      newActiveTab = `/sms/school-dashboard/${chosenSchool}/grade`
    }
    if (activeTab.includes('students')) {
      newActiveTab = `/sms/school-dashboard/${chosenSchool}/students`
    }
    if (activeTab.includes('campaigns')) {
      newActiveTab = `/sms/school-dashboard/${chosenSchool}/campaigns`
    }
    if (activeTab.includes('batches')) {
      newActiveTab = `/sms/school-dashboard/${chosenSchool}/batches`
    }
    history.push(newActiveTab)
  }


  changeTab = (value, selectedGrade) => {
    const { history } = this.props
    const { chosenSchool } = this.state
    if (selectedGrade) {
      this.setState({
        activeTab: `/sms/school-dashboard/${chosenSchool}/students`,
        chosenGrade: selectedGrade,
      }, () => history.push(this.state.activeTab))
    } else {
      let newActiveTab = ''
      if (value.includes('grade')) {
        newActiveTab = `/sms/school-dashboard/${chosenSchool}/grade`
      }
      if (value.includes('students')) {
        newActiveTab = `/sms/school-dashboard/${chosenSchool}/students`
      }
      if (value.includes('campaigns')) {
        newActiveTab = `/sms/school-dashboard/${chosenSchool}/campaigns`
      }
      if (value.includes('batches')) {
        newActiveTab = `/sms/school-dashboard/${chosenSchool}/batches`
      }
      this.setState({
        activeTab: newActiveTab
        // eslint-disable-next-line react/prop-types
      }, () => history.push(this.state.activeTab))
    }
  }


  selectCampaignBatch = (value) => {
    const { history } = this.props
    const { chosenSchool } = this.state
    this.setState({
      activeTab: `/sms/school-dashboard/${chosenSchool}/batches`,
      chosenCampaign: value,
    }, () => history.push(this.state.activeTab))
  }

  openStudentModal = (title, data, section, grade) => {
    if (section && grade) {
      this.setState({
        addStudentModal: true,
        modalTitle: title,
        sectionToAdd: section,
        gradeToAdd: grade
      })
    } else {
      this.setState({
        addStudentModal: true,
        modalTitle: title,
        editStudent: data
      })
    }
  }


  closeStudentModal = () => {
    this.setState({
      addStudentModal: false,
      modalTitle: '',
      sectionToAdd: '',
      gradeToAdd: '',
      editStudent: null
    })
  }


  getRemainingGrades = () => {
    const { campaigns, classGrades } = this.state
    if (campaigns.length > 0) {
      const classArray = []
      campaigns.forEach(({ classes = [] }) => {
        classes.forEach(cls => {
          classArray.push(cls)
        })
      })
      const gradesArray = [...new Set(classArray.map(({ grade }) => grade))]
      const remainingGrades = []
      classGrades.forEach(classGrade => {
        if (!gradesArray.includes(get(classGrade, 'grade'))) {
          remainingGrades.push(classGrade)
        }
      })
      return remainingGrades
    }
    return classGrades
  }


  refreshCampaigns = async () => {
    const { chosenSchool } = this.state
    if (chosenSchool) {
      this.setState({ loading: true })
      fetchSchoolGrades(chosenSchool)
      await fetchCampaigns(chosenSchool)
      this.setState({ loading: false })
    }
  }


  renderTabs = () => {
    const {
      activeTab, classGrades, chosenGrade, chosenSchool,
      campaigns, chosenCampaign, completeCampaign,
      coursesList
    } = this.state
    const { history } = this.props
    const datas = this.getRemainingGrades()
    if (activeTab === '/sms/school-dashboard/:schoolId/grade') {
      return (
        <GradesTab
          viewStudents={this.changeTab}
          classGrades={classGrades}
          schoolName={this.getSchoolName(chosenSchool)}
          schoolId={chosenSchool}
        />
      )
    }
    if (activeTab === '/sms/school-dashboard/:schoolId/students') {
      return (
        <StudentsTab
          classGrades={classGrades}
          chosenGrade={chosenGrade}
          chosenSchool={chosenSchool}
          selectGrade={(value) => this.setState({ chosenGrade: value })}
          onStudentEdit={data => this.openStudentModal('update Student', data)}
          onStudentAdd={(section, grade) => this.openStudentModal('Add Student', null, section, grade)}
        />
      )
    }
    if (activeTab === '/sms/school-dashboard/:schoolId/campaigns') {
      return (
        <CampaignTab
          classGrades={datas}
          schoolName={this.getSchoolName(chosenSchool)}
          schoolId={chosenSchool}
          campaigns={campaigns}
          selectCampaignBatch={this.selectCampaignBatch}
          coursesList={coursesList}
        />
      )
    }
    if (activeTab === '/sms/school-dashboard/:schoolId/batches') {
      return (
        <BatchesTab
          history={history}
          chosenCampaign={chosenCampaign}
          campaigns={completeCampaign}
          schoolId={chosenSchool}
          selectCampaign={(value) => this.setState({ chosenCampaign: value })}
        />
      )
    }
    return null
  }
  getSchoolCode = (code) => {
    let link = ''
    if (process.env.REACT_APP_NODE_ENV === 'staging') {
      link = `https://tekie-web-staging.herokuapp.com/login?schoolCode=${code}`
    } else {
      link = `https://www.tekie.in/login?schoolCode=${code}`
    }
    return link
  }

  getSchoolCodeLink = () => {
    const { schoolDashboardCount } = this.props
    if (schoolDashboardCount && schoolDashboardCount.toJS()
      && schoolDashboardCount.toJS().schoolCampaignCode) {
      return (
        <p>School Campaign Code:
          <a href={this.getSchoolCode(get(schoolDashboardCount.toJS(), 'schoolCampaignCode'))} target='_blank' rel='noopener noreferrer' >
            {this.getSchoolCode(get(schoolDashboardCount.toJS(), 'schoolCampaignCode'))}
          </a>
          <Tooltip title='Copy'>
            <Button icon='copy'
              style={{ marginLeft: '10px' }}
              onClick={() =>
                copyToClipboard(this.getSchoolCode(get(schoolDashboardCount.toJS(), 'schoolCampaignCode')))}
            />
          </Tooltip>
        </p>
      )
    }
    return null
  }
  render() {
    const {
      chosenSchool, schoolsList, activeTab,
      addStudentModal, modalTitle, editStudent,
      sectionToAdd, gradeToAdd, showBatches,
      loading, dashboardCount
    } = this.state
    const { schoolDashboardCount, history, match } = this.props
    return (
      <div>
        <AddStudentModal
          visible={addStudentModal}
          title={modalTitle}
          schoolName={this.getSchoolName(chosenSchool)}
          schoolId={chosenSchool}
          onClose={this.closeStudentModal}
          editStudent={editStudent}
          gradeToAdd={gradeToAdd}
          sectionToAdd={sectionToAdd}
        />
        {
          showBatches ? (
            <BatchActionTabs
              history={history}
              match={match}
              schoolId={chosenSchool}
            />
          ) : (
            <>
              <FlexContainer>
                <SearchInput
                  value={chosenSchool}
                  placeholder='Select a School'
                  onChange={(value) => this.setState({ chosenSchool: value, campaigns: [] },
                    () => this.onSchoolChange())}
                  dataArray={schoolsList}
                />
              </FlexContainer>
              <SchoolDetails>
                <FlexContainer>
                  <div className='schoolOnBoarding___schoolName'>
                    <h1>{schoolDashboardCount
                      && schoolDashboardCount.toJS()
                        && schoolDashboardCount.toJS().logo
                        && <img
                          style={{ height: '2vw', width: '2vw', marginRight: '8px', objectFit: 'contain' }}
                          src={getFullPath(schoolDashboardCount.toJS().logo)}
                          alt='schoolLogo'
                        />}
                      {this.getSchoolName(chosenSchool)}
                    </h1>
                    <p>{schoolDashboardCount
                      && schoolDashboardCount.toJS()
                        && schoolDashboardCount.toJS().hubspotId &&
                        <span>Hubspot Id: {schoolDashboardCount.toJS().hubspotId}</span>}
                    </p>
                    {this.getSchoolCodeLink()}
                  </div>
                  <StyledButton type='primary' onClick={() => this.openStudentModal('Add Student')}>
                    Add Students
                  </StyledButton>
                </FlexContainer>
                <DashboardCounts
                  dashboardCount={dashboardCount}
                />
              </SchoolDetails>
              <StyledDivider />
              <div style={{ padding: '0 1.5vw' }}>
                <FlexContainer buttonGroup noPadding>
                  <SchoolSectionNav
                    activeTab={activeTab}
                    changeTab={this.changeTab}
                  />
                  {activeTab && activeTab.includes('campaigns') &&
                    <SyncOutlined
                      style={{ fontSize: '1.5vw', marginRight: '10px' }}
                      onClick={loading ? null : this.refreshCampaigns}
                      spin={loading}
                    />}
                </FlexContainer>
                {this.renderTabs()}
              </div>
            </>
          )
        }
      </div>
    )
  }
}

SchoolOnboarding.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    params: PropTypes.shape({
      schoolId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.shape({}).isRequired,
  schoolClassGradesFetchStatus: PropTypes.shape({}).isRequired,
  schoolClassesAddStatus: PropTypes.shape({}).isRequired,
  schoolClassesDeleteStatus: PropTypes.shape({}).isRequired,
  campaignsFetchStatus: PropTypes.shape({}).isRequired,
  campaignsUpdateStatus: PropTypes.shape({}).isRequired,
  campaignsAddStatus: PropTypes.shape({}).isRequired,
  campaignsUpdateBatchStatus: PropTypes.shape({}).isRequired,
  campaignsDeleteStatus: PropTypes.shape({}).isRequired,
  schoolClassesGrades: PropTypes.arrayOf({}).isRequired,
  campaigns: PropTypes.arrayOf({}).isRequired
}

export default SchoolOnboarding
