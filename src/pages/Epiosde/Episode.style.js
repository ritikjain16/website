import styled from 'styled-components'
import colors from '../../constants/colors'
import { Button } from '../../components/StyledComponents'

const Main = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: center;
`

const FirstSection = styled.div`
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: center;
`

const CommonDropzoneDiv = styled.div`
  width: 44vw;
  display: flex;
  justify-content: left;
  min-width: 300px;
  max-height: 540px;
`
const FirstDropzoneDiv = styled.div`
  width: 100%;
  height: 100%;
  padding: 1em;
  background: ${colors.video.background};
`

const SecondDropzoneDiv = styled.div`
  width: 100%;
  height: 100%;
  padding: 3em;
  background: white;
`

const LODiv = styled.div`
  width: 88vw;
  display: flex;
  justify-content: left;
  padding: 3em;
  min-width: 300px;
  background: white;
  padding-bottom : 1em;
  background: ${colors.video.background};
`

const PublishSection = styled.div`
  width: 88%;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 100px
`

const ButtonsWrapper = styled.div`
  width: 100%;
  height: 20%;
  display: flex;
  justify-content: space-between;
  margin-top: 0.5em;
  min-height: 75px;
  overflow: hidden;
  flex-wrap: wrap;
`

const StatusSpan = styled.div`
  width: 10vw;
  line-height: 84px;
  font-size: 20px;
  display: flex;
`

const InnerStatusSpan = styled.div`
  width: 10vw;
  font-size: 20px;
  padding-top: 38px;
  padding-left: 1vw;
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
const StatusButton = styled(StyledButton)`
  &&& {
    width: 8em;
    min-width: 120px;
    background-color: white;
    color: ${colors.deleteRed};
    border: 2px solid ${colors.deleteRed};
    paddding-left: 1em;
    min-height: 40px;
  }
`

Main.CommonDropzoneDiv = CommonDropzoneDiv
Main.FirstDropzoneDiv = FirstDropzoneDiv
Main.SecondDropzoneDiv = SecondDropzoneDiv
Main.FirstSection = FirstSection
Main.LODiv = LODiv
Main.ButtonsWrapper = ButtonsWrapper
Main.StatusSpan = StatusSpan
Main.InnerStatusSpan = InnerStatusSpan
Main.StatusButton = StatusButton
Main.PublishSection = PublishSection

export default Main
