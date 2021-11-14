import React from 'react'
import { notification } from 'antd'
import { get } from 'lodash'
import MainModal from '../../../../components/MainModal'
import {
  CloseIcon,
  FlexContainer, ProfileCard, SectionButton, StyledDivider, UserIcon
} from '../../SchoolOnBoarding.style'
import SearchInput from '../SearchInput'
import { fetchMentors, updateSchoolBatch } from '../../../../actions/SchoolOnboarding'
import getFullPath from '../../../../utils/getFullPath'

class AllotMentor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      mentorsList: [],
      mentorValue: ''
    }
  }
  fetchMentorsList = async () => {
    await fetchMentors().then(res => {
      this.setState({
        mentorsList: [...new Set(get(res, 'users', []).map(({ id, name }) => (
          {
            id,
            name
          }
        )))]
      })
    })
  }
  componentDidUpdate = (prevProps, prevState) => {
    const { modalVisible, mentorsList } = this.state
    const { batchUpdatingStatus, batchUpdatingError } = this.props
    if (prevState.modalVisible !== modalVisible && modalVisible) {
      if (mentorsList.length === 0) {
        this.fetchMentorsList()
      }
    }

    if ((batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'success') &&
      (prevProps.batchUpdatingStatus !== batchUpdatingStatus))) {
      notification.success({
        message: 'Mentor Updated Successfully'
      })
      this.onModalClose()
    } else if (batchUpdatingStatus && !get(batchUpdatingStatus.toJS(), 'loading')
      && get(batchUpdatingStatus.toJS(), 'failure') &&
      (prevProps.batchUpdatingError !== batchUpdatingError)) {
      if (batchUpdatingError && batchUpdatingError.toJS().length > 0) {
        notification.error({
          message: get(get(batchUpdatingError.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  onModalClose = () => {
    this.setState({
      modalVisible: false,
      mentorValue: ''
    })
  }
  onSaveMentor = async () => {
    await updateSchoolBatch({
      input: {},
      batchId: get(this.props, 'batchId'),
      mentorId: this.state.mentorValue
    })
  }
  renderMentorModal = () => {
    const { batchUpdatingStatus } = this.props
    const { modalVisible, mentorsList, mentorValue } = this.state
    return (
      <MainModal
        visible={modalVisible}
        onCancel={this.onModalClose}
        maskClosable
        bodyStyle={{ padding: 0 }}
        closable={false}
        width='650px'
        centered
        destroyOnClose
        footer={null}
      >
        <FlexContainer noPadding style={{ width: '100%' }}>
          <div style={{ padding: '0.5vw 1.5vw' }}>
            <h1>Choose Mentor</h1>
            <CloseIcon onClick={this.onModalClose} />
          </div>
        </FlexContainer>
        <StyledDivider
          style={{ marginBottom: '1vw' }}
        />
        <FlexContainer
          noPadding
          justify='center'
          style={{ flexDirection: 'column', paddingBottom: '1vw' }}
        >
          <SearchInput
            dataArray={mentorsList}
            value={mentorValue}
            placeholder='Choose Mentor'
            onChange={value => this.setState({ mentorValue: value })}
          />
          <SectionButton
            type='primary'
            style={{ marginTop: '2vw' }}
            disabled={!mentorValue}
            loading={batchUpdatingStatus && get(batchUpdatingStatus.toJS(), 'loading')}
            onClick={this.onSaveMentor}
          >
            Confirm Mentor<UserIcon />
          </SectionButton>
        </FlexContainer>
      </MainModal>
    )
  }
  getRatings = (data) => {
    let totalNumber = 0
    let totalRating = 0
    for (const property in data) {
      if (property.startsWith('pythonCourseRating')) {
        let value = 0
        if (data[property]) {
          value = data[property]
        }
        totalRating += (Number(property.replace('pythonCourseRating', '')) * value)
        totalNumber += value
      }
    }
    if (totalNumber > 0) {
      return (totalRating / totalNumber).toFixed(2)
    }
    return 0
  }
  render() {
    const { batchesData } = this.props
    return (
      <>
        {this.renderMentorModal()}
        {
          get(batchesData, 'allottedMentor') ? (
            <FlexContainer style={{ alignItems: 'flex-start' }}>
              <ProfileCard>
                {
                  get(batchesData, 'allottedMentor.profilePic.uri') && (
                    <img
                      src={getFullPath(get(batchesData, 'allottedMentor.profilePic.uri'))}
                      alt='mentorProfile'
                      style={{ width: '60%', height: '60%' }}
                    />
                  )
                }
                <h2>{get(batchesData, 'allottedMentor.name')}</h2>
                {
                  get(batchesData, 'allottedMentor.mentorProfile.codingLanguages', []).length > 0 && (
                    <h3>Familiar Languages:
                      <span>{get(batchesData, 'allottedMentor.mentorProfile.codingLanguages', []).map((d) => `${get(d, 'value')},`)}</span>
                    </h3>
                  )
                }
                <h3>Years of Experience:
                  <span>{get(batchesData, 'allottedMentor.mentorProfile.experienceYear', 0) || 0}</span>
                </h3>
                <h3>Ratings:
                  <span>{this.getRatings(get(batchesData, 'allottedMentor.mentorProfile'))}</span>
                </h3>
              </ProfileCard>
              <SectionButton
                type='primary'
                onClick={() => this.setState({ modalVisible: true, mentorValue: get(batchesData, 'allottedMentor.id') })}
              >
                Change Mentor<UserIcon />
              </SectionButton>
            </FlexContainer>
          ) : (
            <FlexContainer justify='center' style={{ height: '30vh' }}>
              <SectionButton
                type='primary'
                onClick={() => this.setState({ modalVisible: true })}
              >
                Choose Mentor<UserIcon />
              </SectionButton>
            </FlexContainer>
          )
        }
      </>
    )
  }
}

export default AllotMentor
