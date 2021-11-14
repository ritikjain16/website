import { Col, Rate, Row, Button } from 'antd'
import { get } from 'lodash'
import { PlayCircleFilled } from '@ant-design/icons'
import React, { Component } from 'react'

const titleStyle = { fontSize: '23px', fontWeight: '500', color: '#1c91ff' }
const rowStyle = {
  textAlign: 'center',
  margin: '5px auto',
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

const rateDivStyle = {
  position: 'relative',
  width: 'auto',
  height: '26px',
  backgroundColor: '#58cfd2',
  borderRadius: '20px',
}

const rateStarStyle = {
  fontSize: 14,
  color: '#047775'
}

const bottomDivStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 15px',
}

const classQualityRateEl = [
  {
    label: 'How good was class opening?',
    key: 'classOpeningScore'
  },
  {
    label: 'How clearly was concept explained?',
    key: 'conceptsExplainedScore'
  },
  {
    label: 'How good was class activity briefing?',
    key: 'activityBriefingScore'
  },
  {
    label: 'How good was coding exercise section?',
    key: 'codingExerciseScore'
  },
  {
    label: 'How good was video discussion?',
    key: 'videoDiscussionScore'
  },
  {
    label: 'How good was product walkthrough?',
    key: 'productWalkthroughScore'
  },
  {
    label: 'How good was chat section?',
    key: 'chatSectionScore'
  },
  {
    label: 'How good was parent counselling?',
    key: 'parentCounsellingScore'
  },
  {
    label: 'How good was practice section?',
    key: 'practiceSectionScore'
  },
]

class ClassQualityRate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classOpeningScore: 0,
      conceptsExplainedScore: 0,
      activityBriefingScore: 0,
      codingExerciseScore: 0,
      videoDiscussionScore: 0,
      productWalkthroughScore: 0,
      chatSectionScore: 0,
      parentCounsellingScore: 0,
      practiceSectionScore: 0,
      loading: false,
      rateCount: 10
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.mentorMenteeSessionAudit !== prevProps.mentorMenteeSessionAudit) {
      const { mentorMenteeSessionAudit } = this.props
      this.setState({
        classOpeningScore: get(mentorMenteeSessionAudit, 'classOpeningScore', 0),
        conceptsExplainedScore: get(mentorMenteeSessionAudit, 'conceptsExplainedScore', 0),
        activityBriefingScore: get(mentorMenteeSessionAudit, 'activityBriefingScore', 0),
        codingExerciseScore: get(mentorMenteeSessionAudit, 'codingExerciseScore', 0),
        videoDiscussionScore: get(mentorMenteeSessionAudit, 'videoDiscussionScore', 0),
        productWalkthroughScore: get(mentorMenteeSessionAudit, 'productWalkthroughScore', 0),
        chatSectionScore: get(mentorMenteeSessionAudit, 'chatSectionScore', 0),
        parentCounsellingScore: get(mentorMenteeSessionAudit, 'parentCounsellingScore', 0),
        practiceSectionScore: get(mentorMenteeSessionAudit, 'practiceSectionScore', 0),
      })
    }
  }
  onChange = (value, key) => {
    this.setState({
      [key]: value
    }, () => {
      this.props.setMentorAuditData({ [key]: value })
    })
  }

  saveClassQualityDate = () => {
    this.setState({
      loading: true
    })
    this.props.updateMentorAuditSession().then(() => {
      this.setState({
        loading: false
      })
    })
  }

  render() {
    const { mentorMenteeSessionAudit, isViewOnlyMode } = this.props
    const { mentorMenteeSession } = mentorMenteeSessionAudit
    return (
      <div style={{ marginTop: '15px' }}>
        <p style={titleStyle}>Class Quality</p>
        <Row style={rowStyle}>
          {classQualityRateEl.map(({ label, key }) => (
            <Col span={12}>
              <Row style={{ padding: '2px 0' }}>
                <Col span={12}>
                  <h3>{label}</h3>
                </Col>
                <Col span={11}>

                  <div style={rateDivStyle}>
                    <Rate
                      disabled={isViewOnlyMode}
                      defaultValue={this.state[key]}
                      value={this.state[key]}
                      count={this.state.rateCount}
                      style={rateStarStyle}
                      tooltips={[...Array(this.state.rateCount + 1).keys()].slice(1)}
                      onChange={(value) => this.onChange(value, key)}
                    />
                    <PlayCircleFilled
                      onClick={() => {
                              if (mentorMenteeSession && mentorMenteeSession.sessionRecordingLink) {
                                window.open(get(mentorMenteeSession, 'sessionRecordingLink', ''), '_blank')
                              }
                            }}
                      style={{
                            fontSize: '25px',
                            float: 'right',
                          }}
                    />
                  </div>
                  <div style={bottomDivStyle}>
                    <h5 style={{ color: '#fc6d6d' }}>Terrible</h5>
                    <h5 style={{ color: '#5cbd4a' }}>Wow!</h5>
                  </div>
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
        { !isViewOnlyMode && (
          <Row>
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type='default'
                shape='round'
                size='large'
                style={saveButtonStyle}
                loading={this.state.loading}
                onClick={() => { this.saveClassQualityDate() }}
              >
                    Save Class Quality Rate
              </Button>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default ClassQualityRate
