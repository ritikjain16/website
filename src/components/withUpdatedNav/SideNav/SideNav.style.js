import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Icon, Select } from 'antd'
import { TekieAmethyst } from '../../../constants/colors'

const Nav = styled.div`
  min-width: ${props => props.width};
  background: #FFFF;
  height: 100vh;
  padding: 12px 18px 0px 24px;
  font-family: 'Inter';
  z-index: 999;
  transition: all 350ms cubic-bezier(0.6, 0.05, 0.28, 0.91);
  
  @media screen and (max-width: 700px) {
    position: fixed;
    top: 0;
    left: 0;
    transform: ${props => props.isMobileSidebarOpened ? 'translateX(0%)' : 'translateX(-100%)'};
  }
`

const Backdrop = styled.div`
  @media screen and (max-width: 700px) {
    height: 100vh;
    width: 100vw;
    transition: all 350ms cubic-bezier(0.6, 0.05, 0.28, 0.91);
    position: fixed;
    display: ${props => props.isMobileSidebarOpened ? 'block' : 'none'};
    background: ${props => props.isMobileSidebarOpened ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)'};
    top: 0;
    left: 0;
    z-index: 99;
  }
`

const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => props.alignItems ? props.alignItems : 'center'};
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'center'};
`

const LogoContainer = styled(Link)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 70px;
  cursor: pointer;
  img {
    height: 32px;
    width: auto;
  }
`

const ProfileContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  flex-direction: row;
  font-weight: 540;
  font-size: 14px;
  align-items: center;
  width: 100%;
  transition: 0.3s all ease-in-out;
  cursor: pointer;
  padding: 8px 12px;
  margin: ${props => props.isAdminLoggedIn ? '4px 0px' : '4px 0px 18px'};;
  border-radius: 10px;
  color: ${props => props.isActive ? 'crimson' : '#000'};
  background: #F5F5F5;
  &&& {
    text-decoration: none;
  }
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  font-weight: 600;
  padding: 4px 12px;
  font-size: 16px;
  letter-spacing: .5px;
  white-space: nowrap;
  width: 150px;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
`

const UserImage = styled.div`
  user-select: none;
  height: 40px;
  width: 40px;
  background: #8C61CB;
  background-image: ${props => props.bgImage ? `url(${props.bgImage})` : ''};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
  border-radius: 8px;
  display:flex;
  justify-content:center;
  align-items:center;
`

const StyledIcon = styled(({ ...rest }) => <Icon {...rest} />)`
  transition: 0.3s all ease-in-out;
  font-size: 32px;
  margin-right: 12px;
`

const Divider = styled.div`
  padding: 6px 0px;
  border-bottom: 1.5px solid #EEEEEE;
  width: 95%;
  margin: auto;
`

const TextMuted = styled.div`
  font-size: 14px;
  font-weight: 540;
  color: #666666;
`

const MentorRating = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #666666;
  letter-spacing: 0px; 

  span {
    color: #F2C94C;
    font-size: 14px;
  }
`

const NoClasses = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: 540;
  color: #666666;
`

const NoClassesImage = styled.div`
  width: 100px;
  height: 100px;
`

const CustomSelect = styled((props) => <Select ref={props.refObj} {...props} />)`
  margin: 0px 0 12px !important;
  font-family: 'Inter';
  letter-spacing: 0px;
  color: #bfbfbf !important;
  .ant-select-selection {
      border: 1px solid #EEEEEE;
      box-sizing: border-box;
      border-radius: 8px;
  }
  .ant-select-selection__placeholder {
      font-family: 'Inter';
      letter-spacing: 0px;
  }
  .ant-select-selection:hover {
      border-color: ${TekieAmethyst} !important;
  }
  .ant-select-focused .ant-select-selection, .ant-select-selection:focus, .ant-select-selection:active {
    border-color: ${TekieAmethyst} !important;
    box-shadow: 0 0 0 2px rgba(140, 97, 203, 0.2) !important;
  }
  .ant-select-search .ant-select-search__field__wrap input {
    font-family: 'Inter' !important;
    letter-spacing: 0px !important;
    color: #bfbfbf !important;
  }
  .ant-select-open > .ant-select-selection {
    border-color: ${TekieAmethyst} !important;
    box-shadow: 0 0 0 2px rgba(140, 97, 203, 0.2) !important;
  }
`

Nav.Backdrop = Backdrop
Nav.LogoContainer = LogoContainer
Nav.FlexContainer = FlexContainer
Nav.ProfileContainer = ProfileContainer
Nav.UserDetails = UserDetails
Nav.UserImage = UserImage
Nav.Icon = StyledIcon
Nav.Divider = Divider
Nav.TextMuted = TextMuted
Nav.MentorRating = MentorRating
Nav.NoClasses = NoClasses
Nav.NoClassesImage = NoClassesImage
Nav.Select = CustomSelect
export default Nav
