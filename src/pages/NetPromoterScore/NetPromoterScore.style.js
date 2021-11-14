import styled from 'styled-components'
import { Button, Select, Input, AutoComplete } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const NetPromoterScoreStyle = styled.div`
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const StyledAutocomplete = styled(AutoComplete)`
    min-width: 200px;
    display: flex;
    align-items: left;
    & input{
      border-width: 0 0 2px 0 !important;
    }
`

const TopContainer = styled.div`
    display:flex;
    justify-content:space-between;
    align-items:center;
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
    border-width: 0 0 2px 0 !important;
`

const SearchIcon = styled.div`
    opacity: 0.5;
    margin-top: 8px;
`

const PickSlotItem = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #0000EE;
    padding: 0 10px;
    text-align: center;
    flex-wrap: wrap;
    &:hover {
      cursor: pointer
    } 
`

const NPSScale = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    flex-wrap: nowrap;
    &:hover {
      cursor: pointer
    } 
`

const NPSScaleGroup = styled.div`
  width: 100%;
  display: flex;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  line-height: 1;
`

const NPSScaleComponent = styled.span`
    text-align: right;
    height: 20px;
    margin: 0 0 50px;
    border: solid #fff;
    border-width: thin;
    line-height: 1.2;
    font-size: 16px;
    font-weight: bold;
    color: black;
    display: grid;
    &:hover {
      cursor: pointer
    } 
`

const NPSScaleButton = styled.button`
    display: inline;
    text-align: right;
    padding: 0;
    &:hover {
      cursor: pointer
    } 
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
      cursor: pointer
    } 
`


const NPSVerticalTab = styled.div`
background: #FFFFFF;
border-radius: 8px;
cursor: pointer;
box-shadow: 0px 1.46867px 2.93734px rgba(0, 0, 0, 0.15);
height: 40px;
width: 115px;
display: flex;
justify-content: center;
align-items: center;
&:nth-of-type(2){
  margin: 0 15px;
}
font-style: normal;
font-weight: bold;
font-size: 16px;
line-height: 29px;
color: #000000;
border-bottom: ${props => props.checked ? '2px solid #00ADE6' : ''};
`

NetPromoterScoreStyle.TopContainer = TopContainer
NetPromoterScoreStyle.StyledButton = StyledButton
NetPromoterScoreStyle.Select = StyledSelect
NetPromoterScoreStyle.Option = StyledOption
NetPromoterScoreStyle.StyledInput = StyledInput
NetPromoterScoreStyle.SearchIcon = SearchIcon
NetPromoterScoreStyle.BottomContainer = BottomContainer
NetPromoterScoreStyle.PickSlotItem = PickSlotItem
NetPromoterScoreStyle.NPSScale = NPSScale
NetPromoterScoreStyle.NPSScaleGroup = NPSScaleGroup
NetPromoterScoreStyle.NPSScaleComponent = NPSScaleComponent
NetPromoterScoreStyle.NPSScaleButton = NPSScaleButton
NetPromoterScoreStyle.ClearButton = ClearButton
NetPromoterScoreStyle.AutoComplete = StyledAutocomplete
NetPromoterScoreStyle.NPSVerticalTab = NPSVerticalTab

export default NetPromoterScoreStyle
