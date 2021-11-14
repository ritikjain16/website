import styled, { keyframes } from 'styled-components'

const loadingWaveAnimation = keyframes`
  0% {
    opacity: .7;
  }
  25% {
    opacity: .45;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: .45;
  }
  100% {
    opacity: .7;
  }
`

const LoadingWave = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  background: #D9D9D9;
  animation: ${loadingWaveAnimation} 3s infinite cubic-bezier(.65, .05, .36, 1);
`

export default LoadingWave
