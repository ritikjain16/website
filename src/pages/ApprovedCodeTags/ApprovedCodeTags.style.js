import styled from 'styled-components'
import { Input, Table, Switch, Divider, Select, Button } from 'antd'
import colors from '../../constants/colors'
import antdButtonColor from '../../utils/mixins/antdButtonColor'

const ApprovedCodeTagsStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display:flex;
    justify-content:space-between;
`
const TableContainer = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
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
      width: 0.7px;
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
& .ant-table-body{
  display: flex;
  justify-content: center;
}

& .ant-table-scroll table{
  min-width: max-content;
}

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
margin:2rem 0rem;
`

const FormCTAContainer = styled.div`
display:flex;
flex-direction: column;
justify-content:center;
align-items:center;
width:100%;
margin:2rem 0rem;
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

const TextItem = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #122b4a;
  margin-bottom: 10px;
`

const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`
const FormItemContainer = styled.div`
display: grid;
grid-template-columns: 20% 65%;
justify-content: space-between;
margin-bottom: 10px;
& > div{
  margin:0 !important;
}
`
const FormErrorMsg = styled.div`
margin:5px 0;
color: red;
font-size:14px;
width:65%;
margin-left:auto
`

ApprovedCodeTagsStyle.TopContainer = TopContainer
ApprovedCodeTagsStyle.FormCTAContainer = FormCTAContainer
ApprovedCodeTagsStyle.TextItem = TextItem
ApprovedCodeTagsStyle.Select = StyledSelect
ApprovedCodeTagsStyle.FormItemContainer = FormItemContainer
ApprovedCodeTagsStyle.FormErrorMsg = FormErrorMsg
ApprovedCodeTagsStyle.Option = StyledOption
ApprovedCodeTagsStyle.StyledInput = StyledInput
ApprovedCodeTagsStyle.SearchIcon = SearchIcon
ApprovedCodeTagsStyle.StyledButton = StyledButton
ApprovedCodeTagsStyle.StatusIcon = statusIcon
ApprovedCodeTagsStyle.MDTable = MDTable
ApprovedCodeTagsStyle.Input = StyledInput
ApprovedCodeTagsStyle.PaginationContainer = PaginationContainer
ApprovedCodeTagsStyle.Tag = Tag
ApprovedCodeTagsStyle.StyledSwitch = StyledSwitch
ApprovedCodeTagsStyle.StyledReaction = StyledReaction
ApprovedCodeTagsStyle.StyledDivider = StyledDivider
ApprovedCodeTagsStyle.TableContainer = TableContainer
export default ApprovedCodeTagsStyle
