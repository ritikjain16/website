import { CaretRightOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import React, { Component, Fragment } from 'react'
import { Button, Icon, Table as AntTable, Tooltip } from 'antd'
import MainTable from '../../../components/MainTable'
import { Table } from '../../../components/StyledComponents'
import CourseCompletionStyle from '../CourseCompletion.style'
import ViewCertificateModal from './ViewCertificateModal'
import EditMentorCommentModal from './EditMentorCommentModal'
import fetchUserSavedCodes from '../../../actions/CourseCompletion/fetchUserSavedCodes'
import sendJourneySnapshotInMail from '../../../actions/CourseCompletion/sendJourneySnapshotInMail'
import sendCertificateInMail from '../../../actions/CourseCompletion/sendCertificateInMail'
import SendConfirmationModal from './SendConfirmationModal'


export default class CourseCompletionTableRow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: get(props, 'index') === 0 ? get(props, 'data.id') : '',
      coursesData: [],
      isModalVisible: false,
      isEditCommentModalVisible: false,
      isConfirmationModalVisible: false,
      asset: 'certificate'
    }
  }
  componentDidMount = () => {
    this.setCoursesData()
  }
  setCoursesData = () => {
    const { data } = this.props
    const coursesData = []
    const courseName = get(data, 'course.title', '-')
    const lastSessionDate = get(data, 'courseEndingDate', '-')
    const allottedMentor = get(data, 'mentors[0].name', '-')
    const enrollmentType = get(data, 'user.studentProfile.batch.type', '-')
    const batchCode = get(data, 'user.studentProfile.batch.code', '-')
    const journeyReportLink = get(data, 'user.id', '-')
    const userId = get(data, 'user.id', '-')
    const certificate = get(data, 'id', '-')
    const mentorComment = get(data, 'id', '-')
    coursesData.push({
      courseName,
      lastSessionDate,
      allottedMentor,
      enrollmentType,
      batchCode,
      journeyReportLink,
      certificate,
      mentorComment,
      userId
    })
    this.setState({
      coursesData
    })
  }
  getSchoolColumn = () => {
    const { data } = this.props
    const column = [
      {
        title: 'Sr.No',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        fixed: 'left',
        render: (text, record, index) => index + 1,
      },
      {
        title: 'Course Name',
        dataIndex: 'courseName',
        key: 'courseName',
        align: 'center',
        fixed: 'left',
      },
      {
        title: 'Last Session On',
        dataIndex: 'lastSessionDate',
        key: 'lastSessionDate',
        align: 'center',
      },
      {
        title: 'Allotted Mentor',
        dataIndex: 'allottedMentor',
        key: 'allottedMentor',
        align: 'center',
      },
      {
        title: 'Enrollment Type',
        dataIndex: 'enrollmentType',
        key: 'enrollmentType',
        align: 'center',
      },
      {
        title: 'Batch Code',
        dataIndex: 'batchCode',
        key: 'batchCode',
        align: 'center',
      },
      {
        title: 'Journey Report Link',
        dataIndex: 'journeyReportLink',
        key: 'journeyReportLink',
        align: 'center',
        render: () => (
          <div>
            <Button
              type='link'
              style={{ fontSize: 16 }}
              href={`/ums/studentJourney/${get(data, 'user.id', '')}`}
              target='_blank'
            >
              <CourseCompletionStyle.LinkIcon />
            </Button>
          </div>
        )
      },
      {
        title: 'Certificate',
        dataIndex: 'certificate',
        key: 'certificate',
        align: 'center',
        render: () => (
          <div>
            <Tooltip title='View'>
              <Button
                type='link'
                style={{ fontSize: 16 }}
                onClick={() => this.openModal('certificate')}
              >
                <Icon type='eye' />
              </Button>
            </Tooltip>
            <Button
              type='primary'
              style={{ fontSize: 12 }}
              onClick={() => this.openConfirmationModal('certificate')}
            >
              Share
            </Button>
          </div>
        )
      },
      {
        title: 'Course Journey Snapshot',
        dataIndex: 'journeySnapshot',
        key: 'journeySnapshot',
        align: 'center',
        render: () => (
          <div>
            <Tooltip title='View'>
              <Button
                type='link'
                style={{ fontSize: 16 }}
                onClick={() => this.openModal('journeySnapshot')}
              >
                <Icon type='eye' />
              </Button>
            </Tooltip>
            <Button
              type='primary'
              style={{ fontSize: 12 }}
              onClick={() => this.openConfirmationModal('journeySnapshot')}
            >
              Share
            </Button>
          </div>
        )
      },
      {
        title: 'Comment',
        dataIndex: 'mentorComment',
        key: 'mentorComment',
        align: 'center',
        render: () => (
          <div>
            <Button
              type='link'
              style={{ fontSize: 16 }}
              onClick={() => this.openEditMentorCommentModal()}
            >
              <MainTable.ActionItem.EditIcon />
            </Button>
          </div>
        )
      }
    ]
    return column
  }
  sendJourneySnapshotMail = () => {
    const { coursesData } = this.state
    // pass User id here
    sendJourneySnapshotInMail(coursesData[0].userId)
  }
  sendCertificateMail = () => {
    const { coursesData } = this.state
    // pass User id here
    sendCertificateInMail(coursesData[0].userId)
  }
  openModal = (type) => {
    const { coursesData } = this.state
    this.setState({
      asset: type,
      isModalVisible: true
    })
    if (type !== 'certificate') {
      fetchUserSavedCodes({ id: coursesData[0].userId })
    }
  }
  closeModal = () => {
    this.setState({
      isModalVisible: false
    })
  }
  openEditMentorCommentModal = () => {
    this.setState({
      isEditCommentModalVisible: true
    })
  }
  closeEditMentorCommentModal = () => {
    this.setState({
      isEditCommentModalVisible: false
    })
  }
  openConfirmationModal = (type) => {
    this.setState({
      asset: type,
      isConfirmationModalVisible: true
    })
  }
  closeConfirmationModal = () => {
    this.setState({
      isConfirmationModalVisible: false
    })
  }
  getVertical = (batchType) => {
    if (batchType === 'normal') {
      return 'B2C'
    } else if (batchType === 'b2b') {
      return 'B2B'
    } else if (batchType === 'b2b2c') {
      return 'B2B2C'
    }
    return '-'
  }
  render() {
    const { activeKey, coursesData, isModalVisible, asset,
      isEditCommentModalVisible, isConfirmationModalVisible } = this.state
    const { data, columnsTemplate, minWidth, index,
      courseCompletionUpdateStatus, sendCertificateUpdateStatus,
      sendJourneySnapshotUpdateStatus, userSavedCodes } = this.props
    return (
      <Fragment>
        <CourseCompletionStyle.StyledCollapse
          activeKey={activeKey}
          accordion
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          style={{ border: '1px solid black', marginBottom: 10 }}
        >
          <CourseCompletionStyle.StyledPanel
            key={data.id}
            header={(
              <MainTable.Row
                columnsTemplate={columnsTemplate}
                minWidth={minWidth}
                style={{
                  height: 'fit-content',
                  border: 'none',
                }}
                onClick={(event) => {
                  event.stopPropagation()
                  this.setState({
                    activeKey: activeKey ? '' : data.id
                  })
                }}
              >
                <Table.Item >
                  <MainTable.Item>{index + 1}</MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {get(data, 'user.name', '-')}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {get(data, 'user.studentProfile.parents[0].user.name', '-')}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {get(data, 'user.studentProfile.parents[0].user.phone.number', '-')}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {get(data, 'user.studentProfile.parents[0].user.email', '-')}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {get(data, 'user.studentProfile.grade', '-')}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {this.getVertical(get(data, 'user.studentProfile.batch.type', '-'))}
                  </MainTable.Item>
                </Table.Item>
                <Table.Item >
                  <MainTable.Item>
                    {get(data, 'user.studentProfile.school.name', '-')}
                  </MainTable.Item>
                </Table.Item>
              </MainTable.Row>
            )}
          >
            {
              coursesData.length > 0 ? (
                <AntTable
                  dataSource={coursesData}
                  columns={this.getSchoolColumn()}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              ) : (
                <h4 style={{ textAlign: 'center' }}>
                  No Course Information.
                </h4>
              )
            }
          </CourseCompletionStyle.StyledPanel>
        </CourseCompletionStyle.StyledCollapse>
        <ViewCertificateModal
          isModalVisible={isModalVisible}
          closeModal={this.closeModal}
          asset={asset}
          userId={get(data, 'user.id', '-')}
          data={data}
          userSavedCodes={userSavedCodes}
        />
        <EditMentorCommentModal
          isModalVisible={isEditCommentModalVisible}
          closeModal={this.closeEditMentorCommentModal}
          data={data}
          courseCompletionUpdateStatus={courseCompletionUpdateStatus}
        />
        <SendConfirmationModal
          isModalVisible={isConfirmationModalVisible}
          closeModal={this.closeConfirmationModal}
          sendCertificateMail={this.sendCertificateMail}
          sendJourneySnapshotMail={this.sendJourneySnapshotMail}
          data={data}
          sendCertificateUpdateStatus={sendCertificateUpdateStatus}
          sendJourneySnapshotUpdateStatus={sendJourneySnapshotUpdateStatus}
          asset={asset}
        />
      </Fragment>
    )
  }
}
