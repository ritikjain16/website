import styled from 'styled-components'
import { AutoComplete, Checkbox, Input, Radio, Select, Table } from 'antd'

const ClassProgressStyle = styled.div`
  height: 100%;
  max-width: fit-content;
  width: 100%;
  margin: 0 auto;
`
const TopContainer = styled.div`
  display: grid;
  grid-template-columns: 45% 45%;
  width: 100%;
  justify-content: space-between;
  padding-bottom: 20px;
  align-items: flex-start;
`
const TopContainerInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-bottom: 20px;
  align-items: flex-start;
`
const InfoBox = styled.div`
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 14px;
  word-break: break-all;
  height: fit-content;
  font-weight: normal;
  font-style: normal;
  letter-spacing: 1.15px;
  background-color: ${(props) => (props.title ? 'rgba(18, 43, 74, 0.17)' : '')};
  color: ${(props) => (props.title ? '#122b4a' : 'black')};
  border: ${(props) => !props.title && '1px solid #122b4a'};
  margin-left: ${(props) => !props.title && '10px'};
`
const TagsIcon = styled.span`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  text-transform: capitalize;
  line-height: 24px;
  font-style: normal;
  letter-spacing: normal;
  font-size: 10px;
  color: #fff;
  font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
`
const MoreTags = styled.div`
  text-transform: capitalize;
  font-family: Nunito;
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`

const MDTable = styled(Table)``

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
const FilterRadioButton = styled(Radio)`
  font-family: "Lato", sans-serif;
  font-size: 12px;
  .ant-checkbox + span {
    padding-right: 0px;
    padding-left: 0px;
  }
  &.ant-radio-wrapper {
    position: relative;
  }
  .ant-radio {
    position: absolute;
    z-index: 1;
    top: 26px;
    left: 15px;
  }
`

const FilterBox = styled.span`
  padding: 10px 5px;
  border: 1px solid;
  // margin-left: 5px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  height: 64px;
  min-width: 100px;
`
const PaymentStatusBox = styled.div`
padding: 5px;
border-radius: 5px;
font-weight: 600;
& a:hover{
  color:${props => props.data === 'overDue' && 'lightblue !important'};
  color:${props => props.data === 'pending' && '#1890ff !important'};
   color:${props => props.data === 'paid' && '#1890ff !important'};
}
`
const StyledSelect = styled(Select)`
    min-width: 180px;
    //display: flex;
    align-items: left;
`
const StyledAutocomplete = styled(AutoComplete)`
    min-width: 180px;
    display: flex;
    align-items: left;
    & input{
      border-width: 0 0 2px 0 !important;
    }
`
const StyledInput = styled(Input)`
    min-width: 180px;
    display: flex;
    align-items: left;
    border-width: 0 0 2px 0 !important;
`
const SearchIcon = styled.div`
    opacity: 0.5;
    margin-top: 8px;
`

const StyledOption = styled(Select.Option)``

ClassProgressStyle.TopContainer = TopContainer
ClassProgressStyle.MDTable = MDTable
ClassProgressStyle.InfoBox = InfoBox
ClassProgressStyle.TopContainerInner = TopContainerInner
ClassProgressStyle.TagsIcon = TagsIcon
ClassProgressStyle.MoreTags = MoreTags
ClassProgressStyle.FilterCheckBox = FilterCheckBox
ClassProgressStyle.FilterBox = FilterBox
ClassProgressStyle.FilterRadioButton = FilterRadioButton
ClassProgressStyle.PaymentStatusBox = PaymentStatusBox
ClassProgressStyle.StyledSelect = StyledSelect
ClassProgressStyle.StyledOption = StyledOption
ClassProgressStyle.StyledAutocomplete = StyledAutocomplete
ClassProgressStyle.StyledInput = StyledInput
ClassProgressStyle.SearchIcon = SearchIcon
export default ClassProgressStyle
