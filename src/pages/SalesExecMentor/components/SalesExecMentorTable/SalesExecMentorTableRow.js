import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Popconfirm, Badge } from 'antd'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import deleteMentor from '../../../../actions/salesExecProfiles/deleteMentor'
import UpdateMentorsModal from '../UpdateMentorsModal/UpdateMentorsModal'

class SalesExecMentorTableRow extends Component {
  state = {
    isMentorModalVisible: false,
    mentorEditingId: '',
    mentorEditingName: '',
  }
  static propTypes = {
    mentorName: PropTypes.string.isRequired,
    phoneNo: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    isMentorActive: PropTypes.bool.isRequired
  }

  closeMentorModal = () => this.setState({
    isMentorModalVisible: false
  })

  componentDidUpdate(prevProps) {
    if (prevProps.isMentorStatusUpdating && this.props.hasMentorStatusUpdated) {
      this.setState({
        isMentorModalVisible: false
      })
    }
  }

  render() {
    const {
      columnsTemplate,
      minWidth,
      mentorName,
      status,
      phoneNo,
      emailID,
      order,
      id,
      isMentorActive,
      salesExecId
    } = this.props
    return (
      <MainTable.Row
        columnsTemplate={columnsTemplate}
        noBorder
        minWidth={minWidth}
      >
        <Table.Item backgroundColor='rgba(228, 228, 228, 0.35)'>
          <MainTable.Item>{order}</MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor='rgba(228, 228, 228, 0.35)'>
          <MainTable.Item>{mentorName}</MainTable.Item>
          <div style={{ marginLeft: 'auto' }}>
            <Badge color={isMentorActive ? 'green' : 'red'} />
          </div>
        </Table.Item>
        <Table.Item backgroundColor='rgba(228, 228, 228, 0.35)'>
          <MainTable.Item>{status}</MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor='rgba(228, 228, 228, 0.35)'>
          <MainTable.Item>{emailID}</MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor='rgba(228, 228, 228, 0.35)'>
          <MainTable.Item>{phoneNo}</MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor='rgba(228, 228, 228, 0.35)'>
          <MainTable.ActionItem.IconWrapper
            onClick={() => this.setState({
              isMentorModalVisible: true,
              mentorEditingId: id,
              mentorEditingName: mentorName,
            })
            }
          >
            <MainTable.ActionItem.EditIcon />
          </MainTable.ActionItem.IconWrapper>
          <div
            style={{
              width: '10px'
            }}
          />
          <div>
            <Popconfirm
              title='Do you want to delete this mentor?'
              placement='topRight'
              onConfirm={() => { deleteMentor(id, salesExecId).call() }}
              okText='Yes'
              cancelText='Cancel'
              key='delete'
              overlayClassName='popconfirm-overlay-primary'
            >
              <MainTable.ActionItem.IconWrapper>
                <MainTable.ActionItem.DeleteIcon />
              </MainTable.ActionItem.IconWrapper>
            </Popconfirm>
          </div>
        </Table.Item>
        <UpdateMentorsModal
          isMentorStatusUpdating={this.props.isMentorStatusUpdating}
          hasMentorStatusUpdated={this.props.hasMentorStatusUpdated}
          visible={this.state.isMentorModalVisible}
          title={this.state.mentorEditingName}
          mentorDefaultStatus={status}
          mentorDefaultIsActive={isMentorActive}
          mentorId={this.state.mentorEditingId}
          closeMentorModal={this.closeMentorModal}
        />
      </MainTable.Row >
    )
  }
}

SalesExecMentorTableRow.propTypes = {
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isMentorActive: PropTypes.bool.isRequired
}

export default SalesExecMentorTableRow
