/* eslint no-unused-expressions: 0 */
import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import { Icon } from 'antd'
import resetButtonStyle from '../../utils/mixins/resetButtonStyle'
import colors from '../../constants/colors'
import { Table } from '../StyledComponents'
import antdButtonColor from '../../utils/mixins/antdButtonColor'

injectGlobal`
  .popconfirm-overlay-primary {
    .ant-btn.ant-btn-primary {
      ${antdButtonColor(colors.subThemeColor)}
    }
  }
`

const Row = styled(Table.Row)`
  opacity: ${props => props.isDeleting ? 0.4 : 1};
  background: ${props => props.background || (props.isHovering ? colors.video.background : '')};
  width: ${props => props.isLarge ? '250%' : '100%'};
  background-color: ${props => props.backgroundColor ? props.backgroundColor : '#fff'} !important;
  height: ${props => props.height ? props.height : '48px'};
`

const Title = styled.div`
  font-size: 12px;
  color: #1d2b37;
  font-weight: bold;
  text-align: center;
`
const Item = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'center'};
  align-items: center;
  font-size: ${props => !(props.isInlineItem) ? '12px' : '14px'};
  color: ${props => !(props.isLinkedItem) ? '#757575' : '#0000EE'};
  padding: ${props => !(props.isInlineItem) ? '0 10px' : '0 2px'};
  height: ${props => !(props.isHeightAuto) ? '48px' : 'auto'};
  text-align: center;
  flex-wrap: wrap;
  word-break: break-word;
  position: ${props => props.position ? props.position : 'static'} !important;
  &:hover {
      cursor: ${props => props.isLinkedItem ? 'pointer' : ''};
  }
  overflow-y: ${props => props.overFlowY ? 'auto' : 'hidden'};
`
const ItemBox = styled.div`
  display: flex;
  align-items: center;
  margin: ${props => props.isLeft ? '0 70px 0 0' : '0 0 0 70px'};
  font-size: '12px';
  padding: 3px 0 0 22px;
  background-color: ${props => props.isLeft ? '#bbf4b9' : '#b2e1fd'};
  color: #ffffff;
  width: 60px;
  height: 23px;
  border-radius: ${props => props.isLeft ? '0 5px 5px 0' : '5px 0 0 5px'};
`

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: 1px ${props => !props.showRed ? 'rgba(158,247,114,1)' : '#f9c1c1'} solid;
  border-radius: 4px;
  margin-left: 6px;
  margin-top: 3px;
  margin-bottom: 3px;
  color: ${props => props.showDisabledFontColor ? 'rgba(136, 85, 85, 0.5)' : 'rgba(136, 85, 85, 0.8)'};
  font-weight: 600;
  background-color: ${props => !props.showRed ? props.backgroundColor : '#f9c1c1'};
  &: hover {
    cursor: ${props => !props.disabled ? 'pointer' : 'not-allowed'};
    font-size: ${props => props.disabled ? '12px' : '13px'};
    padding: ${props => props.disabled ? '8px' : '8px 6px 7px 6px'};
    color: ${props => props.showDisabledFontColor ? 'rgba(136, 85, 85, 0.5)' : 'rgba(136, 85, 85, 0.7)'};
  }
`

const DateItem = Item.extend`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 0px;
  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
  }
`
const Status = styled.div`
  width: ${props => !(props.isInlineItem) ? '12px' : '8px'};
  height: ${props => !(props.isInlineItem) ? '12px' : '8px'};
  background: ${props => colors.status[props.status]};
  margin: ${props => !(props.isInlineItem) ? '0' : '0 3px'};
  border-radius: 50%;
`
const ActionItem = Item.extend`
   display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 0px;
    & > div {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: 100%;
    }
`
const ActionsLineSeperator = styled.div`
  max-width: 1px;
  max-height: 36px;
  background: #bdbdbd;
`
const ActionsIconWrapper = styled.button`
  ${resetButtonStyle};
  cursor: pointer;
  i {
    opacity: 1;
  }
  &:hover i, &:focus i {
    opacity: 0.6;
  }
`
const ActionsEyeIcon = styled(props => <Icon {...props} type='eye' />)`
  font-size: 21px;
  color:orange;
`
const ActionsEditIcon = styled(props => <Icon {...props} type='edit' />)`
  font-size: ${props => props.size ? props.size : '21px'};
  color: ${colors.table.editIcon};
`
const ActionsDeleteIcon = styled(props => <Icon {...props} type='delete' />)`
  font-size: 21px;
  color: ${colors.table.deleteIcon}}
`
const ActionsPublishIcon = styled(props => <Icon {...props} type='upload' />)`
  font-size: 21px;
  color: ${colors.status.published}}
`
const ActionsUnpublishIcon = styled(props => <Icon {...props} type='minus-square-o' />)`
  font-size: 21px;
  color: ${colors.status.unpublished}}
`
const EmptyTable = styled.div`
  width: 100%;
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`
const TitleBlock = styled.div`
  z-index: 1;
  background: #f5f5f5;
  padding: 13px 20px;
  font-size: 14px;
  border-bottom: 1px solid #bdbdbd;
  color: #757575;
  width: 100%;
  min-width: ${props => props.minWidth};
  position: sticky;
  top: 0;
`
const ArrowIcon = styled(Icon)`
  margin-right: 12px;
  margin-left: 12px;
`

const MiddleItem = styled(Item)`
  position: absolute !important;
  left: 50%;
`

const MainTable = styled.div``

MainTable.Row = Row
MainTable.Status = Status
MainTable.Title = Title
MainTable.Item = Item
MainTable.DateItem = DateItem
MainTable.ActionItem = ActionItem
MainTable.ActionItem.Line = ActionsLineSeperator
MainTable.ActionItem.IconWrapper = ActionsIconWrapper
MainTable.ActionItem.EyeIcon = ActionsEyeIcon
MainTable.ActionItem.EditIcon = ActionsEditIcon
MainTable.ActionItem.DeleteIcon = ActionsDeleteIcon
MainTable.ActionItem.PublishIcon = ActionsPublishIcon
MainTable.ActionItem.UnpublishIcon = ActionsUnpublishIcon
MainTable.EmptyTable = EmptyTable
MainTable.TitleBlock = TitleBlock
MainTable.ArrowIcon = ArrowIcon
MainTable.ItemBox = ItemBox
MainTable.ItemContainer = ItemContainer
MainTable.MiddleItem = MiddleItem

export default MainTable
