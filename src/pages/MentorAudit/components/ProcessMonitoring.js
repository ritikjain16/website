import { Col, Divider, Radio, Row, Input, Button } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'
import MentorAuditStyle from '../MentorAudit.style'

const { TextArea } = Input
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

const ProcessMonitoringOptions = [
  {
    key: 'isEpisodeExplained',
    label: 'Explained series and concept of episodes?',
    childKey: null
  },
  {
    key: 'isVideoWatchedInFullScreen',
    label: 'Ensured kid watched video in full screen?',
    childKey: null
  },
  {
    key: 'askedQuestionAroundEpisode',
    label: 'Asked questions around concepts in video?',
    childKey: null
  },
  {
    key: 'clarifiedDoubts',
    label: 'Clarified all the doubts?',
    childKey: 'notClarifiedDoubtsComment'
  },
  {
    key: 'briefedChat',
    label: 'Briefing about the chat section?',
    childKey: null
  },
  {
    key: 'easilyAnsweredQuiz',
    label: 'Easily giving away answers during the quiz?',
    childKey: null
  },
  {
    key: 'reportExplainedProperly',
    label: 'Mentor concluded report section properly?',
    childKey: null
  },
  {
    key: 'usedCodePlayground',
    label: 'Used code playground to execute all the commands introduced?',
    childKey: 'notUsedCodePlaygroundComment'
  },
  {
    key: 'coveredAllCases',
    label: 'Covered all the use cases of concepts?',
    childKey: 'notCoveredAllCasesComment'
  },
  {
    key: 'concludedSession',
    label: 'Concluded the session after exercises?',
    childKey: null
  },
  {
    key: 'screenShareStoppedWhileRating',
    label: 'Asked kid to stop screen share while rating?',
    childKey: null
  },
  {
    key: 'coveredHomework',
    label: 'Covered homework, code playground, past sessions?',
    childKey: null
  },
  {
    key: 'offeredCounselling',
    label: 'Parent unavailable or offered counselling?',
    childKey: null
  },
]

class ProcessMonitoring extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEpisodeExplained: null,
      isVideoWatchedInFullScreen: null,
      askedQuestionAroundEpisode: null,
      clarifiedDoubts: null,
      notClarifiedDoubtsComment: null,
      briefedChat: null,
      easilyAnsweredQuiz: null,
      reportExplainedProperly: null,
      usedCodePlayground: null,
      notUsedCodePlaygroundComment: null,
      coveredAllCases: null,
      notCoveredAllCasesComment: null,
      concludedSession: null,
      screenShareStoppedWhileRating: null,
      coveredHomework: null,
      offeredCounselling: null,
      loading: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mentorMenteeSessionAudit !== this.props.mentorMenteeSessionAudit) {
      const { mentorMenteeSessionAudit } = this.props
      this.setState({
        isEpisodeExplained: get(mentorMenteeSessionAudit, 'isEpisodeExplained', null),
        isVideoWatchedInFullScreen: get(mentorMenteeSessionAudit, 'isVideoWatchedInFullScreen', null),
        askedQuestionAroundEpisode: get(mentorMenteeSessionAudit, 'askedQuestionAroundEpisode', null),
        clarifiedDoubts: get(mentorMenteeSessionAudit, 'clarifiedDoubts', null),
        notClarifiedDoubtsComment: get(mentorMenteeSessionAudit, 'notClarifiedDoubtsComment', ''),
        briefedChat: get(mentorMenteeSessionAudit, 'briefedChat', null),
        easilyAnsweredQuiz: get(mentorMenteeSessionAudit, 'easilyAnsweredQuiz', null),
        reportExplainedProperly: get(mentorMenteeSessionAudit, 'reportExplainedProperly', null),
        usedCodePlayground: get(mentorMenteeSessionAudit, 'usedCodePlayground', null),
        notUsedCodePlaygroundComment: get(mentorMenteeSessionAudit, 'notUsedCodePlaygroundComment', ''),
        coveredAllCases: get(mentorMenteeSessionAudit, 'coveredAllCases', null),
        notCoveredAllCasesComment: get(mentorMenteeSessionAudit, 'notCoveredAllCasesComment', ''),
        concludedSession: get(mentorMenteeSessionAudit, 'concludedSession', null),
        screenShareStoppedWhileRating: get(mentorMenteeSessionAudit, 'screenShareStoppedWhileRating', null),
        coveredHomework: get(mentorMenteeSessionAudit, 'coveredHomework', null),
        offeredCounselling: get(mentorMenteeSessionAudit, 'offeredCounselling', null),
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

  onTextAreaChange = ({ target: { value } }, childKey) => {
    this.setState({
      [childKey]: value
    }, () => {
      this.props.setMentorAuditData({ [childKey]: value })
    })
  }

  saveProcessMonitoringAudit = () => {
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
          <p style={titleStyle}>Process Monitoring</p>
        </div>
        <Row>
          <Col span={24} style={colStyle}>
            {ProcessMonitoringOptions.map(options => (
                <>
                  <Row style={rowStyle}>
                    <Col span={12}>{options.label}</Col>
                    <Col span={12}>
                      <Radio.Group
                        style={{ width: '80%', float: 'right', borderRadius: '3px' }}
                        value={this.state[options.key]}
                        onChange={(e) => this.onChange(e, options.key)}
                      >
                        <Row>
                          <Col span={12}>
                            <MentorAuditStyle.StyledRadio
                              color='#6fcf97'
                              style={{
                                userSelect: isViewOnlyMode && 'none',
                                pointerEvents: isViewOnlyMode && 'none'
                              }}
                              value
                            >Yes
                            </MentorAuditStyle.StyledRadio>
                          </Col>
                          <Col span={12}>
                            <MentorAuditStyle.StyledRadio
                              color='#eb7979'
                              style={{
                                userSelect: isViewOnlyMode && 'none',
                                pointerEvents: isViewOnlyMode && 'none'
                              }}
                              value={false}
                            >No
                            </MentorAuditStyle.StyledRadio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Col>
                  </Row>
                  {options.childKey && (
                  <>
                    <Row style={rowStyle}>
                      <Col span={24}>
                        <TextArea
                          readOnly={isViewOnlyMode}
                          rows={3}
                          bordered={false}
                          value={this.state[options.childKey]}
                          onChange={(e) => { this.onTextAreaChange(e, options.childKey) }}
                          placeholder='Specify with more details'
                          style={{ width: '85%', backgroundColor: '#e4e4e4' }}
                        />
                      </Col>
                    </Row>
                    </>
                )}
                  </>
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
                onClick={() => { this.saveProcessMonitoringAudit() }}
              >
                    Save Process Monitoring Audit
              </Button>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default ProcessMonitoring
