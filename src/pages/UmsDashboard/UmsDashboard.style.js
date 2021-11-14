import { Checkbox, Table, Divider } from 'antd'
import styled from 'styled-components'

const UmsDashboardStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`
const Online = styled.span`
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: green;
    display: block;
`

const Offline = styled.span`
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: grey;
    display: block;
`

const Blocked = styled.span`
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: crimson;
    display: block;
`

const UMSTable = styled(Table)`
.ant-table-thead > tr:first-child > th:first-child ,.ant-table-tbody > tr > td:first-of-type {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 11;
    background: ${props => props.bgColor ? props.bgColor : '#fbfbfb'};
}
.ant-table-thead > tr > th ,.ant-table-tbody > tr > td {
    border-right: 1px solid #e8e8e8;
}
`

const StatusBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 27px;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : '#fff'};
    font-family: Nunito;
    font-size: 12px;
    width: ${props => props.width ? props.width : '100px'};
    font-weight: 600;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.4);
    &:hover {
        cursor: ${props => props.hoverCursor ? props.hoverCursor : 'default'};
        background-color: ${props => props.hoverBackgroundColor ? props.hoverBackgroundColor : '#fff'};
    }
`

const FilterCheckBox = styled(Checkbox)`
  font-family: "Lato", sans-serif;
  font-size: 12px;
  .ant-checkbox + span {
    padding-right: 0px;
    padding-left: 0px;
  }
  &.ant-checkbox-wrapper {
    position: relative;
  }
  .ant-checkbox {
    position: absolute;
    z-index: 1;
    top: 5px;
    left: 15px;
  }
`

const FilterBox = styled.span`
  padding: 20px 5px 0px;
  border: 1px solid;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-width: 100px;
`
const SlotButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${props => props.height ? props.height : '30px'};
    background-color: ${props => props.refresh ? 'rgba(196, 248, 255, 1)' : 'rgba(232, 247, 97, 1)'};
    font-family: Nunito;
    font-size: ${props => props.fontSize ? props.fontSize : '16px'};
    width: ${props => props.width ? props.width : '80px'};
    min-width: fit-content;
    font-weight: bold;
    border-radius: 4px;
    padding: ${props => props.padding ? props.padding : '0'};
    margin-left: ${props => props.marginLeft ? props.marginLeft : '0'};
    margin-top: ${props => props.marginTop ? props.marginTop : '0'};
    color: ${props => props.refresh ? 'rgba(136, 85, 85, 0.9)' : '#885555'};
    &:hover {
        cursor: ${props => props.allowHover ? 'pointer' : 'not-allowed'};
        background-color: ${props => props.hoverColor ? props.hoverColor : 'rgba(232, 247, 97, 0.7)'};
        font-size: ${props => props.hoverFontSize ? props.hoverFontSize : '17px'};
    }
    &:active {
        font-size: 16px;
    }
`
const CourseWrapper = styled.p`
  border: 0.5px solid lightgray;
  padding: 5px;
  border-radius: 5px;
  position: relative;
  margin: 2px 10px 2px 2px;
  width: fit-content;
  display: inline-block;
  & .anticon-close{
    position: absolute;
    height: 20px;
    width: 20px;
    visibility: hidden;
    color: black;
    background-color: #D34B57;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    border: 1.42105px solid #504F4F;
    top: -10px;
    right: -10px;
    cursor: pointer;
  }
  &:hover .anticon-close{
    visibility: visible;
  }
`

const StyledDivider = styled(Divider)`
    &.ant-divider {
    height: 1px;
    margin: 5px 0;
    background: #b6b6b6;
  }
`

UmsDashboardStyle.Online = Online
UmsDashboardStyle.Offline = Offline
UmsDashboardStyle.Blocked = Blocked
UmsDashboardStyle.UMSTable = UMSTable
UmsDashboardStyle.StatusBox = StatusBox
UmsDashboardStyle.FilterCheckBox = FilterCheckBox
UmsDashboardStyle.FilterBox = FilterBox
UmsDashboardStyle.SlotButton = SlotButton
UmsDashboardStyle.CourseWrapper = CourseWrapper
UmsDashboardStyle.StyledDivider = StyledDivider

export default UmsDashboardStyle
