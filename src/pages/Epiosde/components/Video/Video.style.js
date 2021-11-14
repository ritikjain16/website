import styled from 'styled-components'
import { Button } from '../../../../components/StyledComponents'
import colors from '../../../../constants/colors'


const Main = styled.div`
width: 100%;
height:100%;
 `
const StyledButton = styled(Button)`
  &&& {
    border-radius: 3px;
    width: 8em;
    padding: 0.25em 0;
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 1em;
    margin-bottom: 1em
    color: white;
    max-height: 44px;
    &:disabled {
      color: ${colors.video.disable.color};
      border-color: ${colors.video.disable.color};
      background-color: ${colors.video.disable.background};
    }
  }
`
const DeleteButton = styled(StyledButton)`
  &&& {
    width: 8em;
    min-width: 120px;
    background-color: white;
    color: ${colors.deleteRed};
    border: 2px solid ${colors.deleteRed};
    paddding-left: 1em;
  }
`
const EditButton = styled(StyledButton)`
  &&& {
    width: 8em;
    min-width: 120px;
    background-color: white;
    color: ${colors.themeColor};
    border: 2px solid ${colors.themeColor};
  }
`
const ButtonsWrapper = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5em;
  min-height: 88px !important;
`

const TextSpan = styled.span`
  width: 57%;
  line-height: 84px;
  font-size: 20px;
  display: flex;
`

const FetchError = styled.div`
  text-align: center;
  color: ${colors.antdError};
  margin-top: 2em;
  font-size: 1.6em;
`

Main.ButtonsWrapper = ButtonsWrapper
Main.Button = StyledButton
Main.DeleteButton = DeleteButton
Main.EditButton = EditButton
Main.FetchError = FetchError
Main.TextSpan = TextSpan
export default Main
