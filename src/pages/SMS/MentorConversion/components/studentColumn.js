/* eslint-disable */
import React, { Component, Fragment } from 'react'
import MentorConversionStyle from '../MentorConversion.style'
import { Row, Col } from 'antd'
import MentorTags from '../../../../components/MentorTags'
import { get } from 'lodash'
import updateUserCurrentTopicComponentStatus from '../../../../actions/mentorConversionOfSchool/updateUserCurrentTopicStatus'

class Student extends Component {
  state = {
    model: [
      {
        type: 'oneToOne',
        value: '1:1'
      },
      {
        type: 'oneToTwo',
        value: '1:2'
      },
      {
        type: 'oneToThree',
        value: '1:3'
      }
    ],
    installments: [
      {
        type: 'A',
        values: [1, 2, 3]
      },
      {
        type: 'M',
        values: [4, 5, 6, 7, 8, 9, 10]
      }
    ]
  }

  updateEnrollmentType = type => {
    const student = this.props.data
    const currentTopicStatusId = get(student, 'currentTopicStatus[0].id')
    if (currentTopicStatusId) {
      updateUserCurrentTopicComponentStatus(
        currentTopicStatusId,
        {
          enrollmentType: type
        }
      )
    }
  }

  render() {
    const student = this.props.data
    const { Hl, Title, NoticeBox, ToggleButton} = MentorConversionStyle
    return (
        <Fragment>
        {
          Object.keys(student.personal).map(key =>
            <Row >
              <Col span={8} style={{
                padding: '5px 0',
              }}
              ><Title>{key}</Title></Col>
              <Col span={12} style={{
                borderLeft: '1px solid #d8d8d8',
                padding: '5px 0',
                paddingLeft: 10,
              }}>{student.personal[key]}</Col>
            </Row>
          )
        }
        <Hl/>
        <Row>
        <Col span={8} style={{
          padding: '5px 0',
        }}
        ><Title>Mentor</Title></Col>
        <Col span={12} style={{
          borderLeft: '1px solid #d8d8d8',
          padding: '5px 0',
          paddingLeft: 10,
        }}>{get(student, 'mentorFeedback.name')}</Col>
        </Row>
        <Row>
        <Col span={8} style={{
          padding: '5px 0',
        }}
        ><Title>Current Course</Title></Col>
        <Col span={12} style={{
          borderLeft: '1px solid #d8d8d8',
          padding: '5px 0',
          paddingLeft: 10,
        }}>{get(student, 'currentTopicStatus[0].currentCourse.title')}</Col>
        </Row>
        <Row>
        <Col span={8} style={{
          padding: '5px 0',
        }}
        ><Title>Current Topic</Title></Col>
        <Col span={12} style={{
          borderLeft: '1px solid #d8d8d8',
          padding: '5px 0',
          paddingLeft: 10,
        }}>{get(student, 'currentTopicStatus[0].currentTopic.title')}</Col>
        </Row>
        <Row>
        <Col span={8} style={{
          padding: '5px 0',
        }}
        ><Title>Enrollment Type</Title></Col>
        <Col span={12} style={{
          borderLeft: '1px solid #d8d8d8',
          padding: '5px 0',
          paddingLeft: 10,
        }}>
            {
              get(student, 'admin') ?
                <Fragment>
                  <ToggleButton
                    style={{
                      backgroundColor: get(student, 'currentTopicStatus[0].enrollmentType') === 'free' ? '#278af3' : '#fff',
                      color: get(student, 'currentTopicStatus[0].enrollmentType') === 'free' ? '#fff' : '#278af3',
                    }}
                    onClick={e => this.updateEnrollmentType('free')}
                  >
                    Free
                  </ToggleButton>
                  <ToggleButton
                    style={{
                      backgroundColor: get(student, 'currentTopicStatus[0].enrollmentType') === 'pro' ? '#278af3' : '#fff',
                      color: get(student, 'currentTopicStatus[0].enrollmentType') === 'pro' ? '#fff' : '#278af3',
                    }}
                    onClick={e => this.updateEnrollmentType('pro')}
                  >
                    Pro
                  </ToggleButton>
                </Fragment> : get(student, 'currentTopicStatus[0].enrollmentType')
            }
        </Col>
        </Row>
        <Hl />
        <Row>
          <Col  span={12}>
            <Row><Col><Title>HomeWork</Title></Col></Row>
            <Row><Col>{student.mentorFeedback.homework ? 'done' : 'not done'}</Col></Row>
          </Col>
          <Col  span={12}>
              <Row><Col><Title>Mentor Rating {student.mentorFeedback.rating ? student.mentorFeedback.rating : '-'}/5</Title></Col></Row>
              <Row><Col>
               {
                 student.mentorFeedback.tags ? <MentorTags tags={student.mentorFeedback.tags} /> : null
               }
              </Col></Row>
          </Col>
        </Row>
        <Hl/>
        <Title>Session Feedback</Title>
        <NoticeBox>
          {student.sessionFeedback ? student.sessionFeedback : '-'}
        </NoticeBox>
      </Fragment>
    )
  }
}
export default Student
