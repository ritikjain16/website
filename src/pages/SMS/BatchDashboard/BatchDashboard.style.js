import styled from 'styled-components'
import { Button, Select, Input, AutoComplete, Table } from 'antd'
import antdButtonColor from '../../../utils/mixins/antdButtonColor'
import colors from '../../../constants/colors'
import materialInput from '../../../utils/mixins/materialInput'

const ToggleButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100px;
`

const ToggleButton = styled(Button)`
  margin-left: 0 !important;
  border-radius: 0 !important;
  border-color: #73a5aa !important;
`

const BatchDashboardStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const TopContainer = styled.div`
    display:flex;
    justify-content:space-between;
    padding-bottom:20px;
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
 & input{
     ${materialInput()}
     border: 0;
    outline: 0;
    box-shadow: none;
    border-radius: 0 !important;
    padding: 0;
    border-bottom: 2px solid #bdbdbd !important;
    padding-bottom: 8px;
    font-weight: 500;
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
& .ant-table-content{
  padding:15px;
  color: #122b4a;
  background-color: #ffffff;
  margin-top:20px;
  border:1px solid lightgray;
  border-radius:6px;
  box-shadow:0px 4px 4px lightgray;
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
margin-bottom:10px;
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

BatchDashboardStyle.TopContainer = TopContainer
BatchDashboardStyle.StyledButton = StyledButton
BatchDashboardStyle.Select = StyledSelect
BatchDashboardStyle.Option = StyledOption
BatchDashboardStyle.StyledInput = StyledInput
BatchDashboardStyle.SearchIcon = SearchIcon
BatchDashboardStyle.ClearButton = ClearButton
BatchDashboardStyle.StatusIcon = statusIcon
BatchDashboardStyle.AutoComplete = StyledAutocomplete
BatchDashboardStyle.MDTable = MDTable
BatchDashboardStyle.Input = StyledInput
BatchDashboardStyle.PaginationContainer = PaginationContainer
BatchDashboardStyle.FormItemContainer = FormItemContainer
BatchDashboardStyle.FormErrorMsg = FormErrorMsg
BatchDashboardStyle.ToggleButton = ToggleButton
BatchDashboardStyle.ToggleButtonContainer = ToggleButtonContainer
export default BatchDashboardStyle
