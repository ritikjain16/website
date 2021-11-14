/* eslint no-unused-expressions: 0 */
import React from 'react'
import styled from 'styled-components'
import { rgba } from 'polished'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'

import './custom.scss'
// import colors from '../../../../../constants/colors'

/*
 * Filters out isActive prop from passing to Icon because antd passes
 * down all props, it doesn't recognize to dom, which emits warning
 * */
const StyledIcon = styled(({ isActive, ...rest }) => <Icon {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: 30px;
  color: ${props => props.isActive ? '#D34B57' : rgba('white', 0.7)};
  fill: ${props => props.isActive ? '#8C61CB' : '#333333'};
  margin-right: 12px;

  & > svg {
    width: .6em;
  }
`

const Item = styled(({ isActive, ...rest }) => <Link {...rest} />)`
  display: flex;
  position: relative;
  justify-content: flex-start;
  font-weight: 500;
  font-size: 16px;
  align-items: center;
  width: 100%;
  height: 40px;
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  padding: 0px 12px;
  margin: 8px 0px;
  border-radius: 10px;
  letter-spacing: 0px;
  position: relative
  &&& {
    text-decoration: none;
  }
  &:hover, &:focus {
    color: #8C61CB;
    transform: scale(1.02);
    background: #FAF7FF;
    text-decoration: none;
    filter: ${props => props.comingSoon ? 'blur(2px)' : ''};
    :after {
      content: ${props => props.comingSoon ? 'Coming Soon' : ''};
      position: absolute;
      z-index: 1;
    }
  };
  &:active {
    transform: scale(.95);
  };
  &:hover ${StyledIcon}, &:focus ${StyledIcon} {
    color: white;
    fill: #8C61CB;
    text-decoration: none;
  };
  color: ${props => props.isActive ? '#8C61CB' : '#333333'};
  background: ${props => props.isActive ? '#FAF7FF' : ''};

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
Item.ParentItem = ParentItem
Item.ParentItem = ParentItem
export default Item
