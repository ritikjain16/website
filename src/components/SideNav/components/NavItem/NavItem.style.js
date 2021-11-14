/* eslint no-unused-expressions: 0 */
import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import { rgba } from 'polished'
import { Icon, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import colors from '../../../../constants/colors'

/** Modifies antd tooltip */
injectGlobal`
  /*
   * navitem-tooltip-overlay is container class of antd tooltip
   * So that it doesn't affect changing tooltip style does not
   * changes it globally
   */
  .navitem-tooltip-overlay {
    /** ant-tooltip-arrow is small little pointer of antd tooltip */
    .ant-tooltip-arrow {
      border-right-color: ${colors.toolTipBG};
    }
    /** ant-tooltip-inner is class of dom node
      * responsible of rendering tooltip title of antd tooltip
      */
    .ant-tooltip-inner {
      background: ${colors.toolTipBG};
      display: flex;
    }
  }
`

/*
 * Filters out isActive prop from passing to Icon because antd passes
 * down all props, it doesn't recognize to dom, which emits warning
 * */
const StyledIcon = styled(({ isActive, ...rest }) => <Icon {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: 28px;
  color: ${props => props.isActive ? 'white' : rgba('white', 0.7)}
`

const Item = styled(({ isActive, ...rest }) => <Link {...rest} />)`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 56px;
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  &&& {
    text-decoration: none;
  }
  &:hover ${StyledIcon}, &:focus ${StyledIcon} {
    color: white;
    text-decoration: none;
  };
  background: ${props => props.isActive && colors.sideNavItemActiveBG}
`

const ParentItem = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 56px;
  transition: 0.3s all ease-in-out;
  cursor: pointer;
`

Item.Icon = StyledIcon
Item.Tooltip = Tooltip
Item.ParentItem = ParentItem
export default Item
