import styled from 'styled-components'
import { Select, Input, AutoComplete, Switch } from 'antd'

const BatchAttendanceStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`
const StyledInput = styled(Input)`
    min-width: 200px;
    display: flex;
    align-items: left;
    border-width: 0 0 2px 0 !important;
`
const TopContainer = styled.div`
    display:flex;
    justify-content: space-between;
`
const BottomContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    height: 70px;
`

const StyledSelect = styled(Select)`
    min-width: 200px;
    align-items: left;
`
const SearchIcon = styled.div`
    opacity: 0.5;
    margin-top: 8px;
`

const PaginationHolder = styled.div`
  margin: 20px 0;
  display: flex;
  width: 60%;
  justify-content: space-between;
  align-items: center;
  margin-left: auto;
`
const StyledAutocomplete = styled(AutoComplete)`
    min-width: 200px;
    display: flex;
    align-items: left;
    & input{
      border-width: 0 0 2px 0 !important;
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


const StyledOption = styled(Select.Option)``

BatchAttendanceStyle.TopContainer = TopContainer
BatchAttendanceStyle.Select = StyledSelect
BatchAttendanceStyle.Option = StyledOption
BatchAttendanceStyle.StyledInput = StyledInput
BatchAttendanceStyle.SearchIcon = SearchIcon
BatchAttendanceStyle.PaginationHolder = PaginationHolder
BatchAttendanceStyle.BottomContainer = BottomContainer
BatchAttendanceStyle.AutoComplete = StyledAutocomplete
BatchAttendanceStyle.StyledSwitch = StyledSwitch

export default BatchAttendanceStyle
