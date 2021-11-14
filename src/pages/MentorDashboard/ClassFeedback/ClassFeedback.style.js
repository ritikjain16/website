import React from 'react'
import styled from 'styled-components'
import { Icon, Divider, Radio, Select, Input } from 'antd'
import { TekieAmethyst, TekieOrange, TekieRed } from '../../../constants/colors'
import getFullPath from '../../../utils/getFullPath'

const ClassFeedbackStyle = styled.div`
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
  font-size: ${props => props.fontSize ? props.fontSize : '24px'};
  fill: ${props => props.fillSvg ? props.fillSvg : '#666666'};
  margin-right: ${props => props.marginRight ? props.marginRight : '8px'};
`

const Container = styled.div`
    width: auto;
    background: #FFF;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px 32px;
    margin: 0px 0px 18px;
    @media screen and (max-width: 500px) {
        flex: 1 1 100%;
        padding: 12px;
    }
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
    padding: 14px 20px 14px 0px;
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
    letter-spacing: 0px;
    text-transform: uppercase;
    color: ${TekieAmethyst};
`
const TopicThumbnail = styled.div`
    background-image: url("${props => getFullPath(props.bgImage) || null}");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    width: 110px;
    height: 110px;
    background-color: #FFFFFF;
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
    border-radius: 16px;
`
const HeaderTitle = styled.div`
    font-family: 'Inter';
    font-weight: 600;
    font-size: 24px;
    color: #212121;
    margin-bottom: 10px;
    letter-spacing: 0px;
    line-height: 1;
`
const FeedbackTitle = styled.div`
    font-family: 'Inter';
    font-weight: 600;
    font-size: 18px;
    color: #212121;
    margin-bottom: 32px;
    letter-spacing: 0px;
    line-height: 1;
`
const FeedbackSubTitle = styled.div`
    font-family: 'Inter';
    font-weight: normal;
    font-size: 14px;
    margin-top: 12px;
    color: #616161;
    font-style: italic;
    letter-spacing: 0px;
`
const FeedbackContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    flex-wrap: wrap;
    padding-bottom: 18px;
`

const FeedbackLayout = styled.div`
    width: 100%;
    flex: ${props => props.placement === 'left' ? '0 1 35%' : '1 1 50%'};
    @media screen and (max-width: 500px) {
         flex: 1 1 100%;
    }
`

const FeedbackDescription = styled.div`
    font-family: 'Inter';
    font-weight: normal;
    font-size: 14px;
    color: #616161;
    margin-bottom: 12px;
    letter-spacing: 0px;
    line-height: 22px;
    width: 300px;
    @media screen and (max-width: 500px) {
         width: 100%;
    }
`
const HeaderTopic = styled.div`
    font-family: 'Inter';
    font-weight: 500;
    font-size: 14px;
    color: #424242;
    margin-top: 10px;
    line-height: 1;
    letter-spacing: 0px;
`
const SummaryText = styled.div`
    font-family: 'Inter';
    font-weight: 500;
    font-size: 14px;
    color: #212121;
    margin-bottom: 12px;
    line-height: 1;
    letter-spacing: 0px;
`
const HeaderDescription = styled.div`
    display: inline-flex;
    align-items: center;
    font-weight: normal;
    font-size: 12px;
    padding: 12px 0px 2px 0px;
    color: #616161;
    letter-spacing: 0px;
    line-height: 1;
`
const HeaderTimestamp = styled.div`
    font-weight: normal;
    font-size: 10px;
    padding: 4px 0px 0px 18px;
    letter-spacing: 0px;
    color: #AAAAAA;
`
const Text = styled.div`
    font-family: 'Inter';
    font-weight: 500;
    font-size: 12px;
    color: #424242;
    flex: 1 1 50%;
    letter-spacing: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const CheckboxLabel = styled.div`
    font-family: 'Inter';
    font-weight: normal;
    font-size: 14px;
    color: #616161;
    letter-spacing: 0px;
`

const Error = styled.div`
    font-family: 'Inter';
    font-weight: normal;
    font-size: 12px;
    color: ${TekieRed};
    padding: 6px 0px;
    letter-spacing: 0px;
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
    letter-spacing: 0px;
    margin: 12px 0px;

    & .classDetailsText {
        letter-spacing: 0px;
        font-family: 'Inter';
        font-weight: 400;
        width: 120px;
        font-size: 12px;
        color: #757575;
        white-space: no-wrap;
        padding: 0px 0px 0px 12px;
        flex: 1 1 50%;
    }

    @media screen and (max-width: 500px) {
        .classDetailsText {
            flex: 1 1 30%;
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
    font-family: 'Inter';
    letter-spacing: 0;
    font-weight: normal;
    font-size: 12px;
    color: #616161;
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
    &.ant-divider {
        background: #EEEEEE;
    }
    &.ant-divider-horizontal {
        margin: 18px 0px 28px;
    }
`

