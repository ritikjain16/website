import styled from 'styled-components'
import { Button } from '../../../../components/StyledComponents'
import colors from '../../../../constants/colors'

const Main = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: left;
  max-height: 50px;
`
const loWrapper = styled.div`
  width: 100%;
  height: 100%;
`


const StyledButton = styled(Button)`
  &&& {
    border-radius: 3px;
    width: 8em;
    padding: 0.25em 0;
    margin-top: 1em;
    margin-left: 1em;
    margin-right: 1em;
    margin-bottom: 1em;
    background-color: #e99a54;
    color: white;
    &:disabled {
      color: ${colors.video.disable.color};
      border-color: ${colors.video.disable.color};
      background-color: white;
    }
     min-height: 40px;
  }
`
const DeleteButton = styled(StyledButton)`
  &&& {
    width: 8em;
    min-width: 120px;
    background-color: white;
    color: ${colors.deleteRed};
    background-color: white !important;
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
  justify-content: space-between;
  margin-top: 0.5em;
  min-height: 75px !important;
  overflow: hidden;
  flex-wrap: wrap;
`

const TextSpan = styled.span`
  width: 47vw;
  line-height: 64px;
  font-size: 20px;
  display: flex;
`
Main.ButtonsWrapper = ButtonsWrapper
Main.EditButton = EditButton
Main.DeleteButton = DeleteButton
Main.Button = StyledButton
Main.loWrapper = loWrapper
Main.TextSpan = TextSpan

export default Main
