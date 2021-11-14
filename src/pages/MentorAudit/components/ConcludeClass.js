import { Col, Divider, Row, Input, Button } from 'antd'
import { get } from 'lodash'
import React, { Component } from 'react'

const { TextArea } = Input
const titleStyle = { fontSize: '23px', fontWeight: '500', color: '#1c91ff' }
const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '8px auto',
}

const saveButtonStyle = {
  color: '#ffffff',
  margin: '1rem 0rem',
  background: '#06b004',
  '&:hover': {
    textDecoration: 'auto !important',
    background: 'red',
  },
}

class ConcludeClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      overallClassComment: '',
      loading: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const { mentorMenteeSessionAudit } = this.props
      this.setState({
        overallClassComment: get(mentorMenteeSessionAudit, 'overallClassComment', '')
      })
    }
  }
  onChange = ({ target: { value } }) => {
    this.setState({
      overallClassComment: value
    }, () => {
      this.props.setMentorAuditData({ overallClassComment: value })
    })
  }

  saveFinalComment = () => {
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
          <p style={titleStyle}>Conclude Class</p>
        </div>
        <Row style={rowStyle}>
          <Col span={24}>
            <TextArea
              readOnly={isViewOnlyMode}
              rows={3}
              value={this.state.overallClassComment}
              placeholder='Add Final Comment'
              style={{ width: '85%' }}
              onChange={this.onChange}
            />
          </Col>
        </Row>
        { !isViewOnlyMode && (
          <Row>
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                type='default'
                shape='round'
                size='large'
                style={saveButtonStyle}
                loading={this.state.loading}
                onClick={() => { this.saveFinalComment() }}
              >
                    Save Final Comment
              </Button>
            </Col>
          </Row>
        )}
      </div>
    )
  }
}

export default ConcludeClass
