import styled from 'styled-components'

const MessageContainer = styled.div`
    overflow-y: auto;
    height: 693px;
    background: #F6F8F7;
    border: 1px dashed #282828;
    box-sizing: border-box;
`

const MessageLeft = styled.div`
padding: 10px;
margin: 10px 5px;
background: #FFFFFF;
border-radius: 0px 20px 20px 20px;
width: 70%;
${props => props.sticker ? '' : `
& img{
    width: 80%;
    object-fit: contain;
}
`}
`

const MessageRight = styled(MessageLeft)`
color: white;
background: #00ADE6;
border-radius: 20px 0px 20px 20px;
margin-left: auto;
${props => props.sticker ? '' : `
& img{
    width: 80%;
    object-fit: contain;
}
`}
`

export {
  MessageContainer,
  MessageLeft,
  MessageRight
}
