import styled from 'styled-components'
import { Select } from 'antd'

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center
  align-items: center;
  width: 100%;
  height: 100%;
`

const LoginTypeCardsContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  margin: 0 auto;
  position: relative;
  top: 150px;
`

const LoginTypeCard = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 180px;
  height: 180px;
  margin: 20px;
`
const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 135px;
    width: 100%;
    background: radial-gradient(#440044, #880088);
    ${LoginTypeCard}:hover & {
    outline: 4px solid #ae8f73;
    }
`

const TextContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    height: 30px;
    width: 100%;
`

const Text = styled.div`
  font-size: 24px;
  color: #122b4a;
  font-weight: 500;
  letter-spacing: 3px;
  ${LoginTypeCard}:hover & {
    color: #ae8f73;
  }
`

const StyledDropdown = styled(Select)`
  &&&{
    width: 180px;
    margin-top: 30px;
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
  top: 150px;
`

LoginTypeCard.MainContainer = MainContainer
LoginTypeCard.LoginTypeCardsContainer = LoginTypeCardsContainer
LoginTypeCard.Text = Text
LoginTypeCard.TextContainer = TextContainer
LoginTypeCard.IconContainer = IconContainer
LoginTypeCard.Dropdown = StyledDropdown

export default LoginTypeCard
