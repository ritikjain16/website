import styled from 'styled-components'
import { Input, Button, Switch } from 'antd'
import colors from '../../constants/colors'

const CheatSheetStyle = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
`

const TopContainer = styled.div`
  display:flex;
  justify-content:space-between;
  padding:20px;
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
const StyledInput = styled(Input)`
  width: 100%;
  display: flex;
  align-items: left;
  border-width: 0 0 2px 0 !important;
`

const StyledTextArea = styled(Input.TextArea)`
width:100% !important;
min-height: 55px !important;
`

const StyledButton = styled(Button)`
height:50px !important;
padding: 0 20px !important;
font-size: 18px !important;
border:${props => props.type === 'default' ? '2px solid' : '1px solid'};
color: ${props => props.type === 'default' ? 'black' : 'whitesmoke'};
border-color: ${props => props.type === 'default' ? 'black' : 'inherit'};
  & .anticon-plus{
    padding: 8px;
    font-weight:900;
    color: #096dd9;
    background-color:whitesmoke;
    border-radius: 999px;
  }
`
const CheatBox = styled.div`
position:relative;
margin: 0 10px;
`
const CloseImage = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  z-index: 10;
  display: flex;
  font-size: 18px;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  cursor:pointer;
  color: ${colors.subThemeColor};
  box-shadow: -5px 4px 25px 12px rgba(46,61,73,0.1);
  transition: 0.2s all ease-in-out;
  &:hover {
    background: #f3f3f3;
  }
`

CheatSheetStyle.TopContainer = TopContainer
CheatSheetStyle.Input = StyledInput
CheatSheetStyle.StyledButton = StyledButton
CheatSheetStyle.CheatBox = CheatBox
CheatSheetStyle.CloseImage = CloseImage
CheatSheetStyle.StyledSwitch = StyledSwitch
CheatSheetStyle.StyledTextArea = StyledTextArea
export default CheatSheetStyle
