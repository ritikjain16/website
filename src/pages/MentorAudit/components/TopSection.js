import React, { Component } from 'react'
import { get } from 'lodash'
import { Col, Progress, Row, Tag, Tooltip, Divider, Icon } from 'antd'
import formatDate from '../../../utils/formatDate'
import MentorAuditListStyle from '../MentorAudit.style'
import { auditType } from '../../../constants/auditQuestionConst'
import formatNumber from '../../SchoolProductMapping/common-util/formatNumber'
import getAuditTypeText from '../../../utils/getAuditTypeText'

const topStyle = {
  textAlign: 'center',
  position: 'sticky',
  top: '-16px',
  paddingTop: '1rem',
  zIndex: '10',
  background: '#fff'
}

const tagStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '3px 5px',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
}

const titleStyle = {
  textAlign: 'left'
}
class TopSection extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

    getSelectedSlotsStringArray = (slots = {}) => {
      const slotTimeStringArray = []
      Object.keys(slots).forEach(slot => {
        if (slot.includes('slot')) {
          if (slots[slot]) {
            slotTimeStringArray.push(slot)
          }
        }
      })
      return slotTimeStringArray
    }

  getSlotLabel = (slotNumberString, isCapital = true) => {
    const slotNumber = Number(slotNumberString)
    let AM = 'AM'
    let PM = 'PM'
    if (!isCapital) {
      AM = 'am'
      PM = 'pm'
    }
    let startTime = ''
    let endTime = ''
    if (slotNumber < 12) {
      if (slotNumber === 0) {
        startTime = `12:00 ${AM}`
      } else {
        startTime = `${slotNumber}:00 ${AM}`
      }
      if (slotNumber === 11) {
        endTime = `12:00 ${PM}`
      } else {
        endTime = `${slotNumber + 1}:00 ${AM}`
      }
    } else if (slotNumber > 12) {
      startTime = `${slotNumber - 12}:00 ${PM}`
      if (slotNumber === 23) {
        endTime = `12:00 ${AM}`
      } else {
        endTime = `${slotNumber - 11}:00 PM`
      }
    } else {
      startTime = `12:00 ${PM}`
      endTime = `1:00 ${PM}`
    }
    return {
      startTime,
      endTime
    }
  }

  getSlotTime = (menteeSession) => {
    const slotTimeStringArray = this.getSelectedSlotsStringArray(menteeSession)
    if (slotTimeStringArray && slotTimeStringArray.length) {
      const slotNumber = slotTimeStringArray[0].split('slot')[1]
      const label = this.getSlotLabel(slotNumber)
      return label.startTime
    }
    return '-'
  }
  getQualityPercentage = () => {
    const { overAllQuestionScore, totalQualityScore } = this.props
    let percentage = 0
    if (totalQualityScore && totalQualityScore > 0
      && overAllQuestionScore && overAllQuestionScore > totalQualityScore) {
      percentage = (totalQualityScore / overAllQuestionScore) * 100
    }
    return percentage
  }
  getCustomScorePercentage = () => {
    const { overAllQuestionScore, customSectionWiseScore } = this.props
    let percentage = 0
    if (customSectionWiseScore && customSectionWiseScore > 0
      && overAllQuestionScore) {
      percentage = (customSectionWiseScore / overAllQuestionScore) * 100
    }
    return percentage
  }
  render() {
    const { isViewOnlyMode,
      auditTypeFromRoute, stateAuditData, customSectionWiseScore,
      overAllQuestionScore, totalQualityScore, fromViewPage,
      onAuditTypeChange, isBatchAudit } = this.props
    const isMentorOrPostSales = auditTypeFromRoute === auditType.mentor
      || auditTypeFromRoute === auditType.postSales
    return (
      <div style={topStyle}>
        <Row>
          <Col span={12}>
            {
              fromViewPage ? (
                <div style={{ display: 'flex' }}>
                  {
                    [auditType.preSales, auditType.mentor, auditType.postSales].map(type => (
                      <MentorAuditListStyle.AuditTab
                        checked={auditTypeFromRoute === type}
                        onClick={() => onAuditTypeChange(type)}
                      >
                        {getAuditTypeText(type)}
                      </MentorAuditListStyle.AuditTab>
                    ))
                  }
                </div>
              ) : (
                  <>
                    <Row>
                      {
                        !isBatchAudit && (
                          <Col span={10}>
                            <h3 style={titleStyle}>Student Name</h3>
                            <Tag color='#e4e4e4' style={{ width: '100%' }}>
                              <h3 style={tagStyle}>
                                {
                                !isMentorOrPostSales ? (
                                  get(stateAuditData, 'client.name')
                                ) : get(stateAuditData, 'mentorMenteeSession.menteeSession.user.name', '-')
                              }
                              </h3>
                            </Tag>
                          </Col>
                        )
                      }
                      {
                        !isMentorOrPostSales && (
                          <Col span={10} style={{ marginLeft: '15px' }}>
                            <h3 style={titleStyle}>Parent Name</h3>
                            <Tag color='#e4e4e4' style={{ width: '100%' }}>
                              <h3 style={tagStyle}>
                                {get(stateAuditData, 'client.studentProfile.parents[0].user.name')}
                              </h3>
                            </Tag>
                          </Col>
                        )
                      }
                      {
                        isBatchAudit && (
                          <Col span={10}>
                            <h3 style={titleStyle}>Batch Code</h3>
                            <Tag color='#e4e4e4' style={{ width: '100%' }}>
                              <h3 style={tagStyle}>
                                {get(stateAuditData, 'batchSession.batch.code')}
                              </h3>
                            </Tag>
                          </Col>
                        )
                      }
                      {
                      isMentorOrPostSales && (
                      <Col span={10} style={{ marginLeft: '15px' }}>
                        <h3 style={titleStyle}>Video Link</h3>
                        <Tag color='#e4e4e4' style={{ width: '100%', minHeight: '30px' }}>
                          {
                                !isBatchAudit ? (
                                  <>
                                    {get(stateAuditData, 'mentorMenteeSession.sessionRecordingLink', '-') ? (
                                      <Tooltip
                                        title={get(stateAuditData, 'mentorMenteeSession.sessionRecordingLink', '-')}
                                      >
                                        <h3 style={tagStyle}>
                                          <a
                                            target='blank'
                                            style={{ color: '#1a53d4' }}
                                            href={get(stateAuditData, 'mentorMenteeSession.sessionRecordingLink', '-') || '-'}
                                          > {get(stateAuditData, 'mentorMenteeSession.sessionRecordingLink', '-') || '-'}
                                          </a>
                                        </h3>
                                      </Tooltip>
                              ) : (<h3 style={tagStyle}> - </h3>)}
                                  </>
                                ) : (
                                    <>
                                      {get(stateAuditData, 'batchSession.sessionRecordingLink', '-').trim() ? (
                                        <Tooltip
                                          title={get(stateAuditData, 'batchSession.sessionRecordingLink', '-')}
                                        >
                                          <h3 style={tagStyle}>
                                            <a
                                              target='blank'
                                              style={{ color: '#1a53d4' }}
                                              href={get(stateAuditData, 'batchSession.sessionRecordingLink', '-') || '-'}
                                            > {get(stateAuditData, 'batchSession.sessionRecordingLink', '-') || '-'}
                                            </a>
                                          </h3>
                                        </Tooltip>
                              ) : (<h3 style={tagStyle}> - </h3>)}
                                  </>
                                )
                              }
                        </Tag>
                      </Col>
                      )
                      }
                    </Row>
                    {isMentorOrPostSales && (
                    <Row>
                      <Col span={10}>
                        <h3 style={titleStyle}>Session Date</h3>
                        <Tag color='#e4e4e4' style={{ width: '100%' }}>
                          <h3 style={tagStyle}>
                            {
                                !isBatchAudit ? (
                                  <>
                                    {formatDate(get(stateAuditData, 'mentorMenteeSession.sessionStartDate', new Date())).date} |
                                    {this.getSlotTime(get(stateAuditData, 'mentorMenteeSession.menteeSession', {}))}
                                  </>
                                ) : (
                                  <>
                                    {formatDate(get(stateAuditData, 'batchSession.sessionStartDate', new Date())).date} |
                                    {this.getSlotTime(get(stateAuditData, 'batchSession', {}))}
                                  </>
                                )
                              }
                          </h3>
                        </Tag>
                      </Col>
                      <Col span={10} style={{ marginLeft: '15px' }}>
                        <h3 style={titleStyle}>Mentor Name</h3>
                        <Tag color='#e4e4e4' style={{ width: '100%' }}>
                          <h3 style={tagStyle}>
                            {
                              !isBatchAudit ? (
                                get(stateAuditData, 'mentorMenteeSession.mentorSession.user.name', '-')
                              ) : (
                                get(stateAuditData, 'batchSession.mentorSession.user.name', '-')
                              )
                            }
                          </h3>
                        </Tag>
                      </Col>
                    </Row>
                  )
                }
              </>
              )
            }
          </Col>
          <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Progress
              type='circle'
              percent={this.getCustomScorePercentage() || '-'}
              width={150}
              strokeWidth={3}
              style={{
                marginRight: '20px'
              }}
              strokeColor={{
                '0%': '#ff198d',
                '100%': '#ff5100',
              }}
              format={() => (
                <h4>
                  { `${formatNumber(customSectionWiseScore, 0)}/${formatNumber(overAllQuestionScore, 0)}` }
                  <div style={{
                    margin: '5px 0px',
                    fontSize: '12px',
                    fontWeight: '550',
                    color: '#6a6868' }}
                  >Custom <br /> Score
                  </div>
                </h4>
              )}
            />
            <Progress
              type='circle'
              percent={this.getQualityPercentage() || '-'}
              width={150}
              strokeWidth={3}
              strokeColor={{
                '0%': '#ff198d',
                '100%': '#ff5100',
              }}
              format={() => (
                <h4>
                  { `${formatNumber(totalQualityScore, 0)}/${formatNumber(overAllQuestionScore, 0)}` }
                  <div style={{
                    margin: '5px 0px',
                    fontSize: '12px',
                    fontWeight: '550',
                    color: '#6a6868' }}
                  >Quality <br /> Score
                  </div>
                </h4>
              )}
            />
          </Col>
        </Row>
        {isViewOnlyMode && (
          <Row>
            <Col span={24}>
              <MentorAuditListStyle.ViewOnly>
                <Icon style={{ fontSize: '18px', marginRight: '.4rem' }} type='eye' />
                  View Only
              </MentorAuditListStyle.ViewOnly>
            </Col>
          </Row>
          )}
        <Divider style={{ height: '4px', marginTop: '.7rem' }} />
      </div>
    )
  }
}

export default TopSection
