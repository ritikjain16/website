import { Radio, Col, Divider, Row, Button } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import MentorAuditStyle from '../MentorAudit.style'

const titleStyle = { fontSize: '23px', fontWeight: '500', color: '#1c91ff' }
const colStyle = {
  margin: '0 10px',
}

const saveButtonStyle = {
  color: '#ffffff',
  margin: '1rem .5rem',
  background: '#06b004',
  '&:hover': {
    textDecoration: 'auto !important',
    background: 'red',
  },
}
const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px auto',
}

const OtherAuditOptions = [
  {
    key: 'noiseDisturbanceFromMentor',
    label: 'Noise disturbance from Mentor’s side'
  },
  {
    key: 'isStudentCameraOff',
    label: 'Student camera turned off & class conducted?'
  },
  {
    key: 'switchedToComfortableLanguage',
    label: 'Switched to comfortable language?'
  },
  {
    key: 'isMentorInternetDecent',
    label: 'Mentor joined over laptop with decent internet?'
  },
]
class OtherAudit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      noiseDisturbanceFromMentor: null,
      isStudentCameraOff: null,
      switchedToComfortableLanguage: null,
      isMentorInternetDecent: null,
      loading: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const { mentorMenteeSessionAudit } = this.props
      this.setState({
        noiseDisturbanceFromMentor: get(mentorMenteeSessionAudit, 'noiseDisturbanceFromMentor', null),
        isStudentCameraOff: get(mentorMenteeSessionAudit, 'isStudentCameraOff', null),
        switchedToComfortableLanguage: get(mentorMenteeSessionAudit, 'switchedToComfortableLanguage', null),
        isMentorInternetDecent: get(mentorMenteeSessionAudit, 'isMentorInternetDecent', null)
      })
    }
  }

  onChange = (e, key) => {
    this.setState({
      [key]: e.target.value
    }, () => {
      this.props.setMentorAuditData({ [key]: e.target.value })
    })
  }

  saveOtherAudit = () => {
    this.setState({
      loading: true,
    })
    this.props.updateMentorAuditSession().then(() => {
      this.setState({
        loading: false,
      })
    })
  }

  render() {
    const { isViewOnlyMode } = this.props
    return (
      <div style={{ marginTop: '15px' }}>
        <Divider style={{ height: '2px' }} />
        <div style={{ marginTop: '15px' }}>
          <p style={titleStyle}>Other</p>
        </div>
        <Row>
          <Col span={24} style={colStyle}>
            {OtherAuditOptions.map(options => (
              <Row style={rowStyle}>
                <Col span={12}>{options.label}</Col>
                <Col span={12}>
                  <Radio.Group
                    style={{ width: '80%', float: 'right' }}
                    value={this.state[options.key]}
                    onChange={(e) => this.onChange(e, options.key)}
                  >
                    <Row>
                      <Col span={12}>
                        <MentorAuditStyle.StyledRadio
                          style={{
                            userSelect: isViewOnlyMode && 'none',
                            pointerEvents: isViewOnlyMode && 'none'
                          }}
                          color='#6fcf97'
                          value
                        >Yes
                        </MentorAuditStyle.StyledRadio>
                      </Col>
                      <Col span={12}>
                        <MentorAuditStyle.StyledRadio
                          style={{
                            userSelect: isViewOnlyMode && 'none',
                            pointerEvents: isViewOnlyMode && 'none'
                          }}
                          color='#eb7979'
                          value={false}
                        >No
                        </MentorAuditStyle.StyledRadio>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
        {!isViewOnlyMode && (
          <Row>
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type='default'
                shape='round'
                size='large'
                style={saveButtonStyle}
                loading={this.state.loading}
                onClick={() => { this.saveOtherAudit() }}
              >
                    Save Other Audit
              </Button>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default OtherAudit
