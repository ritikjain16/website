import React, { Component } from 'react'
import { Popconfirm, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import MainTable from '../../../../components/MainTable'
import formatDate from '../../../../utils/formatDate'
import deleteAssignment from '../../../../actions/assignment/deleteAssignment'
import updateAssignment from '../../../../actions/assignment/updateAssignment'

class AssignmentTableRow extends Component {
  openEdit = (id) => {
    this.props.openEditModal(id)
  }

  onDelete = async (id) => {
    await deleteAssignment(id)
  }

  unPublish = (id) => {
    const input = {
      status: 'unpublished'
    }
    updateAssignment(input, id)
  }

  publish = (id) => {
    const input = {
      status: 'published'
    }
    updateAssignment(input, id)
  }

  render() {
    const { id, order, statement, difficulty, createdAt, updatedAt, status } = this.props
    const isPublished = status === 'published'
    return (
      <Table.Row
        columnsTemplate={this.props.columnsTemplate}
        noBorder={this.props.noBorder}
        minWidth={this.props.minWidth}
        isVideoLOMapping
      >
        <Table.Item><MainTable.Item>{order}</MainTable.Item></Table.Item>
        <Table.Item>
          <MainTable.Item
            isHeightAuto
          >{statement}
          </MainTable.Item>
        </Table.Item>
        <Table.Item><MainTable.Item>{difficulty}</MainTable.Item></Table.Item>
        <Table.Item>
          <MainTable.Item>{`${formatDate(createdAt).date} ${formatDate(createdAt).time}`}</MainTable.Item>
        </Table.Item>
        <Table.Item>
          <MainTable.Item>{`${formatDate(updatedAt).date} ${formatDate(updatedAt).time}`}</MainTable.Item>
        </Table.Item>
        <Table.Item>
          <Tooltip title={status} placement='left'>
            <MainTable.Status status={status} />
          </Tooltip>
        </Table.Item>
        <Table.Item>
          <MainTable.ActionItem.IconWrapper>
            <MainTable.ActionItem.EditIcon onClick={() => this.openEdit(id)} />
          </MainTable.ActionItem.IconWrapper>
          <div
            style={{
                width: '10px'
              }}
          />
          <div>
            <Popconfirm
              title='Do you want to delete this assignment?'
              placement='topRight'
              onConfirm={() => this.onDelete(id)}
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
          <div
            style={{
                width: '10px'
              }}
          />
          <div>
            {isPublished
                ? (
                  <Popconfirm
                    title='Do you want to unpublish this assignment ?'
                    placement='topRight'
                    onConfirm={() => this.unPublish(id)}
                    okText='Yes'
                    cancelText='Cancel'
                    key='unpublish'
                    overlayClassName='popconfirm-overlay-primary'
                  >
                    <MainTable.ActionItem.IconWrapper>
                      <MainTable.ActionItem.UnpublishIcon />
                    </MainTable.ActionItem.IconWrapper>
                  </Popconfirm>
                )
                : (
                  <Popconfirm
                    title='Do you want to publish this assignment ?'
                    placement='topRight'
                    onConfirm={() => this.publish(id)}
                    okText='Yes'
                    cancelText='Cancel'
                    key='publish'
                    overlayClassName='popconfirm-overlay-primary'
                  >
                    <MainTable.ActionItem.IconWrapper>
                      <MainTable.ActionItem.PublishIcon />
                    </MainTable.ActionItem.IconWrapper>
                  </Popconfirm>
                )
            }
          </div>
        </Table.Item>
      </Table.Row>
    )
  }
}

AssignmentTableRow.propTypes = {
  noBorder: PropTypes.bool.isRequired,
  minWidth: PropTypes.string.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  statement: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  difficulty: PropTypes.number.isRequired,
  createdAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  assignment: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  openEditModal: PropTypes.func.isRequired,
  notification: PropTypes.shape({}).isRequired
}

export default AssignmentTableRow
