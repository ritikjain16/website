import styled from 'styled-components'
import { Row, Col, Select, AutoComplete } from 'antd'


const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  overflow: scroll;
`
const FormModal = styled.div`
margin: 30px auto;
  width: calc(100% - 40px);
  max-width: 450px;
  background: white;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
  &:last-child {
    margin-bottom: 20px;
  }
`
const FormHeading = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  font-size: 15px;
`
const FormWrapper = styled.div`
  margin-top: 10px;
  width: 100%;
  padding: 0 20px;
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  width: fit-content;
  border-radius:3px;
  box-shadow:0 8px 32px 0 rgba(0, 0, 0, 0.25);
`
const StyledRow = styled(Row)`
  text-align: center;
`

const StyledCol = styled(Col)`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin: 0rem auto .9rem;

  &.ant-col-12 {
    display: flex;
  }
`

const TopContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
`

const TagSearch = styled.div`
  display: flex;
  font-size: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const TagsContainer = styled.div`
  padding: 1rem 5rem;
  flex-direction: row;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const TagsParentContainer = styled.div`
  position: relative;
  min-height: fit-content;
  width: 90%;
  padding: 0rem 7rem;
  max-width: 750px;
  margin: auto;
  flex-direction: column;
  display: flex;
  border-radius: 8px;
  justify-content: center;
`

const TagTitle = styled.div`
  width: fit-content;
  margin: 10px;
  padding: 8px 40px;
  border-radius: 50px;
  background-color: #00ade7;
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
  background: ${props => props.color};
  border-right: none;
  color: #fff;
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
    background: ${props => props.color};
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
    border: 2px solid #002a38;
    background: #002a38;
    border-radius: 4px;
  }
`

const StyledSelect = styled(Select)`
  min-width: 200px;
  align-items: left;

  & .ant-select-selection {
    border-radius: 50px;
    font-size: 10px;
  }
`

const StyledOption = styled(Select.Option)``

const StyledAutocomplete = styled(AutoComplete)`
    min-width: 180px;
    display: flex;
    align-items: left;
    & input{
      border-width: 0 0 2px 0 !important;
    }
`

Main.FlexContainer = FlexContainer
Main.StyledRow = StyledRow
Main.StyledCol = StyledCol
Main.TopContainer = TopContainer
Main.Container = Container
Main.TagsParentContainer = TagsParentContainer
Main.TagsContainer = TagsContainer
Main.Tag = Tag
Main.TagTitle = TagTitle
Main.TagSearch = TagSearch
Main.Option = StyledOption
Main.Select = StyledSelect
Main.FormModal = FormModal
Main.FormHeading = FormHeading
Main.FormWrapper = FormWrapper
Main.StyledAutocomplete = StyledAutocomplete

export default Main
