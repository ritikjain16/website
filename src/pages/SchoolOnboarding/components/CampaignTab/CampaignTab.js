/* eslint-disable no-unused-vars */
import React from 'react'
import { get } from 'lodash'
import { Button, notification, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CampaignBox, FlexContainer, StyledButton,
  StyledCheckbox, StyledRadio
} from '../../SchoolOnBoarding.style'
import GradeCards from '../GradeCards'
import CampaignModal from './CampaignModal'
import CreateCampaignModal from './CreateCampaignModal'
import CampaignCard from './CampaignCard'
import {
  addCampaign, addPosterToCampaign, updateCampaign, fetchCampaigns,
  fetchCourses, fetchCampaignDetails
} from '../../../../actions/SchoolOnboarding'
import EditCampaignModal from './EditCampaignModal'
import campaignTypes from '../../../../constants/campaignType'
import SchoolInput from '../SchoolInput'
import SlotCalender from './SlotCalender'

const { b2b2cEvent, b2b } = campaignTypes

class CampaignTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      campaignType: '',
      actionType: '',
      campaignTitle: '',
      openModal: false,
      modalTitle: '',
      registerLink: '',
      modalType: '',
      campaignStatus: '',
      selectedBatch: [],
      batchRule: '',
      editCampaignId: '',
      editCampaign: {},
      studentsPerBatch: 10,
      modalContent: null,
      editcampaignBatches: null
    }
  }

  componentDidMount = async () => {
    if (this.props.coursesList && this.props.coursesList.length === 0) {
      await fetchCourses()
    }
  }
  componentDidUpdate = async (prevProps, prevState) => {
    const { campaignsUpdateStatus, campaignsUpdateFailure, campaignsEditStatus,
      campaignsDeleteStatus, campaignsDeleteFailure, campaignsAddStatus,
      campaignAddFailure } = this.props
    const { actionType } = this.state
    if ((campaignsUpdateStatus && !get(campaignsUpdateStatus.toJS(), 'loading')
      && get(campaignsUpdateStatus.toJS(), 'success') &&
      (prevProps.campaignsUpdateStatus !== campaignsUpdateStatus))) {
      notification.success({
        message: 'updated Successfully'
      })
      this.onModalClose()
      this.setState({ actionType: '' })
    } else if (campaignsUpdateStatus && !get(campaignsUpdateStatus.toJS(), 'loading')
      && get(campaignsUpdateStatus.toJS(), 'failure') &&
      (prevProps.campaignsUpdateFailure !== campaignsUpdateFailure)) {
      if (campaignsUpdateFailure && campaignsUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(campaignsUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
    if (prevState.actionType !== actionType && actionType === '') {
      this.setState({
        campaignType: '',
        campaignTitle: '',
        campaignStatus: '',
        selectedBatch: [],
        batchRule: '',
        editCampaignId: '',
        editCampaign: {},
        modalCampaignTitle: '',
        editcampaignBatches: null
      })
    }

    if (campaignsAddStatus && !get(campaignsAddStatus.toJS(), 'loading')
      && get(campaignsAddStatus.toJS(), 'failure') &&
      (prevProps.campaignAddFailure !== campaignAddFailure)) {
      if (campaignAddFailure && campaignAddFailure.toJS().length > 0) {
        notification.error({
          message: get(get(campaignAddFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }

    const campaignUpdatingStatus = campaignsEditStatus && !get(campaignsEditStatus.toJS(), 'loading')
      && get(campaignsEditStatus.toJS(), 'success') && (prevProps.campaignsEditStatus !== campaignsEditStatus)
    if (campaignUpdatingStatus) {
      notification.success({
        message: 'updated Successfully'
      })
    }
    const campaignDeletingStatus = campaignsDeleteStatus && !get(campaignsDeleteStatus.toJS(), 'loading')
      && get(campaignsDeleteStatus.toJS(), 'success') && (prevProps.campaignsDeleteStatus !== campaignsDeleteStatus)
    if (campaignDeletingStatus) {
      notification.success({
        message: 'Campaign deleted successfully'
      })
    } else if (campaignsDeleteStatus && !get(campaignsDeleteStatus.toJS(), 'loading')
      && get(campaignsDeleteStatus.toJS(), 'failure') &&
      (prevProps.campaignsDeleteFailure !== campaignsDeleteFailure)) {
      if (campaignsDeleteFailure && campaignsDeleteFailure.toJS().length > 0) {
        notification.error({
          message: get(get(campaignsDeleteFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  onStateChange = (name, value) => {
    this.setState({ [name]: value })
  }
  onOpenModal = (value, modalContent) => {
    if (!value) {
      this.setState({
        openModal: true,
        modalType: 'ConfirmBatchDetails',
        modalTitle: 'Review Batch Creation',
      })
    } else {
      this.setState({
        openModal: true,
        modalTitle: 'Student Registration Link',
        registerLink: value,
        modalType: 'linkModal',
        modalContent,
      })
    }
  }
  onModalClose = () => {
    this.setState({
      openModal: false,
      modalTitle: '',
      registerLink: '',
      modalCampaignTitle: ''
    })
  }
  onCreateBatch = async (campaign) => {
    let campaignDetails = {}
    let studentsPerBatch = 0
    if (get(campaign, 'type') === b2b2cEvent) {
      const { campaign: data } = await fetchCampaignDetails(get(campaign, 'id'))
      if (data && data.id) {
        studentsPerBatch = get(data, 'batchRules.batchSize', 0)
        const campaignClasses = get(data, 'classes', [])
        let classes = []
        campaignClasses.forEach(cls => {
          const isExist = classes.find(d => get(d, 'grade') === get(cls, 'grade'))
          if (isExist) {
            isExist.sections = [...isExist.sections,
              {
                section: get(cls, 'section'),
              }]
            isExist.studentCount += get(cls, 'studentsMeta.count', 0)
            const newSchoolClasses = classes.filter((d) => get(d, 'grade') !== get(isExist, 'grade'))
            classes = [...newSchoolClasses, isExist]
          } else {
            classes.push({
              grade: get(cls, 'grade'),
              sections: [{
                section: get(cls, 'section'),
              }],
              studentCount: get(cls, 'studentsMeta.count', 0)
            })
          }
        })
        campaignDetails = { ...data, classes }
      }
      this.setState({
        editCampaign: campaign,
        editCampaignId: get(campaign, 'id'),
        campaignType: get(campaign, 'type'),
        studentsPerBatch,
        campaignTitle: get(campaign, 'title'),
        editcampaignBatches: campaignDetails,
        actionType: 'ChooseGrade'
      })
    } else if (get(campaign, 'type') === b2b) {
      this.setState({
        editCampaign: campaign,
        editCampaignId: get(campaign, 'id'),
        campaignType: get(campaign, 'type'),
        campaignTitle: get(campaign, 'title'),
        actionType: 'ChooseGrade'
      })
    }
  }
  onCampaignSubmit = async (values, webImage, mobileImage) => {
    const { campaignType, campaignTitle, selectedCourse } = values
    const { schoolId } = this.props
    const { editCampaignId } = this.state
    if (editCampaignId) {
      updateCampaign({
        input: { title: campaignTitle, type: campaignType },
        campaignId: editCampaignId,
        courseConnectId: selectedCourse
      }).then(async resp => {
        if ((webImage || mobileImage) && resp.updateCampaign && resp.updateCampaign.id) {
          if (webImage) {
            await addPosterToCampaign({
              file: webImage,
              typeField: 'poster',
              campaignId: resp.updateCampaign.id,
              prevFileId: get(resp.updateCampaign, 'poster.id')
            })
          }
          if (mobileImage) {
            await addPosterToCampaign({
              file: mobileImage,
              typeField: 'posterMobile',
              campaignId: resp.updateCampaign.id,
              prevFileId: get(resp.updateCampaign, 'posterMobile.id')
            })
          }
          await fetchCampaigns(schoolId)
        }
        if (resp.updateCampaign && resp.updateCampaign.id) {
          this.setState({
            campaignStatus: 'created',
            campaignTitle,
            campaignType,
            editCampaignId: resp.updateCampaign.id
          }, () => {
            if (get(resp.updateCampaign, 'batchCreationStatus') === 'inProgress'
              || (get(resp.updateCampaign, 'type') === b2b &&
                get(resp.updateCampaign, 'batchCreationStatus') === 'complete')) {
              this.setState({
                actionType: ''
              })
            }
          })
        }
      })
    } else {
      await addCampaign({
        input: { title: campaignTitle, type: campaignType },
        courseConnectId: selectedCourse,
        schoolConnectId: schoolId
      }).then(async res => {
        if ((webImage || mobileImage) && res.addCampaign && res.addCampaign.id) {
          if (webImage) {
            await addPosterToCampaign({
              file: webImage,
              typeField: 'poster',
              campaignId: res.addCampaign.id,
            })
          }
          if (mobileImage) {
            await addPosterToCampaign({
              file: mobileImage,
              typeField: 'posterMobile',
              campaignId: res.addCampaign.id,
            })
          }
          await fetchCampaigns(schoolId)
        }
        if (res.addCampaign && res.addCampaign.id) {
          this.setState({
            campaignStatus: 'created',
            campaignTitle,
            campaignType,
            editCampaignId: res.addCampaign.id,
          })
        }
      })
    }
  }
  onUpdateBatches = async () => {
    const { selectedBatch, batchRule, editCampaignId } = this.state
    let classesIds = []
    selectedBatch.forEach(({ sections }) => {
      const classIds = sections.map(({ id }) => id)
      classesIds = [...classesIds, ...classIds]
    })
    await updateCampaign({
      input: {
        batchRules: {
          batchCreationBasis: batchRule
        },
        batchCreationStatus: 'inProgress'
      },
      campaignId: editCampaignId,
      classesIds,
      key: 'addBatches'
    })
  }
  onSlotsUpdate = async (selectedSlots) => {
    const { studentsPerBatch, selectedBatch, editCampaignId } = this.state
    let classesIds = []
    selectedBatch.forEach(({ sections }) => {
      const classIds = sections.map(({ id }) => id)
      classesIds = [...classesIds, ...classIds]
    })
    const slots = []
    selectedSlots.forEach(slot => {
      get(slot, 'allottedMentors', []).forEach(mentor => {
        if (get(mentor, 'mentorSessionConnectId')) {
          const slotInput = {
            bookingDate: get(slot, 'bookingDate'),
            allottedMentorConnectId: get(mentor, 'id'),
            mentorSessionConnectId: get(mentor, 'mentorSessionConnectId')
          }
          for (const property in slot) {
            if (property.startsWith('slot')) {
              if (slot[property] === true) {
                slotInput[property] = true
              }
            }
          }
          slots.push(slotInput)
        }
      })
    })
    await updateCampaign({
      input: {
        batchRules: { batchSize: Number(studentsPerBatch) },
        timeTableRules: {
          replace: slots
        },
        batchCreationStatus: 'inProgress'
      },
      campaignId: editCampaignId,
      classesIds,
      key: 'addBatches'
    })
  }
  selectBatch = (checked, data) => {
    const {
      selectedBatch
    } = this.state
    const { classGrades } = this.props
    if (data === 'All') {
      this.setState({ selectedBatch: checked ? classGrades : [] })
    } else {
      // eslint-disable-next-line no-lonely-if
      const newBatches = [...selectedBatch]
      if (checked) {
        const isExist = newBatches.find((grade) => get(grade, 'grade') === get(data, 'grade'))
        if (!isExist) this.setState({ selectedBatch: [...newBatches, data] })
      } else {
        const isExist = newBatches.find((grade) => get(grade, 'grade') === get(data, 'grade'))
        if (isExist) {
          this.setState({
            selectedBatch: newBatches.filter((grade) => get(grade, 'grade') !== get(data, 'grade'))
          })
        }
      }
    }
  }
  renderCampaignsActions = () => {
    const { campaignStatus, campaignType, editCampaign } = this.state
    const { editCampaignFetching } = this.props
    if (campaignStatus === 'created') {
      return (
        <FlexContainer campaigns justify='center' style={{ height: '9.21vw' }}>
          <StyledButton
            loading={editCampaignFetching && get(editCampaignFetching.toJS(), 'loading')}
            type='primary'
            onClick={async () => {
              if (campaignType === b2b2cEvent && get(editCampaign, 'id')) {
                await this.onCreateBatch(editCampaign)
              }
              this.onStateChange('actionType', 'ChooseGrade')
            }}
          >Choose Grades
          </StyledButton>
        </FlexContainer>
      )
    }
    return null
  }
  renderActions = () => {
    const {
      actionType, selectedBatch, editCampaign,
      campaignType, studentsPerBatch, batchRule,
      editCampaignId, editcampaignBatches
    } = this.state
    const {
      classGrades, campaignsAddStatus, campaignsEditStatus,
      coursesList
    } = this.props
    if (actionType === 'AddCampaign') {
      return (
        <>
          {
            get(editCampaign, 'id') ? (
              <EditCampaignModal
                editCampaign={editCampaign}
                onParentStateChange={this.onStateChange}
                onSubmit={this.onCampaignSubmit}
                campaignsEditStatus={campaignsEditStatus}
                coursesList={coursesList}
              />
            ) : (
              <CreateCampaignModal
                onParentStateChange={this.onStateChange}
                editCampaignId={editCampaignId}
                onSubmit={this.onCampaignSubmit}
                campaignsAddStatus={campaignsAddStatus}
                coursesList={coursesList}
              />
            )
          }
          {this.renderCampaignsActions()}
        </>
      )
    }
    if (actionType === 'ChooseGrade'
      && campaignType !== b2b2cEvent
      && classGrades.length > 0) {
      return (
        <>
          {
            get(editCampaign, 'id') ? (
              <EditCampaignModal
                editCampaign={editCampaign}
                onParentStateChange={this.onStateChange}
                onSubmit={this.onCampaignSubmit}
                campaignsEditStatus={campaignsEditStatus}
                coursesList={coursesList}
              />
            ) : (
              <CreateCampaignModal
                onParentStateChange={this.onStateChange}
                onSubmit={this.onCampaignSubmit}
                editCampaignId={editCampaignId}
                campaignsAddStatus={campaignsAddStatus}
                coursesList={coursesList}
              />
            )
          }
          <FlexContainer campaigns
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <h1 className='campaign__ChooseGrade'>Choose Grades</h1>
            <FlexContainer style={{ padding: '2.08vw', paddingBottom: '0', width: '100%' }}>
              <FlexContainer noPadding>
                <StyledCheckbox
                  id='selectAllGrades'
                  onChange={(e) => this.selectBatch(e.target.checked, 'All')}
                  checked={selectedBatch.length === classGrades.length}
                />{' '}
                <label htmlFor='selectAllGrades' className='campaign__ChooseGrade'>Grades as unique batches</label>
              </FlexContainer>
              <Button type='link' onClick={() => this.selectBatch(false, 'All')} >
                <h3 className='campaign__clearSelection' >Clear Selection</h3>
              </Button>
            </FlexContainer>
            <FlexContainer
              campaigns
              style={{
                flexDirection: 'column',
                width: '95%',
                alignItems: 'unset',
                paddingTop: '0',
                paddingBottom: '0',
                marginLeft: 'auto',
                maxHeight: '919px',
                overflowY: 'auto'
              }}
            >
              {
                classGrades.map(classData => (
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: 'auto',
                      width: '95%',
                      alignItems: 'flex-start'
                    }}
                  >
                    <StyledCheckbox
                      style={{ margin: '1vw 0' }}
                      onChange={(e) => this.selectBatch(e.target.checked, classData)}
                      checked={selectedBatch.map(g =>
                        get(g, 'grade')).includes(get(classData, 'grade'))}
                    />{' '}
                    <GradeCards
                      style={{ margin: '1vw 0', flex: 0.9 }}
                      gradeButton
                      campaigns
                      classData={classData}
                      gradeAction={null}
                      key={classData.id}
                    />
                  </div>
                ))
              }
            </FlexContainer>
          </FlexContainer>
          <FlexContainer
            campaigns
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <h1 className='campaign__ChooseGrade'>Unique Batch Rules</h1>
            <FlexContainer noPadding style={{ padding: '2.08vw', paddingBottom: '1vw' }}>
              <StyledRadio
                name='batchRule'
                value='grade'
                id='grade'
                checked={batchRule === 'grade'}
                onChange={e => this.setState({ batchRule: e.target.value })}
              />{' '}
              <label htmlFor='grade' className='campaign__ChooseGrade'>Grades as unique batches</label>
            </FlexContainer>
            <FlexContainer noPadding style={{ paddingLeft: '2.08vw', paddingBottom: '0' }}>
              <StyledRadio
                value='section'
                name='batchRule'
                id='section'
                checked={batchRule === 'section'}
                onChange={e => this.setState({ batchRule: e.target.value })}
              />{' '}
              <label htmlFor='section' className='campaign__ChooseGrade'>Sections as unique batches</label>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer justify='center'>
            <StyledButton
              disabled={selectedBatch.length === 0 || !batchRule}
              type='primary'
              onClick={() => this.onOpenModal(null)}
            >Create Batches
            </StyledButton>
          </FlexContainer>
        </>
      )
    }
    if (actionType === 'ChooseGrade' && campaignType === b2b2cEvent) {
      return (
        <>
          {
            get(editCampaign, 'id') ? (
              <EditCampaignModal
                editCampaign={editCampaign}
                onParentStateChange={this.onStateChange}
                onSubmit={this.onCampaignSubmit}
                campaignsEditStatus={campaignsEditStatus}
                coursesList={coursesList}
              />
            ) : (
              <CreateCampaignModal
                onParentStateChange={this.onStateChange}
                onSubmit={this.onCampaignSubmit}
                campaignsAddStatus={campaignsAddStatus}
                coursesList={coursesList}
              />
            )
          }
          <FlexContainer campaigns
            style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <h1 className='campaign__ChooseGrade'>Choose Grades</h1>
            <FlexContainer style={{ padding: '2.08vw', paddingBottom: '0', width: '100%' }}>
              <FlexContainer noPadding>
                <StyledCheckbox
                  id='selectAllGrades'
                  disabled={get(editCampaign, 'batchCreationStatus') === 'complete'}
                  onChange={(e) => this.selectBatch(e.target.checked, 'All')}
                  checked={selectedBatch.length === classGrades.length}
                />{' '}
                <label htmlFor='selectAllGrades' className='campaign__ChooseGrade'>Grades as unique batches</label>
              </FlexContainer>
              <Button type='link' onClick={() => this.selectBatch(false, 'All')} >
                <h3 className='campaign__clearSelection' >Clear Selection</h3>
              </Button>
            </FlexContainer>
            <FlexContainer
              campaigns
              style={{
                flexDirection: 'column',
                width: '95%',
                alignItems: 'unset',
                paddingTop: '0',
                paddingBottom: '0',
                marginLeft: 'auto',
                maxHeight: '919px',
                overflowY: 'auto'
              }}
            >
              {
                get(editcampaignBatches, 'classes', []).map(classData => (
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: 'auto',
                      width: '95%',
                      alignItems: 'flex-start'
                    }}
                  >
                    <StyledCheckbox
                      style={{ margin: '1vw 0' }}
                      checked
                      disabled
                    />{' '}
                    <GradeCards
                      style={{ margin: '1vw 0', flex: 0.9 }}
                      gradeButton
                      campaigns
                      classData={classData}
                      gradeAction={null}
                      key={get(classData, 'grade')}
                    />
                  </div>
                ))
              }
              {
                classGrades.map(classData => (
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: 'auto',
                      width: '95%',
                      alignItems: 'flex-start'
                    }}
                  >
                    <StyledCheckbox
                      style={{ margin: '1vw 0' }}
                      onChange={(e) => this.selectBatch(e.target.checked, classData)}
                      disabled={get(editCampaign, 'batchCreationStatus') === 'complete'}
                      checked={selectedBatch.map(g =>
                        get(g, 'grade')).includes(get(classData, 'grade'))}
                    />{' '}
                    <GradeCards
                      style={{ margin: '1vw 0', flex: 0.9 }}
                      gradeButton
                      campaigns
                      classData={classData}
                      gradeAction={null}
                      key={classData.id}
                    />
                  </div>
                ))
              }
            </FlexContainer>
          </FlexContainer>
          <FlexContainer
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <h1 className='campaign__ChooseGrade'>Batch Rules</h1>
            <FlexContainer>
              <h2 htmlFor='section' className='campaign__ChooseGrade'>Students per batch</h2>
              <SchoolInput
                value={studentsPerBatch}
                bodyStyle={{ width: '10vw', marginLeft: '1.5vw' }}
                onChange={e => this.setState({ studentsPerBatch: e.target.value })}
              />
            </FlexContainer>
            <h1 style={{ marginTop: '4vw' }} className='campaign__ChooseGrade'>Scheduling</h1>
            <SlotCalender
              onSaveClick={(value) => this.onSlotsUpdate(value)}
              selectedBatch={selectedBatch}
              studentsPerBatch={studentsPerBatch}
              timeTableRules={get(editcampaignBatches, 'timeTableRules', [])}
            />
          </FlexContainer>
        </>
      )
    }
    return (
      <FlexContainer justify='space-between' style={{ display: 'grid', gridTemplateColumns: '45% 45%' }}>
        <CampaignBox createCampaign justify='center'>
          {
            classGrades.length > 0 ? (
              <StyledButton type='primary' onClick={() => this.onStateChange('actionType', 'AddCampaign')} >
                Create Campaign
              </StyledButton>
            ) : (
              <Tooltip title='No grades available for campaign creation'>
                <StyledButton type='primary' disabled >
                    Create Campaign
                </StyledButton>
              </Tooltip>
            )
          }
        </CampaignBox>
        {this.renderCampaigns()}
      </FlexContainer>
    )
  }
  renderCampaigns = () => {
    const { campaigns, classGrades, selectCampaignBatch } = this.props
    return campaigns.map((campaign) => (
      <CampaignCard
        key={campaign.id}
        campaign={campaign}
        classGrades={classGrades}
        onCreateBatch={() => this.onCreateBatch(campaign)}
        onSettingClick={() => this.setState({ editCampaign: campaign, editCampaignId: get(campaign, 'id') },
          () => this.onStateChange('actionType', 'AddCampaign'))}
        onOpenModal={() =>
          this.onOpenModal(get(campaign, 'code'), campaign)}
        selectCampaignBatch={selectCampaignBatch}
      />
    ))
  }
  render() {
    const {
      openModal, modalTitle, registerLink, modalType,
      campaignTitle, campaignType, selectedBatch, batchRule,
      modalCampaignTitle, modalContent
    } = this.state
    const { schoolName, campaignsUpdateStatus } = this.props
    return (
      <>
        <CampaignModal
          visible={openModal}
          title={modalTitle}
          registerLink={registerLink}
          modalType={modalType}
          onModalClose={this.onModalClose}
          onConfirm={this.onUpdateBatches}
          schoolName={schoolName}
          campaignType={campaignType}
          campaignTitle={campaignTitle}
          selectedBatch={selectedBatch}
          batchRule={batchRule}
          modalCampaignTitle={modalCampaignTitle}
          campaignsUpdateStatus={campaignsUpdateStatus}
          modalContent={modalContent}
        />
        {this.renderActions()}
      </>
    )
  }
}

CampaignTab.propTypes = {
  campaignsUpdateStatus: PropTypes.shape({}).isRequired,
  campaignsEditStatus: PropTypes.shape({}).isRequired,
  campaignsDeleteStatus: PropTypes.shape({}).isRequired,
  campaignsAddStatus: PropTypes.shape({}).isRequired,
  schoolId: PropTypes.string.isRequired,
  classGrades: PropTypes.arrayOf({}).isRequired,
  campaigns: PropTypes.arrayOf({}).isRequired,
  selectCampaignBatch: PropTypes.func.isRequired,
  schoolName: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  editCampaignFetching: state.data.getIn(['campaignDetails', 'fetchStatus', 'campaignDetails']),
})

export default connect(mapStateToProps)(CampaignTab)
