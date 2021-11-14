import React, { Component, Fragment } from 'react'
import { Row, Col, Spin, Button, Tooltip } from 'antd'
import { CheckOutlined, StarFilled } from '@ant-design/icons'
import { get } from 'lodash'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import { MENTOR } from '../../constants/roles'
import fetchUserProfile from '../../actions/userProfile/fetchUserProfile'
import addUserProfilePic from '../../actions/userProfile/addUserProfilePic'
import removeProfilePic from '../../actions/userProfile/removeProfilePic'
import UserProfilePageStyle from './UserProfilePage.style'
import MentorProfileBox from './component/mentorProfile'
import DropZone from '../../components/Dropzone'
import getFullPath from '../../utils/getFullPath'

class UserProfilePage extends Component {
  state = {
    userProfile: null,
    file: null,
    showSaveForProPic: false,
    isEditProfilePic: false
  }
  componentDidMount() {
    if (this.state.userProfile === null) {
      fetchUserProfile()
    }
  }
  componentDidUpdate(prevProps) {
    const prevUserProfile = get(prevProps, 'userProfile')
    const userProfile = get(this.props, 'userProfile')
    if (prevUserProfile !== userProfile) {
      this.setState({
        userProfile: userProfile.toJS(),
        isEditProfilePic: false
      })
    }
  }

  onDropFile = (file) => {
    this.setState({
      file,
      showSaveForProPic: Boolean(file)
    })
  }

  addProfilePic = async (e) => {
    e.persist()
    const savedId = getDataFromLocalStorage('login.id')
    addUserProfilePic({
      file: this.state.file,
      userId: savedId,
      prevFileId: get(this.state.userProfile[0], 'profilePic.id')
    }).then(() => {
      this.setState({
        showSaveForProPic: false,
        file: null,
      })
    })
  }

  editProfilePic = e => {
    e.persist()
    this.setState({
      isEditProfilePic: true
    })
  }

  calculateMentorRating = () => {
    let ratingNum = 0
    let ratingDen = 0
    const mentorInfo = get(this.state, 'userProfile[0].mentorProfile') ?
      get(this.state, 'userProfile[0].mentorProfile') : {}
    Object.keys(mentorInfo).forEach((key) => {
      if (key.includes('pythonCourseRating') && mentorInfo[key] > 0) {
        const ratingValue = key.split('pythonCourseRating')[1]
        ratingNum += ratingValue * mentorInfo[key]
        ratingDen += mentorInfo[key]
      }
    })
    if (ratingNum > 0 && ratingDen > 0) {
      return (ratingNum / ratingDen).toFixed(2)
    }
    return 'NA'
  }

  onClickCloseForProfilePic = () => {
    const proPicId = get(this.state, 'userProfile[0].profilePic.id')
    const userId = get(this.state, 'userProfile[0].id')
    if (proPicId) {
      removeProfilePic({
        fileId: proPicId,
        userId
      })
    }
  }

  render() {
    const savedRole = getDataFromLocalStorage('login.role')
    const { Title, Card, SubTitle, Content, Vl, ProfilePicBox } = UserProfilePageStyle
    const { userProfile, showSaveForProPic, isEditProfilePic } = this.state
    const profilePic = get(this.state, 'userProfile[0].profilePic')
    const fetchStatus = this.props.userFetchStatus
      && this.props.userFetchStatus.toJS().userProfile
    if ((fetchStatus && fetchStatus.loading) || !userProfile) {
      return <Spin />
    }
    if (fetchStatus && !fetchStatus.loading && fetchStatus.success && !userProfile.length) {
      return <p>No data</p>
    }
    const rating = this.calculateMentorRating()
    const profilePicUpdateStatus = get(this.props, 'profileUpdateStatus') &&
      get(this.props, 'profileUpdateStatus').toJS()
    return (
      <UserProfilePageStyle>
        <Title style={{ marginTop: 0 }} >User Profile</Title>
        <Card
          style={{
            maxWidth: 600,
            minHeight: 250
          }}
        >
          <Row>
            <Col
              span={8}
              style={{
                display: 'grid',
                justifyContent: 'center',
                textAlign: 'center',
                gridGap: '10px',
              }}
            >
              {
                (!profilePic || isEditProfilePic) && !get(profilePicUpdateStatus, 'profilePicUpdate.loading') ?
                  <Fragment>
                    <DropZone
                      style={{
                        width: 150
                      }}
                      getDropzoneFile={this.onDropFile}
                      defaultImage={getFullPath(get(userProfile[0], 'profilePic.uri'))}
                      onClose={this.onClickCloseForProfilePic}
                    />
                    {
                      showSaveForProPic &&
                      <Button
                        type='primary'
                        shape='circle'
                        style={{
                          position: 'absolute',
                          top: 135,
                          right: 7,
                        }}
                        onClick={this.addProfilePic}
                      >
                        <CheckOutlined />
                      </Button>
                    }
                  </Fragment> :
                  !get(profilePicUpdateStatus, 'profilePicUpdate.loading') &&
                    <Tooltip
                      title='Click to Edit'
                      placement='bottom'
                    >
                      <ProfilePicBox
                        style={{
                          backgroundImage: `url('${getFullPath(get(userProfile[0], 'profilePic.uri'))}')`
                        }}
                        onClick={this.editProfilePic}
                      />
                    </Tooltip>
              }
              {
                get(profilePicUpdateStatus, 'profilePicUpdate.loading') ?
                  <ProfilePicBox>
                    <Spin />
                  </ProfilePicBox> : null
              }
              <SubTitle>
                <StarFilled
                  style={{ color: '#e78c3a' }}
                />
                {' '}{rating}
              </SubTitle>
            </Col>
            <Col span={16}
              style={{
                borderLeft: '1px solid #707070'
              }}
            >
              <Row>
                <Col span={8}>
                  <SubTitle>Name</SubTitle>
                </Col>
                <Col span={16}>
                  <Content>{get(userProfile[0], 'name')}</Content>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <SubTitle>UserName</SubTitle>
                </Col>
                <Col span={16}>
                  <Content>{get(userProfile[0], 'username')}</Content>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <SubTitle>Email ID</SubTitle>
                </Col>
                <Col span={16}>
                  <Content>{get(userProfile[0], 'email')}</Content>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <SubTitle>Phone</SubTitle>
                </Col>
                <Col span={16}>
                  <Content>
                    {get(userProfile[0], 'phone.countryCode')} {
                      ' '
                    }
                    {get(userProfile[0], 'phone.number')}
                  </Content>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <SubTitle>Gender</SubTitle>
                </Col>
                <Col span={16}>
                  <Content>{get(userProfile[0], 'gender') ? get(userProfile[0], 'gender') : '-'}</Content>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        {
          savedRole === MENTOR ?
            <Fragment>
              <Title>Mentor Profile</Title>
              <Vl />
              <MentorProfileBox
                mentorProfile={userProfile && userProfile.length ? get(userProfile[0], 'mentorProfile') : {}}
                userProfile={userProfile && userProfile.length ? userProfile[0] : []}
                updateStatus={get(this.props, 'profileUpdateStatus')
                  ? get(this.props, 'profileUpdateStatus').toJS() : null}
              />
            </Fragment> : null
        }
      </UserProfilePageStyle>
    )
  }
}

export default UserProfilePage
