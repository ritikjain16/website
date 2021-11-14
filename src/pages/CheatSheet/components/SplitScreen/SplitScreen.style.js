import styled from 'styled-components'

const Main = styled.div`
  display: flex;
  flex: 1;
`
const ScreenLeft = styled.div`
  flex: 1;
  background: #f6f6f6;
`
const ScreenRight = styled.div`
  flex: 1;
  background: #f6f6f6;
`

Main.ScreenLeft = ScreenLeft
Main.ScreenRight = ScreenRight
export default Main
