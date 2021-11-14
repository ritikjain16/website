import { Col, Divider, Row, Button } from 'antd'
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

const CodingExerciseOptions = [
  {
    key: 'isStudentProperlyHelped',
    label: 'Kid did it by himself even though he/she did not have appetite',
  },
  {
    key: 'isProactive',
    label: 'Prompted answers when the kid was able to do it by himself',
  },
  {
    key: 'encouragedKid',
    label: 'Encouraged kid to do it by themselves and helped upon struggling',
  },
  {
    key: 'rushed',
    label: 'Rushed through the coding assignment',
  },
]
class CodingExercise extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isStudentProperlyHelped: null,
      isProactive: null,
      encouragedKid: null,
      rushed: null,
      loading: false
    }
  }

  componentDidUpdate(preProps) {
    if (preProps !== this.props) {
      const { mentorMenteeSessionAudit } = this.props
      this.setState({
        isStudentProperlyHelped: get(mentorMenteeSessionAudit, 'isStudentProperlyHelped', false),
        isProactive: get(mentorMenteeSessionAudit, 'isProactive', false),
        encouragedKid: get(mentorMenteeSessionAudit, 'encouragedKid', false),
        rushed: get(mentorMenteeSessionAudit, 'rushed', false),
      })
    }
  }
  onChange = (e, key) => {
    this.setState({
      [key]: e.target.checked
    }, () => {
      this.props.setMentorAuditData({ [key]: e.target.checked })
    })
  }

  saveCodingExerciseAudit = () => {
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
          <p style={titleStyle}>Coding exercises</p>
        </div>
        <Row>
          <Col span={24} style={colStyle}>
            {CodingExerciseOptions.map(options => (
              <>
                <MentorAuditStyle.StyledCheckbox
                  style={{
                    userSelect: isViewOnlyMode && 'none',
                    pointerEvents: isViewOnlyMode && 'none'
                  }}
                  checked={this.state[options.key]}
                  onChange={(e) => this.onChange(e, options.key)}
                >
                  {options.label}
                </MentorAuditStyle.StyledCheckbox>
                <br />
                <br />
              </>
              ))
            }
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
                onClick={() => { this.saveCodingExerciseAudit() }}
              >
                    Save Coding Exercise Audit
              </Button>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default CodingExercise
