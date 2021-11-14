import styled from 'styled-components'
import { Select } from 'antd'
import { Link } from 'react-router-dom'
import { TekieAmethyst } from '../../constants/colors'

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center
  align-items: center;
  width: 100%;
  height: 100%;
`

const UserDashboardStylesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  margin: 0 auto;
  position: relative;
  top: 150px;
`

const UserDashboardStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 180px;
  margin: 20px;
  transition: all .3s;
`

const IconContainer = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 135px;
    width: 100%;
    background: radial-gradient(#440044, #880088);
    ${UserDashboardStyle}:hover & {
    outline: 4px solid #ae8f73;
    }
`

const BlockContainer = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 135px;
    width: 100%;
    border-radius: 8px;
    background: #F7F0FF;
    transition: all .3s;
    position: relative;
    ${UserDashboardStyle}:hover & {
      transition: all .3s;
      box-shadow: 2px 2px 3px #E6D8FB;
    }
`

const TextContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    height: 30px;
    width: 100%;
    transition: all .3s;
`

const Text = styled.div`
  font-size: 18px;
  color: #122b4a;
  text-align:center;
  font-weight: 500;
  letter-spacing: 3px;
  ${UserDashboardStyle}:hover & {
    color: #ae8f73;
  }
`

const Label = styled.div`
  font-family: 'Inter';
  font-size: 16px;
  color: #122b4a;
  text-align:center;
  font-weight: 500;
  letter-spacing: .5px;
  ${UserDashboardStyle}:hover & {
    color: ${TekieAmethyst};
    transition: all .3s; 
  }
`

const StyledDropdown = styled(Select)`
  &&&{
    width: 200px;
    .ant-select-selection--single{
    border-right-width: 0px !important ;
    border-top-style: none !important;
    border-radius: 0px !important;
    border-left-width: 0px !important;
    &:focus{
      border-right-width: 0px !important ;
      box-shadow: 0 0 0 0px rgba(0, 166, 255,0.2);
     }
    &:hover{
      border-right-width: 0px !important;
     }
    }
  }
  position: relative;
`

const BetaTag = styled.div`
  padding: 4px 10px;
  border-radius: 18px;
  font-weight: 600;
  font-family: 'Inter';
  font-size: 12px;
  letter-spacing: .5px;
  background: ${TekieAmethyst};
  border: 4px solid #FFF;
  color: #FAF6FF;
  position: absolute;
  top: 12px;
  right: -25px;
  transition: all .3s;
  
  ${UserDashboardStyle}:hover & {
    transition: all .3s;
    right: -22px;
  }
`


UserDashboardStyle.MainContainer = MainContainer
UserDashboardStyle.UserDashboardStylesContainer = UserDashboardStylesContainer
UserDashboardStyle.Text = Text
UserDashboardStyle.TextContainer = TextContainer
UserDashboardStyle.IconContainer = IconContainer
UserDashboardStyle.Dropdown = StyledDropdown
UserDashboardStyle.BlockContainer = BlockContainer
UserDashboardStyle.Label = Label
UserDashboardStyle.BetaTag = BetaTag

export default UserDashboardStyle
