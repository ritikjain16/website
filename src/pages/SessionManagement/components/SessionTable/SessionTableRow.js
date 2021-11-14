import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Popconfirm } from 'antd'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'
import formatDate from '../../../../utils/formatDate'
import deleteSession from '../../../../actions/sessions/deleteSession'
import isUserWrite from '../../../../utils/userRolePermissions/isUserWrite'
import getSlotLabel from '../../../../utils/slots/slot-label'

class SessionTableRow extends Component {
  openEditSession = (id) => {
    const { openEditSession } = this.props
    openEditSession(id)
  }

  getSlotStatusArray = () => {
    const slotStatusArray = []
    for (let i = 0; i < 24; i += 1) {
      const slotNumber = `slot${i}`
      slotStatusArray.push(this.props[slotNumber])
    }
    return slotStatusArray
  }

  getUserName = (id) => {
    const { users } = this.props
    let userName = ''
    for (let i = 0; i < users.length; i += 1) {
      const user = users[i]
      if (id === user.id) {
        const { name, username } = user
        userName = name || username
      }
    }

    return userName
  }

  deleteSession = (id) => {
    deleteSession(id)
  }

  renderBookedSlotLabels = () => {
    const slotStatusArray = this.getSlotStatusArray()
    return slotStatusArray.map((status, index) => {
      if (status) {
        return (
          <div
            style={{
              width: '54px',
              height: '25px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: 'rgba(0, 0, 0, 0.17) solid 1px'
            }}
          >
            {getSlotLabel(index).startTime}
          </div>
        )
      }

      return <div />
    })
  }

  render() {
    const { id, order, user, createdAt, updatedAt, bgColor } = this.props
    return (
      <MainTable.Row
        columnsTemplate={this.props.columnsTemplate}
        noBorder={this.props.noBorder}
        minWidth={this.props.minWidth}
        backgroundColor={bgColor}
        height='auto'
      >
        <Table.Item backgroundColor={bgColor}><MainTable.Item>{order}</MainTable.Item></Table.Item>
        <Table.Item backgroundColor={bgColor}>
          <MainTable.Item>
            {
            this.getUserName(user && user.id)
            }
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={bgColor}>
          <MainTable.Item isHeightAuto>
            {<div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: '8px 0 8px 0' }}>{this.renderBookedSlotLabels()}</div>}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={bgColor}>
          <MainTable.Item>
            {`${formatDate(createdAt).date} ${formatDate(updatedAt).time}`}
          </MainTable.Item>
        </Table.Item>
        <Table.Item backgroundColor={bgColor}>
          <MainTable.Item>
            {`${formatDate(updatedAt).date} ${formatDate(updatedAt).time}`}
          </MainTable.Item>
        </Table.Item>
        {isUserWrite() &&
        <Table.Item backgroundColor={bgColor}>
          <MainTable.ActionItem.IconWrapper>
            <MainTable.ActionItem.EditIcon onClick={() => this.openEditSession(id)} />
          </MainTable.ActionItem.IconWrapper>
          <div
            style={{
                width: '10px'
              }}
          />
          <div>
            <Popconfirm
              title='Do you want to delete this session?'
              placement='topRight'
              onConfirm={() => this.deleteSession(id)}
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
        </Table.Item>}
      </MainTable.Row>
    )
  }
}

SessionTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  availabilityDate: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  users: PropTypes.shape([]),
  user: PropTypes.shape({}).isRequired,
  slot: PropTypes.string.isRequired,
  openSessionTimeModal: PropTypes.func.isRequired,
  openEditSession: PropTypes.func.isRequired
}

SessionTableRow.defaultProps = {
  users: []
}

export default SessionTableRow
