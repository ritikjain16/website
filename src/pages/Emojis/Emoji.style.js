import styled from 'styled-components'
import { Button } from 'antd'
import antdButtonColor from '../../utils/mixins/antdButtonColor'
import colors from '../../constants/colors'

const EmojiSticker = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`

const Emoji = styled.div`
  width: calc(50vw - 32px);
  background-color: #fff;
  padding-left: 40px;
  padding-right: 25px;
  height: calc(100vh - 56px);
  overflow: scroll;
`

const Sticker = styled.div`
  width: calc(50vw - 32px);
  background-color: #f6f6f6;
  padding-left: 40px;
  padding-right: 25px;
  height: calc(100vh - 56px);
  overflow: scroll;
`

const Title = styled.div`
  font-size: 32px;
  line-height: 1.09091;
  font-weight: 600;
  letter-spacing: -.002em;
  font-family: "Helvetica Neue","Helvetica","Arial",sans-serif;
  color: black;
  margin-top: 25px;
`

const StyledButton = styled(Button)`
  &&& {
    ${antdButtonColor(colors.subThemeColor)}
    margin-top: 25px;
  }
`

const SpaceBetweenRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const ListView = styled.div`  
  display: flex;
  width: 100%;
  flex-direction: row; 
  margin-top: 25px;
  flex-wrap: wrap;
`
const ImageContainer = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
`
const Label = styled.div`
  text-align: center;
`

const ActionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  justify-content: center;
`
const ActionWrapper = styled.div`
  flex: 1;
  display: flex;
  max-width: 50px;
  justify-content: center;
  padding-top: 3px;
  padding-bottom: 3px;
  cursor: pointer;
  &:hover {
    background-color: ${props => props.hoverColor ? props.hoverColor : '#f1f1f1'};
    border-radius: 15px;
  }
`


EmojiSticker.Emoji = Emoji
EmojiSticker.Sticker = Sticker
EmojiSticker.Title = Title
EmojiSticker.Button = StyledButton
EmojiSticker.SpaceBetweenRow = SpaceBetweenRow
EmojiSticker.ListView = ListView
EmojiSticker.ImageContainer = ImageContainer
EmojiSticker.Label = Label
EmojiSticker.ActionsContainer = ActionsContainer
EmojiSticker.ActionWrapper = ActionWrapper

export default EmojiSticker

