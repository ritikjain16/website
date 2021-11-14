import styled from 'styled-components'
import { Input, Table, Switch, Divider, Select, Button } from 'antd'
import colors from '../../constants/colors'
import antdButtonColor from '../../utils/mixins/antdButtonColor'

const CodeApprovalStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display:flex;
    justify-content:space-between;
    padding-bottom:20px;
`
const TableContainer = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
`
const EditBtnContainer = styled.div`
  display:flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 0 0 15px;
`

const EditBtn = styled(Button)`
  padding: 20px;
`
const StyledSelect = styled(Select)`
    min-width: 200px;
    //display: flex;
    align-items: left;
`
const StyledOption = styled(Select.Option)``

const StyledInput = styled(Input)`
    min-width: 200px;
    display: flex;
    align-items: left;
    border-width: 0 0 2px 0 !important;
`

const SearchIcon = styled.div`
    opacity: 0.5;
    margin-top: 8px;
`

const Tag = styled.div`
  height: 24px;
  width: fit-content;
  font-weight: 550;
  font-size: 11px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 10px;
  padding: 0 20px 0 12px;
  white-space: nowrap;
  position: relative;
  border: 2px solid ${props => props.color};
  border-right: none;
  color: ${props => props.color};
  text-decoration: none;
  border-radius: 2px 2px 2px 2px;

  &:before {
    content: "";
    position: absolute;
    top: 4px;
    right: -5px;
    width: 12px;
    height: 12px;
    border: 2px solid ${props => props.color};
    border-radius: 2px 2px 2px 0px;
    border-left: none;
    border-bottom: none;
    -webkit-transform: scale(1, 1.5) rotate(45deg);
    -moz-transform: scale(1, 1.5) rotate(45deg);
    -ms-transform: scale(1, 1.5) rotate(45deg);
    transform: scale(1, 1.5) rotate(45deg);
  }
  &:after {
    content: "";
    position: absolute;
    top: 7px;
    right: 2px;
    width: 5px;
    height: 5px;
    border: 2px solid ${props => props.color};
    border-radius: 4px;
  }
`
const SwitchMD = styled(Switch)`
margin-right: 10px !important;
`

const StyledSwitch = styled(Switch)`
  &.ant-switch {
    background-color: #fff;
    border: 1px solid ${(props) => props.bgcolor};
    margin: 0px 10px;
  }  
  &.ant-switch::after {
    background-color: ${(props) => props.bgcolor};
  }
`

const StyledDivider = styled(Divider)`
    &.ant-divider {
      height: 2em;
      margin: 0px 15px;
      background: #b6b6b6; 
    }
`

const statusIcon = styled.span`
  width: 15px;
  height: 15px;
  margin: 0 10px;
  background-color: ${props => props.color};
  border-radius: 50%;
`

const MDTable = styled(Table)`
& .ant-table-content{
  color: #122b4a;
  background-color: #ffffff;
  border-radius:6px;
  
}
 & .ant-table-thead > tr > th{
  background-color: rgba(18, 43, 74, 0.17);
  margin: 0 0 78px 1px !important;
  font-weight: 600;
  color: #122b4a;
 }
 & tbody > tr{
   background-color: rgba(228, 228, 228, 0.35);
 }
 & .ant-table-content .ant-table-body .ant-table-tbody .antdTable-child-row > td {
   padding: 8px 0px;
 }
 & tbody > tr .anticon-delete svg{
  width: 16.8px;
  height: 22.2px;
  color: ${colors.table.deleteIcon};
 }
`

const PaginationContainer = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  width:100%;
  padding:10px 20px 30px 10px;
`

const StyledReaction = styled.div`
display: flex;
justify-content: center;
align-items: center;
background: #005773;
border-radius: 10px;
color: #fff;
margin: 5px;
padding: 5px 8px;
`

const PrevBtn = styled.button`
    position: absolute;
    left: 0;
    color: #bbbbbb;
    background: #f7f8fc;
    top: 50vh;
    transform: translateY(-50%) translateX(-120%);
    z-index: 1111;
    width: 70px;
    height: 70px;
    border-radius: 36%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    font-size: 40px;
    cursor: pointer;
    border: 0;
    box-shadow: 8px 10px 20px 0 rgba(46,61,73,.15);
    transition: all 0.3s ease;
    &:hover{
        box-shadow: 2px 4px 8px 0 rgba(46,61,73,.2);
        background: #bbbbbb;
        color: #f7f8fc;
    }
    &:focus{
        outline: 0;
        border: 0;
    }
`

const NextBtn = styled(PrevBtn)`
    left: auto;
    right: 0;
    transform: translateY(-50%) translateX(120%);
`
const StyledButton = styled(Button)`
  &&& {
    border-radius: 30px;
    color: #fff;
    ${antdButtonColor('#64da7a')}
  }
`
const RejectButton = styled(Button)`
  &&& {
    box-shadow: none;
    border-radius: 4px;
    background: transparent;
    color: ${colors.deleteRed};
    margin-left: 20px;
    border-color: ${colors.deleteRed};
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
`

CodeApprovalStyle.PaginationContainer = PaginationContainer
CodeApprovalStyle.EditBtnContainer = EditBtnContainer
CodeApprovalStyle.StyledReaction = StyledReaction
CodeApprovalStyle.TableContainer = TableContainer
CodeApprovalStyle.StyledDivider = StyledDivider
CodeApprovalStyle.StyledButton = StyledButton
CodeApprovalStyle.RejectButton = RejectButton
CodeApprovalStyle.StyledSwitch = StyledSwitch
CodeApprovalStyle.TopContainer = TopContainer
CodeApprovalStyle.StyledInput = StyledInput
CodeApprovalStyle.SearchIcon = SearchIcon
CodeApprovalStyle.StatusIcon = statusIcon
CodeApprovalStyle.Select = StyledSelect
CodeApprovalStyle.Option = StyledOption
CodeApprovalStyle.Input = StyledInput
CodeApprovalStyle.MDTable = MDTable
CodeApprovalStyle.NextBtn = NextBtn
CodeApprovalStyle.PrevBtn = PrevBtn
CodeApprovalStyle.EditBtn = EditBtn
CodeApprovalStyle.SwitchMD = SwitchMD
CodeApprovalStyle.Tag = Tag
export default CodeApprovalStyle
