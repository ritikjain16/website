import styled from 'styled-components'
import { darken } from 'polished'
import { Button, Icon } from 'antd'
import colors from '../../../../constants/colors'
import MainModal from '../../../../components/MainModal'

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

const StickerContainer = styled.div`
  width: 50%;
  height: 166px;
  background-color: #d5d5d5;
  border-radius: 2px;
  cursor: pointer;
  margin-bottom: 10px;
  &:hover {
    background-color: ${darken(0.1)('#d5d5d5')};
  }
`
const StickerPlaceholderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.4;
  font-size: 12px;
  font-weight: 700;
  color: black
`

const StickerWrapper = styled.div`
  padding: 5px;
  margin: 5px;
  border: 2px solid rgba(0, 0, 0, 0);
  cursor: pointer;
  ${props => props.active && `
    border: 2px solid #3298FD;
    border-radius: 5px;
    background-color: rgba(50,152,253, 0.3);
  `}
  &:hover {
    border: 2px solid #3298FD;
    border-radius: 5px;
    background-color: rgba(50,152,253, 0.3);
  }
`

const SelectedStickerOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: transparent;
  transition: 0.3s all ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center
`

const EditIcon = styled(Icon)`
  &&& {
    font-size: 40px;
    font-weight: 800;
    color: white;
    opacity: 0;
    transition: 0.3s all ease-in-out;
  }
`
const SelectedStickerContainer = styled.div`
  position: relative;
  display: inline-block;
  padding: 4px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  &:hover ${SelectedStickerOverlay} {
    background-color: rgba(0, 0, 0, 0.6);
  }
  &:hover ${EditIcon} {
    opacity: 1
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

const FormItemFlex = styled(MainModal.FormItem)`
  .ant-form-item-children {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
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
Main.FormItemFlex = FormItemFlex
Main.DeleteButton = DeleteButton
Main.StickerContainer = StickerContainer
Main.StickerWrapper = StickerWrapper
Main.SelectedStickerOverlay = SelectedStickerOverlay
Main.StickerPlaceholderWrapper = StickerPlaceholderWrapper
Main.SelectedStickerContainer = SelectedStickerContainer
Main.EditIcon = EditIcon
Main.EmojiWrapper = EmojiWrapper
Main.EmojiIcon = EmojiIcon
Main.ToolbarContainer = ToolbarContainer
Main.ImageContainer = ImageContainer

export default Main