const CustomRadio = styled(Radio)`
    span {
        font-family: 'Inter';
        letter-spacing: 0px;
    }
    .ant-radio-inner {
        border: 1px solid #BDBDBD;
    }
    .ant-radio-checked .ant-radio-inner {
        border: none;
    }
    .ant-radio-wrapper:hover .ant-radio, .ant-radio:hover .ant-radio-inner, .ant-radio-input:focus + .ant-radio-inner {
        border-color: ${TekieAmethyst}
    }
    .ant-radio-inner::after {
        background-color: transparent;
        top: 0px;
        left: 0px;
        width: 16px;
        height: 16px;
        display: block;
        border-radius: 100%;
        box-sizing: border-box;
        margin: 0;
        border: 6px solid ${TekieAmethyst};
    }
`
const CustomSelect = styled(Select)`

    .ant-select-selection {
        border: 1px solid #EEEEEE;
        box-sizing: border-box;
        border-radius: 8px;
    }
    .ant-select-selection__placeholder {
        font-family: 'Inter';
        letter-spacing: 0px;
    }
    .ant-select-selection:hover {
        border-color: ${TekieAmethyst} !important;
    }
    .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active {
        border-color: ${TekieAmethyst} !important;
    }
`

const CustomTextArea = styled(Input.TextArea)`
    margin: 0 !important;
    width: 100%
    font-size: 14px !important;
    border-radius: 8px !important;
    // border: 1.5px solid #AAAAAA !important;
    letter-spacing: 0px !important;
    color: #666666 !important;
    min-height: 100px !important;
`
const SecondaryText = styled.div`
    font-weight: 500;
    font-size: 13px;
    color: #333333;
    padding-bottom: 12px;
`
const RequiredAsterisk = styled.span`
    color: #FF5744;
    padding: 0px 2px;
`

ClassFeedbackStyle.Icon = StyledIcon
ClassFeedbackStyle.RequiredAsterisk = RequiredAsterisk
ClassFeedbackStyle.Divider = CustomDivider
ClassFeedbackStyle.HeaderTag = HeaderTag
ClassFeedbackStyle.AddSessionButton = AddSessionButton
ClassFeedbackStyle.HeaderSessionIndicator = HeaderSessionIndicator
ClassFeedbackStyle.ContentText = ContentText
ClassFeedbackStyle.Text = Text
ClassFeedbackStyle.FlexRow = FlexRow
ClassFeedbackStyle.FeedbackLayout = FeedbackLayout
ClassFeedbackStyle.HeaderCourse = HeaderCourse
ClassFeedbackStyle.Container = Container
ClassFeedbackStyle.FeedbackTitle = FeedbackTitle
ClassFeedbackStyle.FeedbackSubTitle = FeedbackSubTitle
ClassFeedbackStyle.FeedbackDescription = FeedbackDescription
ClassFeedbackStyle.FeedbackContainer = FeedbackContainer
ClassFeedbackStyle.Content = Content
ClassFeedbackStyle.Footer = Footer
ClassFeedbackStyle.HeaderIcon = HeaderIcon
ClassFeedbackStyle.HeaderDetails = HeaderDetails
ClassFeedbackStyle.SummaryText = SummaryText
ClassFeedbackStyle.TopicThumbnail = TopicThumbnail
ClassFeedbackStyle.HeaderTopic = HeaderTopic
ClassFeedbackStyle.HeaderTitle = HeaderTitle
ClassFeedbackStyle.SecondaryText = SecondaryText
ClassFeedbackStyle.HeaderDescription = HeaderDescription
ClassFeedbackStyle.HeaderTimestamp = HeaderTimestamp
ClassFeedbackStyle.ContentClassDetail = ContentClassDetail
ClassFeedbackStyle.CustomRadio = CustomRadio
ClassFeedbackStyle.FooterText = FooterText
ClassFeedbackStyle.FooterButton = FooterButton
ClassFeedbackStyle.CustomTextArea = CustomTextArea
ClassFeedbackStyle.FooterSecondaryButton = FooterSecondaryButton
ClassFeedbackStyle.FlexContainer = FlexContainer
ClassFeedbackStyle.PreHeaderText = PreHeaderText
ClassFeedbackStyle.HeaderDetailsContainer = HeaderDetailsContainer
ClassFeedbackStyle.CheckboxLabel = CheckboxLabel
ClassFeedbackStyle.Select = CustomSelect
ClassFeedbackStyle.Error = Error

export default ClassFeedbackStyle
