import React, { Component } from 'react'
import { get } from 'lodash'
import { Button, Col, Row, Checkbox, Radio, Empty, TimePicker, Alert, Popconfirm } from 'antd'
import moment from 'moment'
import TextArea from 'antd/lib/input/TextArea'
import {
  CloseOutlined,
  DashboardTwoTone,
  PlusOutlined,
} from '@ant-design/icons'
import addMentorMenteeSessionTimestamp from '../../../actions/mentorAudits/addMentorMenteeSessionTimestamp'
import deleteMentorMenteeSessionTimestamp from '../../../actions/mentorAudits/deleteMentorMenteeSessionTimestamp'
import updateMentorMenteeSessionTimestamp from '../../../actions/mentorAudits/updateMentorMenteeSessionTimeStamp'
import TagsModal from './TagsModal'

const rowStyle = {
  textAlign: 'center',
  margin: '5px auto',
}
const divStyle = {
  height: 'auto',
  width: '100%',
  backgroundColor: '#e4e4e4',
  margin: '0 auto',
  padding: '10px',
  display: 'flex',
  overflow: 'scroll',
}
const tagsDivStyle = {
  height: '78px',
  width: '100%',
  backgroundColor: '#e4e4e49c',
  margin: '0 auto',
  padding: '10px',
  display: 'flex',
  overflow: 'scroll',
  border: 'none'
}

const lavelStyle = {
  color: '#6a6868',
  fontSize: '14px',
  margin: '0 auto',
  float: 'left',
}
// const ipSkills = [
//   {
//     label: 'enthusiasm',
//     accent: '#f8931d'
//   },
//   {
//     label: 'engaging',
//     accent: '#03ddad'
//   },
//   {
//     label: 'dedication',
//     accent: '#2975e5'
//   },
//   {
//     label: 'patience',
//     accent: '#17d978'
//   },
//   {
//     label: 'creativity',
//     accent: '#f8931d'
//   },
//   {
//     label: 'friendliness',
//     accent: '#fbc6fc'
//   },
//   {
//     label: 'flexibility',
//     accent: '#58cfd2'
//   },
//   {
//     label: 'sense of humor',
//     accent: '#9b51e0'
//   },
//   {
//     label: 'inspiring',
//     accent: '#2975e5'
//   },
//   {
//     label: 'distracted',
//     accent: '#f9e73f'
//   },
//   {
//     label: 'rude',
//     accent: '#ff5744'
//   },
//   {
//     label: 'annoying',
//     accent: '#f9e73f'
//   },
//   {
//     label: 'dormant',
//     accent: '#eb5757'
//   },
// ]

