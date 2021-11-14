import styled from 'styled-components'

export const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const Card = styled.div`
  box-shadow: 0px 0px 25px 0 rgba(46, 61, 73, 0.1);
  border-radius: 10px;
  width: 600px;
  height: 500px;
  padding: 20px;
  @media screen and (max-width: 630px) {
    width: 100%;
    height: 100%;
  }
`
export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

