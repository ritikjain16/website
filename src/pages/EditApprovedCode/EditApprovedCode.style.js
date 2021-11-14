import styled from 'styled-components'
import { Button, Row, Col, Typography, Select } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'

const { Text } = Typography
const EditAprrovedCodeStyle = styled.div`
    width: 100%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const EmptyState = FlexContainer.extend`
  width: 100%;
  height: 100%
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
const TextPrimary = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.color};
  padding: 0 15px;
  letter-spacing: 0px;
`
const TextSecondary = styled(Text)`
  font-size: 12px;
  width: 150px;
  font-weight: 600;
  padding: 0 15px;
  letter-spacing: 0px;
  padding: 10px 0px;
  border-radius: 4px;
  background: rgba(228, 228, 228, 0.35);
  margin: 0rem .5rem;
  
  
  &.ant-typography {
    color: #122b4a;
    word-break: break-word;
  }
  
  &.ant-typography-edit-content {
    padding: 0rem;
    margin: 0rem .9rem;
  }
`

const TextContainer = styled.div`
  padding: 10px 0px;
  border-radius: 4px;
  min-width: 170px;
  background-color: rgba(18, 43, 74, 0.17);
`


const TopDetails = styled.div`
  width: fit-content;
  color: #fff;
  display: flex;
  flex-direction: row;
  min-height: 35px;
  justify-content: center;
  align-items: center;
  background-color: #1890ff;
  border-color: #1890ff;
  padding: 0 15px;
  border-radius: 4px;
`

const TagSearch = styled.div`
  display: flex;
  font-size: 12px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const StyledCodeContainer = styled.div`
  position: relative;
  margin: auto;
  min-height: 350px;
  min-width: 250px;
  max-height: 400px;
  width: 300px;
  background: #002a38;
  overflow: hidden;
  border-radius: 8px;
  padding: 2rem 0rem;
`

const StyledCodeInput = styled.div`
  min-height: 350px;
  height: 350px;
  min-width: 250px;
  max-height: 350px;
  width: 300px;
  padding: .5rem 0rem;

  &::-webkit-scrollbar {
      display: none;
    }
`

const TagsContainer = styled.div`
  color: white;
  padding: 1rem 5rem;
  margin: auto;
  flex-direction: row;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`

const TagsParentContainer = styled.div`
  position: relative;
  min-height: fit-content;
  width: 90%;
  color: white;
  padding: 0rem 7rem;
  max-width: 750px;
  margin: auto;
  background: #002a38;
  flex-direction: column;
  display: flex;
  border-radius: 8px;
  justify-content: center;
`

const StyledButton = styled(Button)`
  &&& {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 2rem;
    border-radius: 30px;
    color: #fff;
    ${antdButtonColor('#64da7a')}
  }
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

const SaveButton = styled(Button)`
&.ant-btn {
  width: 35px;
  height: 35px;
  margin: 5px;
  padding: 0px;
  border: none;
  font-size: 12px;
  box-shadow: 0 4px 15px 0 rgba(53, 228, 233, 0.5);
  background-color: #35e4e9;
  border-radius: 100%;
  color: white;
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

const PrevBtn = styled.button`
    position: relative;
    top: 300px;
    color: #bbbbbb;
    background: #f7f8fc;
    z-index: 1111;
    width: 70px;
    height: 70px;
    margin: 0px 18px;
    border-radius: 36%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    text-align: center;
    font-size: 40px;
    cursor: pointer;
    border: 0;
    box-shadow: 0px 4px 20px 5px rgba(46,61,73,.2);
    transition: all 0.3s ease;
    &:hover{
        box-shadow: 2px 4px 8px 0 rgba(46,61,73,.2);
        background: #bbbbbb;
        color: #f7f8fc;
    }
    &:focus{
        outline: 0;
        border: 0;
    }
`

const NextBtn = styled(PrevBtn)`
`

const StyledOption = styled(Select.Option)``

EditAprrovedCodeStyle.FlexContainer = FlexContainer
EditAprrovedCodeStyle.EmptyState = EmptyState
EditAprrovedCodeStyle.StyledRow = StyledRow
EditAprrovedCodeStyle.StyledCol = StyledCol
EditAprrovedCodeStyle.TopDetails = TopDetails
EditAprrovedCodeStyle.TextContainer = TextContainer
EditAprrovedCodeStyle.TextPrimary = TextPrimary
EditAprrovedCodeStyle.TextSecondary = TextSecondary
EditAprrovedCodeStyle.TopContainer = TopContainer
EditAprrovedCodeStyle.Container = Container
EditAprrovedCodeStyle.StyledCodeInput = StyledCodeInput
EditAprrovedCodeStyle.StyledButton = StyledButton
EditAprrovedCodeStyle.StyledCodeContainer = StyledCodeContainer
EditAprrovedCodeStyle.TagsParentContainer = TagsParentContainer
EditAprrovedCodeStyle.TagsContainer = TagsContainer
EditAprrovedCodeStyle.SaveButton = SaveButton
EditAprrovedCodeStyle.Tag = Tag
EditAprrovedCodeStyle.PrevBtn = PrevBtn
EditAprrovedCodeStyle.NextBtn = NextBtn
EditAprrovedCodeStyle.TagTitle = TagTitle
EditAprrovedCodeStyle.TagSearch = TagSearch
EditAprrovedCodeStyle.Option = StyledOption
EditAprrovedCodeStyle.Select = StyledSelect

export default EditAprrovedCodeStyle
