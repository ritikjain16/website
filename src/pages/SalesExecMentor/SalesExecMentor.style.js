import styled from 'styled-components'
import { Select, Input } from 'antd'

const SalesExecMentorStyle = styled.div`
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
  justify-content: center;
`

const StyledOption = styled(Select.Option)``

SalesExecMentorStyle.TopContainer = TopContainer
SalesExecMentorStyle.Select = StyledSelect
SalesExecMentorStyle.Option = StyledOption
SalesExecMentorStyle.StyledInput = StyledInput
SalesExecMentorStyle.SearchIcon = SearchIcon
SalesExecMentorStyle.PaginationHolder = PaginationHolder
SalesExecMentorStyle.BottomContainer = BottomContainer

export default SalesExecMentorStyle
