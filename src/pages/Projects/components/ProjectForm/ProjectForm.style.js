import styled from 'styled-components'
import { Button, Icon } from 'antd'
import colors from '../../../../constants/colors'

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  overflow: scroll;
  position: relative;
`
const FormModal = styled.div`
  background: white;
  margin-top: 30px;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
  &:last-child {
    margin-bottom: 20px;
  }
`
const FormHeading = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 40px;
  border-bottom: 1px solid #e8e8e8;
  font-weight: 600;
  font-size: 15px;
`
const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  width: 100%;
  height: 40px;
  border-top: 1px solid #e8e8e8;
`
const FormWrapper = styled.div`
  margin-top: 10px;
  width: 100%;
  padding: 0 20px;
`

const DeleteButton = styled(Button)`
  &&& {
    color: ${colors.deleteRed};
    border: 2px solid ${colors.deleteRed};
    margin-right: 10px;
    &:disabled {
      color: ${colors.video.disable.color};
      border-color: ${colors.video.disable.color};
      background-color: ${colors.video.disable.background};
    }
  }
`

const EmojiIcon = styled(Icon)`
  &&& {
    font-size: 24px;
    margin-right: 10px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.4);
    transition: 0.3s all ease-in-out;
    cursor: pointer;
    align-self: flex-start;
    &:hover {
      color: rgba(0, 0, 0, 0.65);
    }
  }
`

const EmojiWrapper = styled.div`
  background-color: transparent;
  transition: 0.2s all ease-in-out;
  padding: 3px;
  cursor: pointer;
  border-radius: 10px;
  align-self: flex-start;
  &:hover {
    background-color: #e9e9ef;
  }
`

const ToolbarContainer = styled.div`
  width: 30px;
  height: 30px;
  background: red;
`
const ImageContainer = styled.div`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  background: url("${props => props.imageUrl}");
  background-size: contain;
  background-repeat: no-repeat;
  transition: 0.2s all ease-in-out;
  &.blur {
    filter: blur(4px);
    background-repeat: repeat;
  }
`

Main.FormModal = FormModal
Main.FormHeading = FormHeading
Main.FormWrapper = FormWrapper
Main.FormFooter = FormFooter
Main.DeleteButton = DeleteButton
Main.EmojiWrapper = EmojiWrapper
Main.EmojiIcon = EmojiIcon
Main.ToolbarContainer = ToolbarContainer
Main.ImageContainer = ImageContainer

export default Main
