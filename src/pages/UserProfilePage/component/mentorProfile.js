import React, { Component, Fragment } from 'react'
import { Row, Col, Tag, Button, Select, Input, Spin } from 'antd'
import { CheckOutlined, LoadingOutlined } from '@ant-design/icons'
import { get } from 'lodash'
// import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
// import { MENTOR } from '../../constants/roles'
import UserProfilePageStyle from '../UserProfilePage.style'
import updateMentorProfile from '../../../actions/userProfile/updateMentorProfile'
import addMentorProfile from '../../../actions/userProfile/addMentorProfile'

class MentorProfileBox extends Component {
  state={
    codingLanguages: null,
    experienceYear: null,
    languages: [],
    sessionLink: '',
    meetingId: '',
    meetingPassword: '',
    googleMeetLink: '',
    preDefLanguages: {
      Python: 'Python',
      JavaScript: 'JavaScript',
      Java: 'Java',
      Csharp: 'C#',
      Swift: 'Swift',
      Cplusplus: 'C++',
    },
    showSaveBtn: false,
    otherItems: ['sessionLink', 'meetingId', 'meetingPassword', 'googleMeetLink'],
    otherItemsTags: {
      sessionLink: 'Session Link',
      meetingId: 'Meeting ID',
      meetingPassword: 'Meeting Password',
      googleMeetLink: 'Google Meet Link'
    }
  }

  componentDidMount() {
    this.setDataForState()
  }

  componentDidUpdate(prevprops) {
    if (prevprops.mentorProfile !== this.props.mentorProfile) {
      this.setDataForState()
    }
  }

  setDataForState() {
    const { mentorProfile } = this.props
    if (mentorProfile) {
      this.setState({
        codingLanguages: get(mentorProfile, 'codingLanguages'),
        experienceYear: get(mentorProfile, 'experienceYear'),
        languages: get(mentorProfile, 'codingLanguages'),
        sessionLink: get(mentorProfile, 'sessionLink'),
        meetingId: get(mentorProfile, 'meetingId'),
        meetingPassword: get(mentorProfile, 'meetingPassword'),
        googleMeetLink: get(mentorProfile, 'googleMeetLink'),
        showSaveBtn: false
      })
    }
  }

  onSave = () => {
    const input = {}
    if (get(this.state, 'languages') !== null) {
      input.codingLanguages = {
        replace: get(this.state, 'languages')
      }
    }
    if (get(this.state, 'experienceYear') !== null) {
      input.experienceYear = Number(get(this.state, 'experienceYear'))
    }
    this.state.otherItems.forEach(item => {
      if (get(this.state, item) !== null) {
        input[item] = get(this.state, item)
      }
    })
    const id = get(this.props, 'mentorProfile.id')
    updateMentorProfile(id, input)
  }

  handleExperienceYear = (e, type) => {
    e.persist()
    const { experienceYear } = this.state
    if (type === 'add') {
      this.setState({
        experienceYear: experienceYear ?
          experienceYear + 1 : 1,
        showSaveBtn: experienceYear ?
          !((experienceYear + 1) === get('this.props', 'mentorProfile.experienceYear')) : true,
      })
    } else if (type === 'minus') {
      this.setState({
        experienceYear: experienceYear ?
          experienceYear - 1 : 0,
        showSaveBtn: experienceYear ?
          !((experienceYear - 1) === get('this.props', 'mentorProfile.experienceYear')) : false,
      })
    }
  }

  renderLanguageOptions() {
    const { Option } = Select
    const options = []
    const { preDefLanguages } = this.state
    Object.keys(preDefLanguages).forEach(language => {
      options.push(<Option key={language} value={language}>{preDefLanguages[language]}</Option>)
    })
    return options
  }

  handleLanguages = value => {
    const { codingLanguages } = this.state
    const newLanguages = []
    value.forEach(language => {
      newLanguages.push({
        value: language
      })
    })
    this.setState({
      languages: newLanguages,
      showSaveBtn: !(value === codingLanguages)
    })
  }

