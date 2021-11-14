import React from 'react'
import { Button, Tooltip, notification } from 'antd'
import { get } from 'lodash'
import USER_SAVED_CODE_STATUS from '../../../../constants/userSavedCodeStatus'
import CodeApprovalStyle from '../../CodeApproval.style'
import colors from '../../../../constants/colors'
import getDataFromLocalStorage from '../../../../utils/extract-from-localStorage'
import MainTable from '../../../../components/MainTable'
import updateUserApprovedCode from '../../../../actions/userApprovedCodes/updateUserApprovedCodes'
import updateUserSavedCode from '../../../../actions/userSavedCodes/updateUserSavedCode'
import { MENTOR } from '../../../../constants/roles'

class TableActions extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.userSavedCodeStatus && get(this.props, 'userSavedCodeStatus.success', false)
       !== get(prevProps, 'userSavedCodeStatus.success', false)) {
      notification.success({
        key: 'Code Approval Status',
        message: 'SavedCode Updated Successfully'
      })
    }
    if (this.props.userApprovedCodeStatus && get(this.props, 'userApprovedCodeStatus.success', false)
       !== get(prevProps, 'userApprovedCodeStatus.success', false)) {
      notification.success({
        key: 'Code Approval Status',
        message: 'Approved Code Updated Successfully'
      })
    }
  }

  publishUserSavedCode = () => {
    const { userApprovedCode } = this.props
    const input = {
      status: 'published'
    }
    if (userApprovedCode.status === 'published') {
      input.status = 'unpublished'
    }
    updateUserApprovedCode(userApprovedCode.id, input).then(() => {
      this.props.searchByFilter(true)
    })
  }

  requestToPublishCode = async () => {
    const { userSavedCode } = this.props
    const input = {
      hasRequestedByMentor: !get(userSavedCode, 'hasRequestedByMentor')
    }
    await updateUserSavedCode(get(userSavedCode, 'id'), input)
  }

  getUserSavedCodePublishedStatus = () => {
    const { userApprovedCode } = this.props
    if (userApprovedCode && get(userApprovedCode, 'status') === 'published') {
      return true
    }
    return false
  }

  getStatusColor = () => this.getUserSavedCodePublishedStatus() ? '#16d877' : '#d4d4d4'

  getTooltipTitleBasedOnStatus = () => {
    const { userSavedCode, isApprovedForDisplay } = this.props
    if (this.getUserSavedCodePublishedStatus()) {
      return 'Code Published'
    }
    if (isApprovedForDisplay !== USER_SAVED_CODE_STATUS.ACCEPTED) {
      return 'Need to Approve Code First!'
    }
    if (get(userSavedCode, 'hasRequestedByMentor', false)) {
      return 'Revoke Request'
    }
    return 'Request to publish'
  }

  render() {
    const isMentorLoggedIn = getDataFromLocalStorage('login.role') === MENTOR
    const { isApprovedForDisplay, userSavedCodeId, userSavedCode } = this.props
    const { hasRequestedByMentor } = userSavedCode
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          padding: '8px 0',
        }}
      >
        <MainTable.ActionItem.IconWrapper>
          <Button type='link'
            onClick={() => { this.props.openEditModal(userSavedCode) }}
          >
            <MainTable.ActionItem.EyeIcon
              style={{
                color: colors.status.unpublished,
                paddingRight: '0px'
              }}
            />
          </Button>
        </MainTable.ActionItem.IconWrapper>
        <CodeApprovalStyle.StyledDivider type='vertical' />
        <MainTable.ActionItem.IconWrapper>
          <Button
            onClick={() => {
              this.props.history.push(`/ums/approvedCode/${userSavedCodeId}`,
                {
                  filterQuery: this.props.filterQuery
              })
            }}
            type='link'
            disabled={isApprovedForDisplay !== USER_SAVED_CODE_STATUS.ACCEPTED}
          >
            <MainTable.ActionItem.EditIcon
              style={{ color: `${isApprovedForDisplay === USER_SAVED_CODE_STATUS.ACCEPTED ? colors.table.editIcon : '#d4d4d4'}` }}
            />
          </Button>
        </MainTable.ActionItem.IconWrapper>
        <CodeApprovalStyle.StyledDivider type='vertical' />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: `${this.getStatusColor()}`,
            margin: `${this.getUserSavedCodePublishedStatus() ? '0px 10px' : '0px'}`
          }}
        >
          <CodeApprovalStyle.StatusIcon
            color={this.getStatusColor()}
          />
          {this.getUserSavedCodePublishedStatus() ? 'Published' : 'Unpublished'}
        </div>
        <CodeApprovalStyle.StyledDivider type='vertical' />
        {!isMentorLoggedIn ? (
          <MainTable.ActionItem.IconWrapper>
            <Button type='link'
              onClick={this.publishUserSavedCode}
              disabled={isApprovedForDisplay !== USER_SAVED_CODE_STATUS.ACCEPTED}
            >
              {!this.getUserSavedCodePublishedStatus() ? (
                <MainTable.ActionItem.PublishIcon
                  style={{ color: `${isApprovedForDisplay === USER_SAVED_CODE_STATUS.ACCEPTED ? '#16d877' : '#d4d4d4'}` }}
                />
              ) : (
                <Tooltip title='Unpublish Code' placement='top'>
                  <MainTable.ActionItem.UnpublishIcon />
                </Tooltip>
              )}
            </Button>
          </MainTable.ActionItem.IconWrapper>
        ) : (
          <MainTable.ActionItem.IconWrapper>
            <Tooltip title={this.getTooltipTitleBasedOnStatus()} placement='top'>
              <Button type='link'
                onClick={this.requestToPublishCode}
                disabled={this.getUserSavedCodePublishedStatus() ||
                  (isApprovedForDisplay !== USER_SAVED_CODE_STATUS.ACCEPTED)}
              >
                {!hasRequestedByMentor ? (
                  <MainTable.ActionItem.PublishIcon
                    style={{
                      color: `${isApprovedForDisplay === USER_SAVED_CODE_STATUS.ACCEPTED &&
                        !this.getUserSavedCodePublishedStatus() ?
                        '#16d877' : '#d4d4d4'}`
                    }}
                  />
                  ) : (
                    <MainTable.ActionItem.UnpublishIcon />
                  )}
              </Button>
            </Tooltip>
          </MainTable.ActionItem.IconWrapper>
        )}
      </div>
    )
  }
}

export default TableActions
