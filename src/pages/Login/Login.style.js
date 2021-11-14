import styled from 'styled-components'
import { rgba } from 'polished'
import colors from '../../constants/colors'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: ${colors.login.pageBG};
`
const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 512px;
  height: 650px;
  border-radius: 3px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  @media (max-width: 600px) {
    width: 100vw;
    height: 100vh;
  }
`
const Head = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 233px;
  overflow: hidden;
`
const CircleBG = styled.div`
  position: absolute;
  bottom: 0px;
  left: calc((-2208px + 512px) / 2);
  border-radius: 50%;
  background: ${colors.themeColor};
  width: 2208px;
  height: 2208px;
  @media (max-width: 600px) {
    left: calc((-2208px + 100vw) / 2);
  }
`
const LogoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
`
const AppText = styled.div`
  font-size: 24px;
  color: ${rgba('white', 0.9)};
  margin-top: 5px;
  font-weight: 200;
  letter-spacing: 3px;
`
const Body = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  flex: 1;
  width: 100%;
`

const NoLoginAccess = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  color: red;
  font-size: 16px;
  margin-bottom: 10px;
`

Card.Container = Container
Card.AppText = AppText
Card.LogoWrapper = LogoWrapper
Card.Body = Body
Card.CircleBG = CircleBG
Card.Head = Head
Card.NoLoginAccess = NoLoginAccess
export default Card
