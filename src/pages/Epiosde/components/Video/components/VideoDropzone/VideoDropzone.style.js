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
const VideoWrapper = styled.div`
    width: 42vw;
    min-width: 300px;
    min-height: 170px;
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
Main.Dropzone = StyledDropzone
Main.UploadIcon = UploadIcon
Main.UploadContainer = UploadContainer
Main.UploadText = UploadText
Main.VideoWrapper = VideoWrapper
export default Main
