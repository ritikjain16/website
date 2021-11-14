import styled from 'styled-components'
import { Icon } from 'antd'

const Main = styled.div`
  display: ${props => props.isFullScreenMode ? 'block' : 'none'};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  z-index: 100;
`
const NavBarWrapper = styled.div`
  height: 60px;
  width: 100%;
  padding: 0 40px;
`
const NavBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`
const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 30px;
  & > * {
    margin-left: 15px;
  }
`
const StyledIcon = styled(Icon)`
  position: relative;
  left: 0px;
  transition: 0.3s all ease-in-out;
`
const BackButton = styled.div`
  cursor: pointer;
  transition: 0.3s all ease-in-out;
  &:hover ${StyledIcon} {
    left: -5px;
  }
`
const Body = styled.div`
  display: flex;
  justify-content: center;
  height: calc(100% - 60px);
  width: 100%;
`
const DragContainer = styled.div`
  display: flex;
  justify-content: center;
  width: calc(100% - 60px);
  padding-top: 50px;
  height: 100%;
`
const ResizeContainer = styled.div`
  background-color: #29e;
  color: white;
  font-size: 20px;
  font-family: sans-serif;
  border-radius: 8px;
  padding: 20px;
  margin: 30px 20px;
  touch-action: none;
  width: 120px;
  box-sizing: border-box;
`
const CancelButton = styled(BackButton)`
  &:hover {
    transform: scale(1.1);
    ${StyledIcon} {
      left: 0px;
    }
  }
`

Main.BackButton = BackButton
Main.NavBar = NavBar
Main.NavBarWrapper = NavBarWrapper
Main.Icon = StyledIcon
Main.Body = Body
Main.DragContainer = DragContainer
Main.ResizeContainer = ResizeContainer
Main.ButtonsContainer = ButtonsContainer
Main.CancelButton = CancelButton
export default Main
