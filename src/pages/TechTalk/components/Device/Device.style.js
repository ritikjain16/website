import styled, { css } from 'styled-components'

const Main = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #fceceb;
`
const Header = styled.div`
  width: 100%;
  height: 80px;
  background: #FDF0EF;
`
const Title = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  text-transform: uppercase;
  & > div:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 100%;
    font-size: 20px;
  }
  & > div:last-child {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: 600;
    margin-left: 5px;
    margin-top: 8px;
  }
`
const ProgressWrapper = styled.div`
  display: flex;
  justify-content: center;
  .ant-progress {
    width: 70%;
  }
  .ant-progress-bg {
    background-color: #4DAC72;
  }
  .ant-progress-inner {
    background-color: #E5DDE2;
  }
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 61px);
  padding: 0 20px;
  overflow: scroll;
`
const Statement = css`
  display: inline-block;
  padding: 10px;
  background: ${props => props.alignmentType === 'left' ? '#A6DBD4' : '#F39EA1'};
  border-radius: 5px;
  max-width: calc(100% - 60px);
  margin-bottom: 10px;
  align-self: ${props => props.alignmentType === 'left' ? 'flex-start' : 'flex-end'};
`
const Terminal = css`
  display: block;
  padding: 10px;
  width: 100%;
  background: #4A4A4A;
  border-radius: 5px;
  color: white;
  font-family: monospace;
  margin-bottom: 10px;
`
const Image = css`
  display: block;
  padding: 10px;
  background: ${props => props.alignmentType === 'left' ? '#A6DBD4' : '#F39EA1'};
  border-radius: 5px;
  width: calc(100% - 40px);
  min-height: 200px;
  margin-bottom: 10px;
  align-self: ${props => props.alignmentType === 'left' ? 'flex-start' : 'flex-end'};
`

const Sticker = css`
  display: inline-block;
  padding: 10px;
  align-self: ${props => props.alignmentType === 'left' ? 'flex-start' : 'flex-end'};
`
const ChatItem = styled.div`
  box-sizing: border-box;
  ${props => props.messageType === 'text' && Statement}
  ${props => props.messageType === 'image' && Image}
  ${props => props.messageType === 'terminal' && Terminal}
  ${props => props.messageType === 'sticker' && Sticker}
`
const ImageWrapper = styled.div`
  width: 100%;
  height: 180px;
  background: url("${props => props.source}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
`

Main.Header = Header
Main.Title = Title
Main.ProgressWrapper = ProgressWrapper
Main.Body = Body
Main.Statement = Statement
Main.Terminal = Terminal
Main.Image = Image
Main.ChatItem = ChatItem
Main.ImageWrapper = ImageWrapper

export default Main
