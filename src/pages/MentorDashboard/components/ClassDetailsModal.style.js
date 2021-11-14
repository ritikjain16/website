import React from 'react'
import styled from 'styled-components'
import { Icon, Divider } from 'antd'
import { TekieAmethyst, TekieOrange } from '../../../constants/colors'
import { CloseSVG } from '../../../constants/icons'
import getFullPath from '../../../utils/getFullPath'

const MentorDashboardStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
    font-family: 'Inter' !important;
`
const FlexContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`
const StyledIcon = styled(({ isActive, ...rest }) => <Icon {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: ${props => props.fontSize ? props.fontSize : '26px'};
  fill: ${props => props.fillSvg ? props.fillSvg : '#666666'};
  margin-right: ${props => props.marginRight ? props.marginRight : '8px'};
`
const CloseIcon = styled(({ isActive, ...rest }) => <Icon component={CloseSVG} {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: ${props => props.fontSize ? props.fontSize : '26px'};
  fill: #666666;
  margin-right: 8px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px 14px;
  cursor: pointer;
`
const Modal = styled.div`
    font-family: 'Inter' ;
    z-index: 999;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // background: rgba(0,0,0,0.4);
`
const ModalBox = styled.div`
    z-index: 9999;
    width: 520px;
    position: absolute;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #FFFFFF;
    box-shadow: 0px 6px 48px rgba(51, 51, 51, 0.24);
    border-radius: 16px;
    transition: opacity 200ms ease-in-out, left 300ms ease-in-out, visibility .2s cubic-bezier(0.4,0.0,0.2,1);
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
    opacity: ${props => props.visible ? 1 : 0};
    left: ${props => props.visible ? '50%' : '51%'};
    overflow: hidden;
    box-sizing: border-box;
    font-family: 'Inter' !important;

    @media screen and (max-width: 500px) {
        min-width: 100%;
        height: 100%;
        width: 100%;
    }
`
const Header = styled.div`
    width: auto;
    background: ${props => props.bgColor ? props.bgColor : '#FFF7E5'};
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 12px 20px;
`
const HeaderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 45px;
    background: ${props => props.bgColor ? props.bgColor : '#fff'};
    border-radius: ${props => props.borderRadius ? props.borderRadius : '10px'};
    position: absolute;
    top: -1px;
    left: 0;
`
const HeaderSessionIndicator = styled.div`
    font-family: 'Inter';
    background: ${props => props.bgColor ? props.bgColor : TekieOrange};
    position: relative;
    width: 20px;
    height: 20px;
    border-radius: 6px;
    color: white;
    font-size: 10px;
    font-weight: 600;
    display: flex;
    text-transform: Uppercase;
    justify-content: center;
    align-items: flex-end;
    padding-bottom: 2px;
`
const HeaderTag = styled.div`
    font-family: 'Inter';
    font-weight: normal;
    font-size: 9px;
    color: #FFFFFF;
    width: 50px;
    background: ${props => props.bgColor || '#1B7275'};
    border-radius: 6px;
    padding: 4px;
    text-align: center;
    text-transform: uppercase;
`
const PreHeaderText = styled.div`
    font-family: 'Inter';
    text-transform: Uppercase;
    font-weight: 550;
    font-size: 16px;
    color: #111111;
    margin: 0px 14px;
`
const HeaderDetailsContainer = styled.div`
    padding: 14px 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    font-family: Inter;
`
const HeaderDetails = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-family: Inter;
    padding: 6px 12px;
`
const HeaderCourse = styled.div`
    font-family: 'Inter';
    font-weight: 500;
    font-size: 12px;
    line-height: 1;
    text-transform: uppercase;
    color: ${TekieAmethyst};
`
const TopicThumbnail = styled.div`
    background-image: url("${props => getFullPath(props.bgImage) || null}");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 100px;
    height: 100px;
    background-color: #FFFFFF;
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
    border-radius: 16px;
`
const HeaderTitle = styled.div`
    font-weight: 550;
    font-size: 16px;
    color: #13343F;
    margin-top: 10px;
    line-height: 1;
`
const HeaderDescription = styled.div`
    display: inline-flex;
    align-items: center;
    font-weight: 550;
    font-size: 12px;
    padding: 16px 0px 2px 0px;
    color: #666666;
    letter-spacing: 0px;
    line-height: 1;
`

const RescheduleTag = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
    background: #666666;
    font-weight: 450;
    user-select: none;
    font-size: 11px;
    padding: 6px 10px;
    color: #FFF;
    letter-spacing: 0px;
    line-height: 1;
    border-radius: 6px;
    margin-top: 12px;
`

const HeaderTimestamp = styled.div`
    font-weight: normal;
    font-size: 10px;
    padding: 4px 0px 0px 18px;
    color: #AAAAAA;
`
const Text = styled.div`
    font-weight: 550;
    font-size: 14px;
    color: #333333;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const ContentText = styled.div`
    font-weight: 500;
    font-size: ${props => props.fontSize || '14px'};
    color: #666666;

    @media screen and (max-width: 500px) {
        flex: 1 1 100%;
    }
`
const FlexRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: ${props => props.justifyContent || 'flex-start'};
    align-items: ${props => props.alignItems || 'center'};
    margin-top: 12px;
    flex-wrap: wrap;
`
const Content = styled.div`
`
const ContentClassDetail = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 12px 0px;

    & .classDetailsText {
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        white-space: no-wrap;
        padding: 0px 0px 0px 12px;
        flex: 0 1 20%;
    }

    @media screen and (max-width: 500px) {
        .classDetailsText {
            flex: 0 1 30%;
        }
    }
`
const Footer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: 14px 18px;
    background-color: #F9F9F9;
    box-shadow: 0px 0px 4px rgba(51, 51, 51, 0.15);

    @media screen and (max-width: 500px) {
        position: fixed;
        bottom: 0px;
        padding-bottom: 30px;
    }
`
const FooterText = styled.div`
    font-weight: 500;
    font-size: 16px;
    color: #333333;
`
const AddSessionButton = styled.button`
    z-index: 999;
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
    
    @media screen and (max-width: 500px){
        margin: 10px 12px;
    }
    &:hover {
        transform: scale(1.01);
        box-shadow: 0px 2px 8px rgba(113, 62, 188, 0.5);
    }
    &:active {
        transform: scale(.92);
    }
`
const FooterButton = styled.button`
    font-family: 'Inter';
    border: none;
    padding: 8px 14px;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    background: ${TekieAmethyst};
    border-radius: 8px;
    cursor: pointer;
`
const FooterSecondaryButton = styled.button`
    font-family: 'Inter';
    border: none;
    padding: 8px 14px;
    font-weight: 500;
    font-size: 14px;
    color: ${TekieAmethyst};
    background: #FAF6FF;
    border-radius: 8px;
    cursor: pointer;
`
const CustomDivider = styled(Divider)`
    &.ant-divider-horizontal {
        margin: 0px
    }
`

MentorDashboardStyle.Icon = StyledIcon
MentorDashboardStyle.Divider = CustomDivider
MentorDashboardStyle.HeaderTag = HeaderTag
MentorDashboardStyle.AddSessionButton = AddSessionButton
MentorDashboardStyle.HeaderSessionIndicator = HeaderSessionIndicator
MentorDashboardStyle.Modal = Modal
MentorDashboardStyle.ContentText = ContentText
MentorDashboardStyle.ModalBox = ModalBox
MentorDashboardStyle.Text = Text
MentorDashboardStyle.FlexRow = FlexRow
MentorDashboardStyle.HeaderCourse = HeaderCourse
MentorDashboardStyle.Header = Header
MentorDashboardStyle.Content = Content
MentorDashboardStyle.Footer = Footer
MentorDashboardStyle.HeaderIcon = HeaderIcon
MentorDashboardStyle.HeaderDetails = HeaderDetails
MentorDashboardStyle.TopicThumbnail = TopicThumbnail
MentorDashboardStyle.HeaderTitle = HeaderTitle
MentorDashboardStyle.RescheduleTag = RescheduleTag
MentorDashboardStyle.HeaderDescription = HeaderDescription
MentorDashboardStyle.HeaderTimestamp = HeaderTimestamp
MentorDashboardStyle.ContentClassDetail = ContentClassDetail
MentorDashboardStyle.FooterText = FooterText
MentorDashboardStyle.FooterButton = FooterButton
MentorDashboardStyle.FooterSecondaryButton = FooterSecondaryButton
MentorDashboardStyle.CloseIcon = CloseIcon
MentorDashboardStyle.FlexContainer = FlexContainer
MentorDashboardStyle.PreHeaderText = PreHeaderText
MentorDashboardStyle.HeaderDetailsContainer = HeaderDetailsContainer

export default MentorDashboardStyle
