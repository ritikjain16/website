import styled from 'styled-components'

const Screen = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`
const SideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - ${props => props.sideNavWidth});
  height: 100%;

  @media screen and (max-width: 700px) {
    width: 100%;
  }
`
const HambugerMenu = styled.div`
  @media screen and (max-width: 700px) {
    width: fit-content;
    position: absolute;
    margin: 6px 0px;

    & > div {
      display: block;
      width: 28px;
      height: 4px;
      margin-bottom: 4px;
      position: relative; 
      background: #555;
      border-radius: 20px;
      z-index: 99;
      transform-origin: 4px 0px;     
      transition: transform 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                  background 0.5s cubic-bezier(0.77,0.2,0.05,1.0),
                  opacity 0.55s ease;
    }
  }
`

const Main = styled.div`
  flex: 1;
  width: 100%;
  overflow: scroll;
  background-color: #F4F4F4;
  padding: ${props => props.noPadding ? '0px' : '15px'};
`
Screen.SideWrapper = SideWrapper
Screen.Main = Main
Screen.HambugerMenu = HambugerMenu
export default Screen
