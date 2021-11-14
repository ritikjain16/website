// import { Icon } from 'antd'
/* eslint-disable no-nested-ternary */
import React from 'react'
import { Spin } from 'antd'
import { Table } from '../../../components/StyledComponents'
import MainTable from '../../../components/MainTable'
import CourseCompletionStyle from '../CourseCompletion.style'
import CourseCompletionTableRow from './CourseCompletionTableRow'

const CourseCompletionTable = (props) => {
  const columnsTemplate = 'minmax(12px,1fr) minmax(180px,1fr) minmax(180px,1fr) minmax(150px,1fr) minmax(50px,1fr) minmax(50px,1fr) minmax(50px,1fr) minmax(300px,1fr)'
  const minWidth = '960px'
  const rowLayoutProps = {
    minWidth,
    columnsTemplate
  }
  const { showLoading,
    courseCompletionData,
    openModal,
    courseCompletionUpdateStatus,
    sendCertificateUpdateStatus,
    sendJourneySnapshotUpdateStatus,
    userSavedCodes
  } = props
  return (
    <div>
      <Table.Row
        columnsTemplate={rowLayoutProps.columnsTemplate}
        minWidth={rowLayoutProps.minWidth}
        style={{ border: '1px solid black', marginBottom: 10 }}
      >
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>#</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Student Name</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Parent Name</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Phone Number</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Email ID</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Grade</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>Vertical</MainTable.Title>
        </Table.Item>
        <Table.Item>
          <MainTable.Title style={{ fontSize: 14 }}>School Name</MainTable.Title>
        </Table.Item>
      </Table.Row>
      {
        (showLoading === true) ?
          <CourseCompletionStyle.IconContainer>
            <Spin size='large' spinning />
          </CourseCompletionStyle.IconContainer>
          : (courseCompletionData.length === 0) ?
            <div style={{
              textAlign: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: '#383838',
              backgroundColor: '#F5F5F5',
              padding: '5px'
            }}
            >
              No data available
            </div> :
            courseCompletionData.map((data, index) => <CourseCompletionTableRow
              key={data.id}
              columnsTemplate={columnsTemplate}
              minWidth={minWidth}
              data={data}
              index={index}
              openModal={openModal}
              courseCompletionUpdateStatus={courseCompletionUpdateStatus}
              sendCertificateUpdateStatus={sendCertificateUpdateStatus}
              sendJourneySnapshotUpdateStatus={sendJourneySnapshotUpdateStatus}
              userSavedCodes={userSavedCodes}
            />)
      }
    </div>
  )
}

export default CourseCompletionTable
