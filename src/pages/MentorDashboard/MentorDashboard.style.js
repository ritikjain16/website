import React from 'react'
import styled from 'styled-components'
import { Icon } from 'antd'
import { TekieAmethyst } from '../../constants/colors'

const MentorDashboardStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
    font-family: 'Inter' !important;
`

const StyledIcon = styled(({ isActive, ...rest }) => <Icon {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: ${props => props.fontSize ? props.fontSize : '26px'};
  fill: ${props => props.fillSvg ? props.fillSvg : '#666666'};
  margin-right: ${props => props.marginRight ? props.marginRight : '8px'};
`

const AddSessionButton = styled.button`
    z-index: 99;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 42px;
    padding: 12px 14px;
    background: ${TekieAmethyst};
    border-radius: 100%;
    cursor: pointer;
    box-shadow: 0px 2px 8px rgba(113, 62, 188, 0.24);
    transition: 0.2s all ease-in-out;
    border: none;
    
    @media screen and (max-width: 500px) {
        margin: 18px;
    }
    &:focus {
        box-shadow: 0px 2px 8px rgba(140, 97, 203, 0.4);
    }
    &:hover, &:focus {
        background: #713EBC;
        transform: scale(1.01);
        box-shadow: 0px 2px 8px rgba(113, 62, 188, 0.5);
    }
    &:active {
        transform: scale(.92);
    }
`

MentorDashboardStyle.Icon = StyledIcon
MentorDashboardStyle.AddSessionButton = AddSessionButton

export default MentorDashboardStyle
