import styled from 'styled-components'
import { Button, Select, Input, AutoComplete } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const BatchUserMappingStyle = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
`

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 20px;
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

const BottomContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  height: 70px;
`

const StyledOption = styled(Select.Option)``

const StyledInput = styled(Input)`
  min-width: 200px;
  display: flex;
  align-items: left;
`
const SearchIcon = styled.div`
  position: relative;
  right: 25px;
  opacity: 0.8;
  margin-top: 8px;
`

const ClearButton = styled.button`
  display: inline;
  text-align: right;
  margin: 0 0 10px;
  padding: 5px 24px;
  background-color: #f2f2f2;
  border-radius: 5px;
  border: 1px solid grey;
  float: right;
  &:hover {
    cursor: pointer;
  }
`

const StyledAutocomplete = styled(AutoComplete)`
    min-width: 200px;
    display: flex;
    align-items: left;
    & input{
      border-width: 0 0 2px 0 !important;
    }
`

BatchUserMappingStyle.TopContainer = TopContainer
BatchUserMappingStyle.StyledButton = StyledButton
BatchUserMappingStyle.Select = StyledSelect
BatchUserMappingStyle.Option = StyledOption
BatchUserMappingStyle.StyledInput = StyledInput
BatchUserMappingStyle.SearchIcon = SearchIcon
BatchUserMappingStyle.BottomContainer = BottomContainer
BatchUserMappingStyle.ClearButton = ClearButton
BatchUserMappingStyle.AutoComplete = StyledAutocomplete

export default BatchUserMappingStyle
