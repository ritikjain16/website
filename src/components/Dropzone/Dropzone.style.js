import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import { darken } from 'polished'
import colors from '../../constants/colors'

const StyledDropzone = styled(Dropzone)`
  position: relative;
  width: ${props => props.width ? props.width : '30%'};
  height: ${props => props.height ? props.height : '150px'};
  background: ${props => props.shouldImage ? 'transparent' : '#d5d5d5'};
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 10px;
  cursor: pointer;
  & input{
    width: 100%;
  }
  &:hover {
    background: ${props => props.shouldImage ? 'transparent' : darken(0.1)('#d5d5d5')};
  }
  &.active {
    background: ${props => props.shouldImage ? 'transparent' : darken(0.1)('#d5d5d5')};
  }
`
const UploadIcon = styled(Icon)`
  font-size: 40px;
  font-weight: 800;
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
`

const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("${props => props.imageUrl}");
  background-size: contain;
  background-repeat: no-repeat;
  transition: 0.2s all ease-in-out;
  &.blur {
    filter: blur(4px);
  }
`

const CloseImage = styled.div`
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: 10;
  display: flex;
  font-size: 18px;
  justify-content: center;
  align-items: center;
  font-weight: 800;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  color: ${colors.subThemeColor};
  box-shadow: -5px 4px 25px 12px rgba(46,61,73,0.1);
  transition: 0.2s all ease-in-out;
  &:hover {
    background: #f3f3f3;
  }
`

StyledDropzone.UploadIcon = UploadIcon
StyledDropzone.UploadContainer = UploadContainer
StyledDropzone.UploadText = UploadText
StyledDropzone.ImageContainer = ImageContainer
StyledDropzone.CloseImage = CloseImage
export default StyledDropzone
