import { Col, Rate, Row, Divider, Button } from 'antd'
import { PlayCircleFilled } from '@ant-design/icons'
import { get } from 'lodash'
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
const rateStarStyle = {
  fontSize: 14,
  color: '#047775'
}
const rateDivStyle = {
  position: 'relative',
  width: 'auto',
  height: '26px',
  backgroundColor: '#58cfd2',
  borderRadius: '20px',
}

const bottomDivStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 15px',
}

const kidsSkillsRateEl = [
  {
    label: 'Enthusiasm',
    key: 'enthusiasm'
  },
  {
    label: 'Friendliness',
    key: 'friendliness'
  },
  {
    label: 'Engaging & funny',
    key: 'engagement'
  },
  {
    label: 'Patience',
    key: 'patience'
  },
  {
    label: 'Inspiring',
    key: 'inspiring'
  },
  {
    label: 'Creativity',
    key: 'creativity'
  },
  {
    label: 'Dedication',
    key: 'dedication'
  },
  {
    label: 'Flexibility',
    key: 'flexibility'
  },
]

class KidsSkillsRate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enthusiasm: 0,
      friendliness: 0,
      engagement: 0,
      patience: 0,
      inspiring: 0,
      creativity: 0,
      dedication: 0,
      flexibility: 0,
      loading: false,
      rateCount: 10
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const { mentorMenteeSessionAudit } = this.props
      this.setState({
        enthusiasm: get(mentorMenteeSessionAudit, 'enthusiasm', 0),
        friendliness: get(mentorMenteeSessionAudit, 'friendliness', 0),
        engagement: get(mentorMenteeSessionAudit, 'engagement', 0),
        patience: get(mentorMenteeSessionAudit, 'patience', 0),
        inspiring: get(mentorMenteeSessionAudit, 'inspiring', 0),
        creativity: get(mentorMenteeSessionAudit, 'creativity', 0),
        dedication: get(mentorMenteeSessionAudit, 'dedication', 0),
        flexibility: get(mentorMenteeSessionAudit, 'flexibility', 0),
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

  saveKidsSkillRate = () => {
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
    const { mentorMenteeSessionAudit, isViewOnlyMode } = this.props
    const { mentorMenteeSession } = mentorMenteeSessionAudit
    return (
      <div style={{ marginTop: '15px' }}>
        <Divider style={{ height: '2px' }} />
        <div style={{ marginTop: '15px' }}>
          <p style={titleStyle}>Interpersonal skills (Dealing with kids)</p>
          <Row style={rowStyle}>
            {kidsSkillsRateEl.map(({ label, key }) => (
              <Col span={12}>
                <Row style={{ padding: '3px 0' }}>
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
        </div>
        {!isViewOnlyMode && (
        <Row>
          <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type='default'
              shape='round'
              size='large'
              style={saveButtonStyle}
              loading={this.state.loading}
              onClick={() => { this.saveKidsSkillRate() }}
            >
                    Save Kids Skill Rate
            </Button>
          </Col>
        </Row>
          )}
      </div>
    )
  }
}

export default KidsSkillsRate
