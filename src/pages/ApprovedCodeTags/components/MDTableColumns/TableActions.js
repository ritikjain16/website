import React from 'react'
import { Tooltip, Popconfirm, notification } from 'antd'
import { get } from 'lodash'
import ApprovedCodeTagsStyle from '../../ApprovedCodeTags.style'
import colors from '../../../../constants/colors'
import MainTable from '../../../../components/MainTable'
import deleteUserApprovedCodeTag from '../../../../actions/userApprovedCodeTags/deleteUserApprovedCodeTag'
import updateUserApprovedCodeTag from '../../../../actions/userApprovedCodeTags/updateUserApprovedCodeTag'
import { updateContentTag, deleteContentTag } from '../../../../actions/contentTags'

class TableActions extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.tagType === 'Approved Tags') {
      if (this.props.TagsDeleteStatus && this.props.TagsDeleteStatus
        !== prevProps.TagsDeleteStatus) {
        const message = get(get(this.props.TagsDeleteFailure[0], 'error').errors[0], 'message').split(':')[0]
        notification.close('Approved Code Tag Delete')
        notification.error({
          key: 'Approved Code Tag Delete',
          message
        })
      }
    } else if (this.props.tagType === 'Content Tags') {
      if (this.props.contentTagsDeleteStatus && this.props.contentTagsDeleteStatus
        !== prevProps.contentTagsDeleteStatus) {
        const message = get(get(this.props.contentTagsDeleteFailure[0], 'error').errors[0], 'message').split(':')[0]
        notification.close('Approved Code Tag Delete')
        notification.error({
          key: 'Approved Code Tag Delete',
          message
        })
      }
    }
  }

  updateUserApprovedCodeTag = () => {
    const { userApprovedCodeTags, contentTags, tagType } = this.props
    const input = {
      status: 'published'
    }
    if (this.getTagStatus()) {
      input.status = 'unpublished'
    }
    if (tagType === 'Approved Tags') {
      updateUserApprovedCodeTag(userApprovedCodeTags.id, input)
    } else {
      updateContentTag(contentTags.id, input)
    }
  }

  deleteUserApprovedTag = () => {
    const { userApprovedCodeTags, contentTags, tagType } = this.props
    if (tagType === 'Approved Tags') {
      deleteUserApprovedCodeTag(userApprovedCodeTags.id)
    } else {
      deleteContentTag(contentTags.id)
    }
  }

  getTagStatus = () => {
    const { userApprovedCodeTags, contentTags, tagType } = this.props
    if (tagType === 'Approved Tags') {
      if (get(userApprovedCodeTags, 'status') === 'published') {
        return true
      }
      return false
    } else if (tagType === 'Content Tags') {
      if (get(contentTags, 'status') === 'published') {
        return true
      }
      return false
    }
  }

  getStatusColor = () => this.getTagStatus() ? '#16d877' : '#d4d4d4'

  render() {
    const { userApprovedCodeTags, contentTags, tagType } = this.props
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          padding: '8px 0',
        }}
      >
        <MainTable.ActionItem.IconWrapper
          onClick={() => tagType === 'Approved Tags' ?
            this.props.setUpdateTags(userApprovedCodeTags) : this.props.setUpdateTags(contentTags)}
        >
          <MainTable.ActionItem.EditIcon
            style={{ color: `${colors.table.editIcon}` }}
          />
        </MainTable.ActionItem.IconWrapper>
        <ApprovedCodeTagsStyle.StyledDivider type='vertical' />
        <MainTable.ActionItem.IconWrapper onClick={this.updateUserApprovedCodeTag}>
          {this.getTagStatus() ? (
            <Tooltip title='Unpublish Tag' placement='top'>
              <MainTable.ActionItem.UnpublishIcon />
            </Tooltip>
            ) : (
              <MainTable.ActionItem.PublishIcon
                style={{ color: '#16d877' }}
              />
            )}
        </MainTable.ActionItem.IconWrapper>
        <ApprovedCodeTagsStyle.StyledDivider type='vertical' />
        <Popconfirm
          onConfirm={() => {
                this.deleteUserApprovedTag()
              }}
          title='Do you want to delete this tag?'
          placement='top'
        >
          <MainTable.ActionItem.IconWrapper>
            <MainTable.ActionItem.DeleteIcon />
          </MainTable.ActionItem.IconWrapper>
        </Popconfirm>
      </div>
    )
  }
}

export default TableActions
