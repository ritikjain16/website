import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { darken } from 'polished'
import { Icon } from 'antd'
import colors from '../../../../../../constants/colors'

const Main = styled.div`
  width: 100%;
  height: 81%;
  display: flex;
`
const SubtitleWrapper = styled.div`
    width: 42vw;
    min-width: 300px;
    min-height: 370px;
    overflow: ${props => props.shouldSubtitle ? 'auto' : 'none'};
    max-height: 412px;
`

const UploadIcon = styled(Icon)`
  font-size: 64px;
  font-weight: 800;
`
const StyledDropzone = styled(Dropzone)`
  position: relative;
  width: 100%;
  height: 100%;
  background: ${props => props.shouldImage ? 'transparent' : colors.video.dropzoneBG};
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background: ${props => props.shouldImage ? 'transparent' : darken(0.1)(colors.video.dropzoneBG)};
  }
  &.active {
    background: ${props => props.shouldImage ? 'transparent' : darken(0.1)(colors.video.dropzoneBG)};
  }
`
const UploadContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 12px;
  display: flex;
  color: black;
  opacity: 0.4;
  font-weight: 700;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  transition: 0.2s all ease-in-out;
  ${props => props.shouldImage && `
    opacity: 0;
    &:hover {
      opacity: 0.4;
      background: white;
    }
  `}
`
const UploadText = styled.div`
  margin-top: 10px;
  font-size: 20px;
`
const SubtitleActiveDiv = styled.div`
  word-wrap: break-word
`

const Pre = styled.pre`
      padding: 1em;
      background: #ffffff;
`

const SubtitleTextButton = styled.button`
    background-color: transparent !important;
    border: none !important;
    padding: 0px !important;
    display: flex;
    width: 100% !important;
    cursor: pointer !important;
    position: relative !important;
    margin-bottom: 4px;
    text-align: left !important;
    outline: none;
`

const SubtitleTimeSpan = styled.span`
    font-family: inherit !important;
    font-weight: bold !important;
    display: inline-block !important;
    padding-left: 8px !important;
    color: ${colors.video.timeSpanColor};
`

const SubtitleTextSpan = styled.span`
    display: inline-block !important;
    margin-left: 10px;
`

const SubtitleUl = styled.ul`
    overflow-y: scroll !important;
    position: relative !important;
    -webkit-overflow-scrolling: touch !important;
    overflow: auto
`

Main.Dropzone = StyledDropzone
Main.UploadIcon = UploadIcon
Main.UploadContainer = UploadContainer
Main.UploadText = UploadText
Main.SubtitleWrapper = SubtitleWrapper
Main.SubtitleActiveDiv = SubtitleActiveDiv
Main.Pre = Pre
Main.SubtitleUl = SubtitleUl
Main.SubtitleTextButton = SubtitleTextButton
Main.SubtitleTimeSpan = SubtitleTimeSpan
Main.SubtitleTextSpan = SubtitleTextSpan
export default Main
