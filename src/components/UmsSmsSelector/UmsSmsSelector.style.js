import styled from 'styled-components'
import { Select } from 'antd'

const UmsSmsSelectorStyles = styled.div``

const StyledDropdown = styled(Select)`
  &&&{
    width: 200px;
    margin-right: 20px;
    .ant-select-selection--single{
    border-right-width: 0px !important ;
    border-top-style: none !important;
    border-radius: 0px !important;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : '#fff'};
    color: ${props => props.color ? props.color : '#000'};
    border-left-width: 0px !important;
    }
  }
  position: relative;
`

UmsSmsSelectorStyles.Dropdown = StyledDropdown

export default UmsSmsSelectorStyles
