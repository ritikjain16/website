import { AutoComplete, Select, Switch } from 'antd'
import styled from 'styled-components'

const SchoolProductMappingStyle = styled.div`
margin: 0;
padding: 0;
`

const SecondNavWrapper = styled.div`
display:flex;
justify-content:space-between;

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

SchoolProductMappingStyle.SecondNavWrapper = SecondNavWrapper
SchoolProductMappingStyle.StyledSwitch = StyledSwitch
SchoolProductMappingStyle.StyledSelect = StyledSelect
SchoolProductMappingStyle.StyledAutocomplete = StyledAutocomplete
SchoolProductMappingStyle.StyledOption = StyledOption


export default SchoolProductMappingStyle
