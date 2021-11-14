import styled from 'styled-components'
import { Icon, Dropdown, Menu, Select } from 'antd'
import colors from '../../constants/colors'

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: ${props => props.height};
  background: ${colors.header};
  width: 100%;
  color: white;
  padding: 0 15px;
`
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 56px;
  height: 56px;
`
const BackIcon = styled(Icon)`
  font-size: 24px;
  cursor: pointer;
`
const StyledTitle = styled.h2`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  color: white;
  font-weight: 400;
`
const Flex = styled.div`
  display: flex;
  align-items: center;
`
const UserImage = styled.div`
  height: 35px;
  width: 35px;
  background: gray;
  border-radius: 50%;
  display:flex;
  justify-content:center;
  align-items:center;
`
const StyledDropdown = styled(Dropdown)``
const StyledMenu = styled(Menu)``

const StyledMenuItem = styled(Menu.Item)`
  &&& {
    a {
      color: #111;
      &:hover {
        color: ${colors.themeColor}
      }
    }
  }
`

const StyledSelect = styled(Select)`
  &&&{
    width: 180px;
    margin-top: 2px;
    margin-right: 15px;
    .ant-select-selection--single{
    border-right-width: 0px !important ;
    border-top-style: none !important;
    border-radius: 4px !important;
    border-left-width: 0px !important;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : '#fff'};
    color: ${props => props.color ? props.color : '#000'};
    &:focus{
      border-right-width: 0px !important ;
      box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
     }
    &:hover{
      border-right-width: 0px !important;
     }
    }
  }
`

Head.Wrapper = Wrapper
Head.BackIcon = BackIcon
Head.Title = StyledTitle
Head.Flex = Flex
Head.UserImage = UserImage
Head.Dropdown = StyledDropdown
Head.Menu = StyledMenu
Head.Menu.Item = StyledMenuItem
Head.Select = StyledSelect
export default Head
