import { Button, message, Popconfirm, Tooltip } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import deleteBanner from '../../../actions/banner/deleteBanner'
import updateBanner from '../../../actions/banner/updateStatus'
import MainTable from '../../../components/MainTable'
import colors from '../../../constants/colors'
import BannerStyle from '../Banner.style'

class Action extends React.Component {
  updateStatus = async () => {
    const { bannerId, status } = this.props
    let input = {
      status: 'unpublished'
    }
    if (status === 'unpublished') {
      input = {
        status: 'published',
      }
    }
    const hideLoadingMessage = message.loading('Updating Banner...', 0)
    const updateData = await updateBanner(bannerId, input)
    if (updateData.updateBanner && updateData.updateBanner.id) {
      hideLoadingMessage()
      message.success(`Banner ${updateData.updateBanner.title} updated successfully`)
      this.props.searchByFilter()
    } else {
      hideLoadingMessage()
    }
  }
  deleteBannerData = async (id) => {
    const hideLoadingMessage = message.loading('Deleting Banner...', 0)
    const data = await deleteBanner(id)
    if (data.deleteBanner && data.deleteBanner.id) {
      hideLoadingMessage()
      message.success('Banner deleted successfully')
    } else {
      hideLoadingMessage()
    }
  }
  checkStatus = () => {
    const { status } = this.props
    return status === 'published'
  }
  getStatusColor = () => this.checkStatus() ? '#16d877' : '#d4d4d4'
  render() {
    const { bannerId, status } = this.props
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <MainTable.ActionItem.IconWrapper>
          <Button type='link' disabled={!bannerId}>
            <Link to={`/ums/banner/${bannerId}`}>
              <MainTable.ActionItem.EditIcon
                style={{ color: colors.table.editIcon }}
              />
            </Link>
          </Button>
        </MainTable.ActionItem.IconWrapper>
        <BannerStyle.StyledDivider type='vertical' />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: `${this.getStatusColor()}`,
          }}
        >
          <BannerStyle.StatusIcon
            color={this.getStatusColor()}
          />{status}
        </div>
        <BannerStyle.StyledDivider type='vertical' />
        <Popconfirm
          title={`Do you want to ${this.checkStatus() ? 'Unpublish' : 'Publish'} ?`}
          placement='topRight'
          onConfirm={this.updateStatus}
          okText='Yes'
          cancelText='Cancel'
          key='update'
          overlayClassName='popconfirm-overlay-primary'
        >
          <MainTable.ActionItem.IconWrapper>
            {this.checkStatus() ? (
              <Tooltip title='unPublish' placement='top'>
                <MainTable.ActionItem.PublishIcon
                  style={{ color: this.getStatusColor() }}
                />
              </Tooltip>
            ) : (
              <MainTable.ActionItem.PublishIcon
                style={{ color: this.getStatusColor() }}
              />
            )}
          </MainTable.ActionItem.IconWrapper>
        </Popconfirm>
        <BannerStyle.StyledDivider type='vertical' />
        <Popconfirm
          title='Do you want to delete this banner ?'
          placement='topRight'
          onConfirm={() => this.deleteBannerData(this.props.bannerId)}
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
    )
  }
}

export default Action
