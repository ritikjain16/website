import styled from 'styled-components'
import { Button, Select, Input, AutoComplete, Table } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const MentorReportStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display:flex;
    justify-content:space-between;
    padding-bottom:20px;
    align-items:flex-start;
`

const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
  }
`

const StyledSelect = styled(Select)`
    min-width: 200px;
    //display: flex;
    align-items: left;
`
const StyledAutocomplete = styled(AutoComplete)`
    min-width: 200px;
    display: flex;
    align-items: left;
    & input{
      border-width: 0 0 2px 0 !important;
    }
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


const ClearButton = styled.button`
    display: inline;
    text-align: right;
    padding: 5px 24px;
    background-color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid grey;
    float: right;
    &:hover {
      cursor: pointer
    } 
`

const statusIcon = styled.span`
width: 10px;
  height: 10px;
  margin: 0 5px;
  background-color: ${props => props.color};
  border-radius: 50%;
`
const MDTable = styled(Table)`
 & .ant-table-thead > tr > th{
   padding:0px;
 }
 & .ant-table-thead > tr > th{
   font-weight:700 !important;
 }
 & .ant-table-thead > tr > th:nth-child(4), .ant-table-thead > tr > th:nth-child(5),
 .ant-table-thead > tr > th:nth-child(6), .ant-table-thead > tr > th:nth-child(7){
   background-color:rgb(219, 224, 255) !important;
 }
 & .ant-table-thead > tr > th:nth-child(8), .ant-table-thead > tr > th:nth-child(9){
   background-color:rgb(219, 244, 255) !important;
 }
  & .ant-table-thead > tr > th:nth-child(10), .ant-table-thead > tr > th:nth-child(11){
   background-color:rgb(219, 255, 249) !important;
 }
  & .ant-table-thead > tr > th:nth-child(12), .ant-table-thead > tr > th:nth-child(13){
   background-color:rgb(233, 255, 219) !important;
 }
 & .ant-table-thead > tr > th:nth-child(14), .ant-table-thead > tr > th:nth-child(15),
 .ant-table-thead > tr > th:nth-child(16), .ant-table-thead > tr > th:nth-child(17),
 .ant-table-thead > tr > th:nth-child(18){
   background-color:#fff5db !important;
 } 
 & .ant-table-thead > tr > th:nth-child(19),
 .ant-table-tbody > tr > td:nth-child(19),
 .ant-table-tbody > tr > td:nth-child(19):hover{
   background-color:#ffdbf8 !important;
 }
  & .ant-table-thead > tr > th:nth-child(20){
   background-color:rgb(255, 236, 219) !important;
 }
`
const PaginationHolder = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  width:60%;
  margin-left:auto;
`

MentorReportStyle.TopContainer = TopContainer
MentorReportStyle.StyledButton = StyledButton
MentorReportStyle.Select = StyledSelect
MentorReportStyle.Option = StyledOption
MentorReportStyle.StyledInput = StyledInput
MentorReportStyle.SearchIcon = SearchIcon
MentorReportStyle.ClearButton = ClearButton
MentorReportStyle.StatusIcon = statusIcon
MentorReportStyle.AutoComplete = StyledAutocomplete
MentorReportStyle.MDTable = MDTable
MentorReportStyle.PaginationHolder = PaginationHolder
export default MentorReportStyle