  renderValues() {
    const val = []
    this.state.languages.forEach(lang => {
      val.push(lang.value)
    })
    return val
  }

  createMentorProfile = () => {
    const userId = get(this.props, 'userProfile.id')
    if (userId) {
      addMentorProfile(userId)
    }
  }

  handleOtherInputs = item => e => {
    const { mentorProfile } = this.props
    this.setState({
      [item]: e.target.value,
      showSaveBtn: e.target.value !== mentorProfile[item]
    })
  }

  render() {
    const { Card, SubTitle, Content, FlexBox } = UserProfilePageStyle
    const { userProfile } = this.props
    if (!get(userProfile, 'mentorProfile')) {
      return (
        <Fragment>
          <Card
            style={{
              maxWidth: 600,
              display: 'grid',
              alignItems: 'center',
              justifyItems: 'center',
              boxShadow: 'none'
            }}
          >
            <p>No Mentor Profile set till now</p>
            <Button
              type='primary'
              onClick={this.createMentorProfile}
            >
              Create One Now!
            </Button>
          </Card>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <Card
          style={{
            maxWidth: 600
          }}
        >
          <Row>
            <Col span={10} >
              <SubTitle>Year of Experience in Coding{' '}: </SubTitle>
            </Col>
            <Col span={14} >
              <FlexBox>
                <Button
                  type='primary'
                  onClick={e => this.handleExperienceYear(e, 'add')}
                  style={{
                    fontSize: 26,
                    lineHeight: 1,
                  }}
                >
                  +
                </Button>
                <Tag
                  type='ghost'
                  style={{
                    width: 50,
                    margin: '0 5px',
                    textAlign: 'center',
                    fontSize: '24px',
                    lineHeight: '1.2'
                    }}
                >
                  {get(this.state, 'experienceYear') ? get(this.state, 'experienceYear') : 0}
                </Tag>
                <Button
                  type='primary'
                  onClick={e => this.handleExperienceYear(e, 'minus')}
                  style={{
                    fontSize: 26,
                    lineHeight: 1,
                  }}
                >
                  -
                </Button>
              </FlexBox>
            </Col>
          </Row>
          <Row>
            <Col span={10} >
              <SubTitle> {'Programming Languages you\'re confident in :'} </SubTitle>
            </Col>
            <Col span={14} >
              <Content>
                <Select
                  mode='multiple'
                  allowClear
                  style={{ width: '100%' }}
                  placeholder='+ New Language'
                  onChange={this.handleLanguages}
                  value={this.renderValues()}
                >
                  {this.renderLanguageOptions()}
                </Select>
              </Content>
            </Col>
          </Row>
          {
            this.state.otherItems.map(item =>
              <Fragment>
                <Row>
                  <Col span={10} >
                    <SubTitle> {this.state.otherItemsTags[item]}{' '}: </SubTitle>
                  </Col>
                  <Col span={14} >
                    <Content>
                      <Input
                        value={get(this.state, item)}
                        onChange={this.handleOtherInputs(item)}
                        placeholder={this.state.otherItemsTags[item]}
                      />
                    </Content>
                  </Col>
                </Row>
              </Fragment>
            )
          }
          <Row>
            {
              this.state.showSaveBtn &&
                <Button
                  type='primary'
                  style={{
                    margin: '0',
                    float: 'right'
                  }}
                  onClick={this.onSave}
                  disabled={get(this.props, 'updateStatus.mentorProfileUpdate.loading')}
                >
                  {(!get(this.props, 'updateStatus.mentorProfileUpdate')
                    || get(this.props, 'updateStatus.mentorProfileUpdate.success')) &&
                      <span>
                        <CheckOutlined /> Save
                      </span>
                  }
                  {get(this.props, 'updateStatus.mentorProfileUpdate.loading')
                    && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}
                  {get(this.props, 'updateStatus.mentorProfileUpdate.failure')
                    && <span> Try Again </span>}
                </Button>
            }
          </Row>
        </Card>
      </Fragment>
    )
  }
}

export default MentorProfileBox