const checkOptions = ['Rude', 'Distracted', 'Dormant']
class CheckSignesOnClass extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timeStamps: [],
      checkedItems: ['Rude'],
      addTagsModal: false,
      selectedTagIndex: null
    }
  }
  filterTimeStampComment = (timestampComment) => timestampComment.filter(timestamp => {
    if ((timestamp.rude || timestamp.distracted || timestamp.dormant)) {
      return timestamp
    }
  })

  componentDidUpdate(prevPros) {
    const { stateAuditData } = this.props
    // if (prevPros.mentorMenteeSessionAudit.timestampComment
    //   !== this.props.mentorMenteeSessionAudit.timestampComment) {
    //   const filteredTimeStampComments
    // = this.filterTimeStampComment(get(mentorMenteeSessionAudit, 'timestampComment', []))
    //   this.setState({
    //     timeStamps: filteredTimeStampComments
    //   })
    // }
    if (prevPros.stateAuditData !== stateAuditData) {
      // const filteredTimeStampComments
      //  = this.filterTimeStampComment(get(this.props, 'timestampAnswer', []))
      const filteredTimeStampComments = get(this.props, 'timestampAnswer', [])
      if (filteredTimeStampComments && filteredTimeStampComments.length > 0) {
        this.setState({
          timeStamps: filteredTimeStampComments
        })
      } else {
        this.setState({
          timeStamps: [{ answerTimestampTags: [] }]
        })
      }
    }
  }

  addNewTimeStampCommentRow = async () => {
    const input = { answerTimestampTags: [] }
    if (this.state.checkedItems.length > 0) {
      this.state.checkedItems.forEach(item => {
        input.answerTimestampTags.push({ title: item.toLowerCase() })
      })
    }
    this.setState({
      timeStamps: [...this.state.timeStamps, { ...input }]
    })
  }

  deleteMentorMenteeSessionAuditTimeStamp = async (timeStampIndex) => {
    const timeStampId = get(this.state.timeStamps[timeStampIndex], 'id', null)
    if (timeStampId) {
      await deleteMentorMenteeSessionTimestamp(timeStampId)
    }
    this.setState({
      timeStamps: this.state.timeStamps.filter((_, index) => index !== timeStampIndex)
    })
  }

  updateMentorMenteeSessionAuditTimeStamp = async (timeStampIndex) => {
    const input = this.removeNullFromObject(this.state.timeStamps[timeStampIndex])
    const { answerTimestampTags } = this.state.timeStamps[timeStampIndex]
    const timeStampId = get(this.state.timeStamps[timeStampIndex], 'id', null)
    if (get(this.state.timeStamps[timeStampIndex], 'startTime') === null
      || get(this.state.timeStamps[timeStampIndex], 'startTime', 0) === 0) {
      this.setState({
        timeStamps: this.state.timeStamps.map(
          (timeStamp, index) => (index === timeStampIndex ?
            Object.assign({}, timeStamp, {
              startTimeError: true,
              error: 'Please Select StartTime!'
            })
            : timeStamp)
        ),
      })
      return false
    }
    if (get(this.state.timeStamps[timeStampIndex], 'endTime') === null
      || get(this.state.timeStamps[timeStampIndex], 'endTime', 0) === 0) {
      this.setState({
        timeStamps: this.state.timeStamps.map(
          (timeStamp, index) => (index === timeStampIndex ?
            Object.assign({}, timeStamp, {
              endTimeError: true,
              error: 'Please Select EndTime!'
            })
            : timeStamp)
        ),
      })
      return false
    }
    if (this.state.timeStamps[timeStampIndex].startTime >
      this.state.timeStamps[timeStampIndex].endTime) {
      this.setState({
        timeStamps: this.state.timeStamps.map((timeStamp, index) =>
          index === timeStampIndex
            ? Object.assign({}, timeStamp, {
              error: 'EndTime should be geater then StartTime!',
              endTimeError: true,
            })
            : timeStamp
        ),
      })
      return false
    }
    this.setState({
      timeStamps: this.state.timeStamps.map(
        (timeStamp, index) => (index === timeStampIndex ?
          Object.assign({}, timeStamp, {
            startTimeError: false,
            endTimeError: false,
            error: false,
            loading: true
          })
          : timeStamp)
      ),
    })
    if (timeStampId) {
      input.answerTimestampTags = {
        replace: answerTimestampTags
      }
      await updateMentorMenteeSessionTimestamp(timeStampId, input)
    } else {
      input.answerTimestampTags = answerTimestampTags
      const { auditId, auditTypeFromRoute } = this.props
      await addMentorMenteeSessionTimestamp({
        auditId,
        auditQuestionId: get(this.props, 'question.auditQuestion.id'),
        type: auditTypeFromRoute,
        input
      }).then(() => {
        this.props.fetchAuditDetails()
      })
    }
    this.setState({
      timeStamps: this.state.timeStamps.map(
        (timeStamp, index) => (index === timeStampIndex ?
          Object.assign({}, timeStamp, { loading: false })
          : timeStamp)
      ),
    })
  }


  removeNullFromObject = (obj) => {
    const unwantedFields = ['createdAt', 'updatedAt', 'id', 'loading', 'error', 'startTimeError', 'endTimeError', 'auditQuestion', 'answerTimestampTags']
    // Protect against null/undefined object passed in
    return Object.keys(obj || {}).reduce((x, k) => {
      // Check for null or undefined
      if (obj[k] !== null && !unwantedFields.includes(k)) {
        x[k] = obj[k]
      }
      return x
    }, {})
  }

  onTagsChange = (value, timeStampIndex) => {
    const newTimeStamps = [...this.state.timeStamps]
    let { answerTimestampTags } = newTimeStamps[timeStampIndex]
    const existTag = answerTimestampTags.find(tag => tag === value)
    if (existTag) {
      return null
    }
    answerTimestampTags = [...answerTimestampTags, { title: value }]
    newTimeStamps[timeStampIndex].answerTimestampTags = answerTimestampTags
    this.setState({
      timeStamps: newTimeStamps
    })
  }

  onTagsDelete = (value, timeStampIndex) => {
    const newTimeStamps = [...this.state.timeStamps]
    let { answerTimestampTags } = newTimeStamps[timeStampIndex]
    const existTag = answerTimestampTags.find(tag => tag.title === value)
    if (existTag) {
      answerTimestampTags = [...answerTimestampTags].filter(tag => tag.title !== value)
      newTimeStamps[timeStampIndex].answerTimestampTags = answerTimestampTags
    }
    this.setState({
      timeStamps: newTimeStamps
    })
  }

  onCommentInputChange = (e, timeStampIndex) => {
    this.setState({
      timeStamps: this.state.timeStamps.map(
        (timeStamp, index) => (index === timeStampIndex ?
          Object.assign({}, timeStamp, { comment: e.target.value })
          : timeStamp)
      ),
    })
  }

  onRadioChange = (e, timeStampIndex) => {
    const value = {
      isGood: false,
      needWork: true
    }
    if (e.target.value) {
      value.isGood = true
      value.needWork = false
    }
    this.setState({
      timeStamps: this.state.timeStamps.map(
        (timeStamp, index) => (index === timeStampIndex ?
          Object.assign({}, timeStamp, value)
          : timeStamp)
      ),
    })
  }

  onTimeChange = (timeString, timeStampIndex, key) => {
    const miliseconds = moment(timeString || '00:00:00', 'HH:mm:ss').diff(
      moment().startOf('day'),
      'miliseconds'
    )
    this.setState({
      timeStamps: this.state.timeStamps.map(
        (timeStamp, index) => (index === timeStampIndex ?
          Object.assign({}, timeStamp, {
            startTimeError: false,
            endTimeError: false,
            error: null,
            [key]: miliseconds
          })
          : timeStamp)
      ),
    }, () => {
      if (this.state.timeStamps[timeStampIndex].startTime >
        this.state.timeStamps[timeStampIndex].endTime) {
        this.setState({
          timeStamps: this.state.timeStamps.map(
            (timeStamp, index) => (index === timeStampIndex ?
              Object.assign({}, timeStamp, {
                error: 'EndTime should be geater then StartTime!',
                endTimeError: true,
                endTime: miliseconds + 1000
              })
              : timeStamp)
          ),
        })
      }
    })
  }

  onCheckBoxChange = (checkedValues) => {
    const input = {
      rude: false,
      dormant: false,
      distracted: false
    }
    checkedValues.forEach((item) => {
      input[item.toLowerCase()] = true
    })
    this.setState({
      checkedItems: checkedValues,
      timeStamps: this.state.timeStamps.map(
        (timeStamp) => (timeStamp ?
          Object.assign({}, timeStamp, input)
          : timeStamp)
      ),
    })
  }

  render() {
    const { isViewOnlyMode, question } = this.props
    const questionTags = get(question, 'auditQuestion.timestampTags')
    return (
      <div style={{ marginTop: '15px' }}>
        <p>{get(question, 'auditQuestion.statement')}</p>
        <div style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p />
            <Checkbox.Group
              disabled={isViewOnlyMode}
              options={checkOptions}
              defaultValue={this.state.checkedItems}
              value={this.state.checkedItems}
              onChange={this.onCheckBoxChange}
            />
            {!isViewOnlyMode && (
              <Col span={1}>
                <div style={{ margin: '0 0 0 5px' }}>
                  <Button
                    type='primary'
                    shape='circle'
                    onClick={() => { this.addNewTimeStampCommentRow() }}
                    disabled={this.state.checkedItems.length < 1}
                    style={{ width: '50px', height: '50px', right: '40px' }}
                  >
                    <PlusOutlined
                      style={{ fontSize: '30px', textAlign: 'center' }}
                    />
                  </Button>
                </div>
              </Col>
            )}
          </div>
          {!isViewOnlyMode && (
            <p>Please specifiy timelines and share details</p>
          )}
          {(this.state.timeStamps.length > 0 && !isViewOnlyMode) && (
            <Alert
              style={{
                marginBottom: '1rem',
                width: 'fit-content'
              }}
              message='Please do not forget to update timestamp records!'
              type='warning'
              showIcon
              closable
            />
          )}
          {this.state.timeStamps.length > 0 ? (
            this.state.timeStamps.map((timeStamp, index) => (
              <Row style={rowStyle} key={timeStamp.id}>
                <Col span={5}>
                  <Row>
                    <Col span={12}>
                      <p
                        style={{
                        color: '#5cbd4a',
                        fontSize: '12px',
                        margin: '0 auto',
                      }}
                      >
                      Start Time
                      </p>
                      <TimePicker
                        style={{
                          border: timeStamp.startTimeError ? '1px solid crimson' : '',
                          borderRadius: '4px',
                          userSelect: isViewOnlyMode && 'none',
                          pointerEvents: isViewOnlyMode && 'none'
                        }}
                        inputReadOnly
                        allowClear={false}
                        defaultValue={moment('00:00:00', 'HH:mm:ss')}
                        value={moment('2000-01-01 00:00:00').add(moment.duration(get(timeStamp, 'startTime', 0) || 0))}
                        onChange={(e, timeString) => this.onTimeChange(timeString, index, 'startTime')}
                      />
                    </Col>
                    <Col span={12}>
                      <p
                        style={{
                        color: '#fc7f7f',
                        fontSize: '12px',
                        margin: '0 auto',
                      }}
                      >
                      End Time
                      </p>
                      <TimePicker
                        style={{
                          border: timeStamp.endTimeError ? '1px solid crimson' : '',
                          borderRadius: '4px',
                          userSelect: isViewOnlyMode && 'none',
                          pointerEvents: isViewOnlyMode && 'none'
                        }}
                        inputReadOnly
                        allowClear={false}
                        defaultValue={moment('00:00:00', 'HH:mm:ss')}
                        disabledHours={() =>
                        [...Array(moment.duration(get(timeStamp, 'startTime', 0) || 0).get('Hours')).keys()]
                      }
                        disabledMinutes={() =>
                        [...Array(moment.duration(get(timeStamp, 'startTime', 0) || 0).get('minutes')).keys()]
                      }
                        disabledSeconds={() =>
                        [...Array(moment.duration(get(timeStamp, 'startTime', 0) || 0).get('seconds') + 1).keys()]
                      }
                        value={moment('2000-01-01 00:00:00').add(moment.duration(get(timeStamp, 'endTime', 0) || 0))}
                        onChange={(e, timeString) => this.onTimeChange(timeString, index, 'endTime')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    {timeStamp.error ? <Alert
                      style={{
                      width: 'fit-content',
                      margin: '.5rem 1rem'
                    }}
                      message={timeStamp.error}
                      type='error'
                      showIcon
                    /> : null}
                  </Row>
                </Col>
                <Col span={6}>
                  <p style={lavelStyle}>Comments</p>
                  <TextArea
                    readOnly={isViewOnlyMode}
                    rows={3}
                    bordered={false}
                    value={get(timeStamp, 'comment', '')}
                    onChange={(e) => this.onCommentInputChange(e, index)}
                    style={{ backgroundColor: '#e4e4e49c', border: 'none' }}
                  />
                </Col>
                <Col span={4} style={{ margin: '0 10px' }}>
                  <div
                    style={{
                    marginBottom: '0',
                  }}
                  >
                    <DashboardTwoTone
                      style={{
                      fontSize: '16px',
                      marginRight: '150px',
                    }}
                      twoToneColor='#eb2f96'
                    />
                  </div>
                  <div style={divStyle}>
                    <Radio.Group
                      style={{ textAlign: 'left' }}
                      onChange={(e) => this.onRadioChange(e, index)}
                      value={!!timeStamp.isGood}
                    >
                      <Row>
                        <Col span={24}>
                          <Radio
                            style={{
                              userSelect: isViewOnlyMode && 'none',
                              pointerEvents: isViewOnlyMode && 'none'
                            }}
                            value
                          >Good
                          </Radio>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Radio
                            style={{
                              userSelect: isViewOnlyMode && 'none',
                              pointerEvents: isViewOnlyMode && 'none'
                            }}
                            value={false}
                          >Need Work
                          </Radio>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </div>
                </Col>
                <Col span={5}>
                  <p style={lavelStyle}>{ !isViewOnlyMode && 'Add'} Tags for Mapping</p>
                  <div style={tagsDivStyle}>
                    <div style={{ float: 'left' }}>
                      {!isViewOnlyMode && (
                        <Button
                          type='primary'
                          shape='circle'
                          onClick={() => this.setState({
                            addTagsModal: true,
                            selectedTagIndex: index
                          })}
                        >
                          <PlusOutlined
                            style={{ fontSize: '15px', textAlign: 'center' }}
                          />
                        </Button>
                      )}
                      <TagsModal
                        visible={this.state.addTagsModal}
                        timeStampIndex={this.state.selectedTagIndex}
                        onTagsChange={this.onTagsChange}
                        onTagsDelete={this.onTagsDelete}
                        timeStampComment={this.state.timeStamps}
                        tagList={questionTags}
                        closeModal={() => {
                          this.setState({
                            addTagsModal: false
                          })
                        }}
                      />
                    </div>
                    <div
                      style={{
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                    >
                      {questionTags.map((tag) => {
                      const existTag = timeStamp.answerTimestampTags.find(tagValue =>
                        tagValue.title === tag.title)
                      if (existTag) {
                        return (
                          <div style={{
                            borderRadius: '100px',
                            margin: '0px 5px',
                            height: 'fit-content',
                            padding: '10px 15px',
                            color: '#fff',
                            backgroundColor: '#8C61CB'
                          }}
                          >{tag.title}
                          </div>
                        )
                      }
                    })}
                    </div>
                  </div>
                </Col>
                {!isViewOnlyMode && (
                  <Col span={3}>
                    <Row style={{ margin: '.5rem' }}>
                      <Col span={24} style={{ margin: '.2rem 0rem' }}>
                        <div style={{ margin: '0 0 0 5px' }} key={timeStamp.id}>
                          <Popconfirm
                            onConfirm={() => this.deleteMentorMenteeSessionAuditTimeStamp(index)}
                            title='Do you want to delete this timestamp?'
                            placement='top'
                          >
                            <Button
                              type='danger'
                              shape='circle'
                              style={{ width: '40px', height: '40px' }}
                            >
                              <CloseOutlined
                                style={{ fontSize: '22px', textAlign: 'center' }}
                              />
                            </Button>
                          </Popconfirm>
                        </div>
                      </Col>
                      <Col span={24} style={{ margin: '.2rem 0rem' }}>
                        <div style={{ margin: '0 0 0 5px' }} key={timeStamp.id}>
                          <Button
                            type='primary'
                            size='small'
                            onClick={() => this.updateMentorMenteeSessionAuditTimeStamp(index)}
                            loading={get(timeStamp, 'loading', false)}
                            style={{ height: '40px' }}
                          > Update
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
            ))) : (
              <Empty description={isViewOnlyMode ? 'No TimeStamp' : 'Start By Adding New Timestamp'} />
          )}
        </div>
      </div>
    )
  }
}

export default CheckSignesOnClass
