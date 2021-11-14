import styled from 'styled-components'

const Main = styled.div`
  display: flex;
  height: calc(100vh - ${props => props.headerHeight} - 100px);
  background: red;
`
export default Main
