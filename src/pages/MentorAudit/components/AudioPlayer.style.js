import styled from 'styled-components'
import { Radio } from 'antd'

const AudioPlayerStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    background-color: #828282;
    height: 120px;
    width: 100%;
`
const AudioControls = styled.div`
flex-grow: 1;
margin: 0 20px;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

const PlayerButton = styled.button`
width: fit-content;
margin-bottom: 15px;
background-color: transparent;
border: none;

&:focus {
    outline: none;
}
&:hover {
    cursor: pointer;
    svg {
    color: orange;
    }
}

svg {
    font-size: 4em;
    color: white;
}`

const AudioBar = styled.div`
user-select: none;
width: 100%;
display: flex;
align-items: center;

.bar__time {
color: white;
font-size: 16px;
}
`

const AudioBarProgress = styled.div`
flex: 1;
border-radius: 5px;
margin: 0 20px;
height: 10px;
display: flex;
align-items: center;
cursor: pointer;

.bar__progress__knob {
position: relative;
height: 16px;
width: 16px;
border: 1.5px solid white;
border-radius: 50%;
background-color: orange;
}`

const StyledRadio = styled(Radio)`
  & .ant-radio-inner{
      border-radius: 3px;
  }

  & .ant-radio-checked .ant-radio-inner {
      border-color: ${props => props.color};
      background: ${props => props.color};
  }

  & .ant-radio-checked .ant-radio-inner::after {
    position: absolute;
    display: table;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: rotate(45deg) scale(1) translate(-50%, -50%);
    -ms-transform: rotate(45deg) scale(1) translate(-50%, -50%);
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    -webkit-transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    content: ' ';
    }

  & .ant-radio-inner::after{
      top: 50%;
    left: 22%;
    display: table;
    width: 5.71428571px;
    height: 9.14285714px;
    border: 2px solid #fff;
    border-radius: 1px;
    border-top: 0;
    border-left: 0;
    background-color: ${props => props.color};
    -webkit-transform: rotate(45deg) scale(0) translate(-50%, -50%);
    -ms-transform: rotate(45deg) scale(0) translate(-50%, -50%);
    transform: rotate(45deg) scale(0) translate(-50%, -50%);
    opacity: 0;
    -webkit-transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
    transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
    content: ' ';
  }
`

const StyledInputLabel = styled.label``

const StyledInput = styled.input``

AudioPlayerStyle.StyledRadio = StyledRadio
AudioPlayerStyle.AudioControls = AudioControls
AudioPlayerStyle.StyledInputLabel = StyledInputLabel
AudioPlayerStyle.PlayerButton = PlayerButton
AudioPlayerStyle.AudioBar = AudioBar
AudioPlayerStyle.StyledInput = StyledInput
AudioPlayerStyle.AudioBarProgress = AudioBarProgress

export default AudioPlayerStyle
