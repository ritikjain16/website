import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import { Icon, TimePicker, DatePicker, Checkbox, Input, Spin, Collapse, Select } from 'antd'
import { TekieAmethyst, TekieOrange, TekieRed } from '../../../constants/colors'
import { ArrowSvg, CloseSVG } from '../../../constants/icons'

const { Panel } = Collapse

const loadingIcon = <LoadingOutlined style={{ fontSize: 16, marginRight: '8px', color: '#FFF' }} spin />

const Spinner = styled(({ isActive, ...rest }) => <Spin indicator={loadingIcon} {...rest} />)`
`
const CloseIcon = styled(({ isActive, ...rest }) => <Icon component={CloseSVG} {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: ${props => props.fontSize ? props.fontSize : '26px'};
  fill: #666666;
  margin-right: 8px;
  position: absolute;
  top: 0;
  right: 0;
  padding: 14px 10px;
  cursor: pointer;
`
const Modal = styled.div`
    font-family: 'Inter' !important;
    height: 100%;
    width: 100%;
    margin: 0 auto;
`
const WithBackdrop = styled.div`
    font-family: 'Inter' ;
    z-index: 999;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
    transition: filter 200ms ease-in-out, visibility .1s cubic-bezier(0.4,0.0,0.2,1), backdrop-filter .3s ease-in-out;
    background: rgba(0,0,0,0.6);
    backdrop-filter: ${props => props.visible ? 'blur(5px)' : 'blur(0px);'};
`
const ModalBox = styled.div`
    font-family: 'Inter';
    z-index: 9999;
    max-width: 550px;
    position: absolute;
    top: 50%;
    left: 50%;
    background: #FFFFFF;
    box-shadow: 0px 6px 48px rgba(51, 51, 51, 0.24);
    border-radius: 16px;
    transition: opacity 200ms ease-in-out, transform 300ms ease-in-out, visibility .2s cubic-bezier(0.4,0.0,0.2,1);
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
    opacity: ${props => props.visible ? 1 : 0};
    transform: ${props => props.visible ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(.8)'};
    overflow: hidden;
    box-sizing: border-box;
    font-family: 'Inter' !important;

    @media screen and (max-width: 700px) {
        height: 100%;
        min-width: 100%;
    }
`
const FlexContainer = styled.div`
    display: flex;
    padding-bottom: 14px;
    flex-direction: ${props => props.flexDirection || 'row'};
    transition: all .3s;
    @media screen and (max-width: 700px) {
        flex-wrap: wrap;
    }
`
const StyledIcon = styled(({ isActive, ...rest }) => <Icon {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: ${props => props.fontSize ? props.fontSize : '26px'};
  fill: ${props => props.fillSvg ? props.fillSvg : '#666666'};
  margin-right: ${props => props.marginRight ? props.marginRight : '8px'};
`

const SecondaryIcon = styled(({ isActive, ...rest }) => <Icon {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: ${props => props.fontSize ? props.fontSize : '22px'};
  fill: ${props => props.fillSvg ? props.fillSvg : '#666666'};
  margin-right: ${props => props.marginRight ? props.marginRight : '4px'};
  position: absolute;
  background: white;
  padding: 4px;
  border-radius: 100%;
  bottom: 0;
  right: 0;
`

const Header = styled.div`
    width: auto;
    margin: 4px;
    background: ${props => props.bgColor ? props.bgColor : '#FAF7FF'};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 8px 12px 12px;
    border-radius: 16px;

    @media screen and (max-width: 700px) {
        padding: 0px;
    }
`
const HeaderTitle = styled.div`
    font-weight: 500;
    font-size: 18px;
    color: #000;
    line-height: 2;
    letter-spacing: .5px;
`
const HeaderDescription = styled.div`
    display: inline-flex;
    font-weight: 500;
    font-size: 14px;
    padding-bottom: 2px;
    letter-spacing: 0px;
    line-height: 1.4;
    color: #333333;
    opacity: 0.8;
`
const Content = styled.div`
    padding: 24px 24px 10px;
    overflow: hidden scroll;
    max-height: 70vh;
    @media screen and (max-width: 700px) {
        height: 70%;
    }
`
const ContentText = styled.div`
    font-weight: 500;
    font-size: 14px;
    color: #111111;
    letter-spacing: .5px;
`
const Footer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #FFF;
    justify-content: space-between;
    padding: 16px;
    align-items: flex-start;
    box-shadow: 0px 0px 4px rgba(51, 51, 51, 0.15);

    @media screen and (max-width: 700px) {
        position: fixed;
        bottom: 0px;
        padding-bottom: 30px;
    }
`
const PrimaryButton = styled.button`
    font-family: 'Inter';
    border: none;
    padding: 8px 14px;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    background: ${props => props.disabled ? '#CCCCCC' : TekieAmethyst};
    border-radius: 8px;
    cursor: ${props => props.disabled || props.loading ? 'not-allowed' : 'pointer'};
    pointer-events: ${props => props.disabled || props.loading ? 'none' : 'all'};
    letter-spacing: 0px;
    transistion: all .3s;
    display: flex;
    user-select: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    &:hover, &:focus{
        background: ${props => props.disabled ? '#BBBBBB' : '#713EBC'};
    }
    &:focus {
        box-shadow: 0px 2px 8px rgba(140, 97, 203, 0.4);
    }
`
const PrimaryLink = styled(Link)`
    font-family: 'Inter';
    border: none;
    padding: 8px 14px;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    background: ${props => props.disabled ? '#CCCCCC' : TekieAmethyst};
    border-radius: 8px;
    cursor: ${props => props.disabled || props.loading ? 'not-allowed' : 'pointer'};
    letter-spacing: 0px;
    transistion: all .3s;
    
    &:hover, &:focus{
        background: ${props => props.disabled ? '#CCCCCC' : '#713EBC'};
        color: #fff !important;
    }
    &:focus {
        box-shadow: 0px 2px 8px rgba(140, 97, 203, 0.4);
    }
`
const SecondaryButton = styled.button`
    font-family: 'Inter';
    border: none;
    padding: 8px 14px;
    font-weight: 500;
    font-size: 14px;
    color: ${props => props.disabled ? '#CCCCCC' : TekieAmethyst};
    background: #FAF6FF;
    border-radius: 8px;
    cursor: pointer;
    letter-spacing: 0px;

    &:hover, &:focus{
        background: ${props => props.disabled ? '#F5F5F5' : '#F3EBFF'};
    }
    &:focus {
        box-shadow: 0px 2px 8px rgba(113, 62, 188, 0.24);
    }
`

const DangerButton = styled.button`
    font-family: 'Inter';
    border: none;
    padding: 8px 14px;
    font-weight: 500;
    font-size: 14px;
    color: #fff;
    background: ${TekieRed};
    border-radius: 8px;
    cursor: pointer;
    letter-spacing: 0px;
    &:focus {
        box-shadow: 0px 2px 8px rgba(113, 62, 188, 0.24);
    }
`
const ButtonOutline = styled.button`
    font-family: 'Inter';
    border: 2px solid ${TekieAmethyst};
    padding: 6px 12px;
    font-weight: 500;
    font-size: 14px;
    color: ${props => props.disabled ? '#CCCCCC' : TekieAmethyst};
    background: #FAF6FF;
    border-radius: 8px;
    cursor: pointer;
    letter-spacing: 0px;

    &:hover, &:focus{
        background: ${props => props.disabled ? '#F5F5F5' : '#F3EBFF'};
    }
    &:focus {
        box-shadow: 0px 2px 8px rgba(113, 62, 188, 0.24);
    }
`
const CustomTimePicker = styled(TimePicker)`
    &.ant-time-picker {
        width: 100px;
    }
    .ant-time-picker-input {
        font-family: 'Inter';
        color: #333333;
        font-weight: normal;
        letter-spacing: 0px;
        border-radius: 8px;
        border: 1.5px solid #AAAAAA;
        height: 42px;
    }
    .ant-time-picker-panel-combobox .ant-time-picker-panel-select li:focus {
        color: ${TekieAmethyst} !important;
    }
    .ant-time-picker-input:hover {
        border-color: ${TekieAmethyst};
    }
`
const CustomDatePicker = styled(DatePicker)`
    &.ant-calendar-picker {
        width: 100px;
    }
    &.ant-calendar-picker:hover {
        &.ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled) {
            border-color: ${TekieAmethyst};
        }
    }
    & .ant-calendar-today-btn {
        color: ${TekieAmethyst};
    }
    .ant-calendar {
        border-radius: 8px !important;
    }
    .ant-calendar-today > div {
        border-color: ${TekieAmethyst} !important;
        color: ${TekieAmethyst} !important;
    }
    .ant-calendar-selected-day .ant-calendar-date {
        background: ${TekieAmethyst} !important;
        color: white !important;
    }
    .ant-calendar-picker-input.ant-input {
        font-family: 'Inter';
        color: #333333;
        font-weight: normal;
        letter-spacing: 0px;
        border-radius: 8px;
        border: 1.5px solid #AAAAAA;
        height: 42px;
    }
    .ant-time-picker-panel-combobox .ant-time-picker-panel-select li:focus {
        color: ${TekieAmethyst} !important;
    }
`
const CustomCheckbox = styled(Checkbox)`
    .ant-checkbox-inner {
        border: 1px solid #AAAAAA;
    }
    &.ant-checkbox-wrapper {
        width: 100%;
        height: 100%;
        padding: 12px 14px;
        margin: 0px !important;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: ${props => props.justifyContent || 'center'};
    }
    &.ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner {
        border-color: ${TekieAmethyst};
    }
    .ant-checkbox-checked::after {
        border-color: ${TekieAmethyst};
    }
    .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${TekieAmethyst} !important;
        border-color: ${TekieAmethyst} !important;
    }
`
const CustomInput = styled(Input)`
    &.ant-input {
        height: 38px;
        font-size: 14px;
        border-radius: 8px;
        border: 1.5px solid #AAAAAA;
        letter-spacing: 0px;
        color: #666666;
    }
    &.ant-input:hover, &.ant-input:focus {
        border-color: ${TekieAmethyst};
        box-shadow: none;
    }
`

const CustomInputTemp = styled(Input)`
    &.ant-input {
        height: 38px;
        font-size: 14px;
        border-radius: 8px;
        border: 1.5px solid #AAAAAA;
        letter-spacing: 0px;
        color: #666666;
    }
    &.ant-input:hover, &.ant-input:focus {
        border-color: ${TekieAmethyst};
        box-shadow: none;
        color: ${TekieAmethyst};
    }
`
const CustomPanel = styled(Panel)`
    border: none !important;
    background: #FFF !important;
    .ant-collapse-header {
        padding: 14px 20px !important;
    }
    .ant-collapse-content {
        .ant-collapse-content-box {
            padding: 0px 20px !important;
        }
    }
`
const CustomCollapse = (props) => (
  <Collapse
    {...props}
    bordered={false}
    expandIconPosition='right'
    expandIcon={({ isActive }) => <Icon component={ArrowSvg}
      style={{ transform: `${isActive ? 'rotate(0) translateY(-50%)' : 'rotate(180deg) translateY(50%)'}` }}
    />}
  >
    {props.children}
  </Collapse>
)

const CustomSelect = styled((props) => <Select ref={props.refObj} {...props} />)`
  min-width: 160px;
  font-family: 'Inter';
  letter-spacing: 0px;
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
    box-shadow: 0 0 0 2px rgba(140, 97, 203, 0.2) !important;
  }
  .ant-select-search .ant-select-search__field__wrap input {
    font-family: 'Inter' !important;
    letter-spacing: 0px !important;
    color: #bfbfbf !important;
  }
  .ant-select-open > .ant-select-selection {
    border-color: ${TekieAmethyst} !important;
    box-shadow: 0 0 0 2px rgba(140, 97, 203, 0.2) !important;
  }
`

const SelectOption = styled(Select.Option)`
    font-family: 'Inter';
    letter-spacing: 0.3;
`

const PreHeaderText = styled.div`
    font-family: 'Inter';
    text-transform: Uppercase;
    font-weight: 550;
    font-size: 16px;
    color: #111111;
    margin: 0px 14px;
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

Modal.ModalBox = ModalBox
Modal.WithBackdrop = WithBackdrop
Modal.FlexContainer = FlexContainer
Modal.StyledIcon = StyledIcon
Modal.Icon = StyledIcon
Modal.SecondaryIcon = SecondaryIcon
Modal.CloseIcon = CloseIcon
Modal.Header = Header
Modal.HeaderTitle = HeaderTitle
Modal.HeaderDescription = HeaderDescription
Modal.Content = Content
Modal.ContentText = ContentText
Modal.CustomTimePicker = CustomTimePicker
Modal.CustomDatePicker = CustomDatePicker
Modal.CustomCheckbox = CustomCheckbox
Modal.CustomInput = CustomInput
Modal.Footer = Footer
Modal.PrimaryButton = PrimaryButton
Modal.PrimaryLink = PrimaryLink
Modal.SecondaryButton = SecondaryButton
Modal.ButtonOutline = ButtonOutline
Modal.Spinner = Spinner
Modal.Collapse = CustomCollapse
Modal.Panel = CustomPanel
Modal.Select = CustomSelect
Modal.Option = SelectOption
Modal.CustomInputTemp = CustomInputTemp
Modal.PreHeaderText = PreHeaderText
Modal.HeaderSessionIndicator = HeaderSessionIndicator
Modal.DangerButton = DangerButton

export default Modal
