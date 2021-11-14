import styled from 'styled-components'

const PreHeaderText = styled.div`
font-family: 'Inter';
color: #111111;
margin: 0px 8px;
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 20px;
display: flex;
align-items: center;
color: #111111;
`


const NotAssignedModalStyle = styled.div`
`

const Header = styled.div`
    width: auto;
    margin: 0px;
    background: ${props => props.bgColor ? props.bgColor : '#FAF7FF'};
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 12px;
    @media screen and (max-width: 700px) {
        padding: 8px;
    }
`

const ModalBox = styled.div`
    font-family: 'Inter';
    z-index: 9999;
    max-width: 550px;
    position: absolute;
    top: 50%;
    left: 50%;
    background: #FFFFFF;
    box-shadow: 0px 6px 48px rgba(51, 51, 51, 0.24);
    border-radius: 16px;
    transition: opacity 200ms ease-in-out, transform 300ms ease-in-out, visibility .2s cubic-bezier(0.4,0.0,0.2,1);
    visibility: ${props => props.visible ? 'visible' : 'hidden'};
    opacity: ${props => props.visible ? 1 : 0};
    transform: ${props => props.visible ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(.8)'};
    overflow: hidden;
    box-sizing: border-box;
    font-family: 'Inter' !important;
    width: 90%;
    max-width: 530px;
    @media screen and (max-width: 700px) {
        height: 90%;
    }
`

const NotAssignedDetail = styled.div`
    display: flex;
    justify-content: ${props => props.justify ? props.justify : 'space-between'};
    align-items: center;
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #666666;
    width: 100%;
    ${props => props.padding ? `padding-left: 10px;
    @media screen and (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        & .action-buttons{
            margin-top: 10px;
        }
    }
    ` : `
    height: 100%;
    `}
`

const EditText = styled.div`
font-family: Inter;
font-style: normal;
font-weight: 500;
font-size: 12px;
line-height: 18px;
display: flex;
align-items: center;
color: #8C61CB;
flex: none;
order: 0;
flex-grow: 0;
margin: 0px 0px;
padding: 2px;
border-bottom: 1.7px dashed #8C61CB;
cursor: ${props => props.cursor};
`

NotAssignedModalStyle.PreHeaderText = PreHeaderText
NotAssignedModalStyle.Header = Header
NotAssignedModalStyle.NotAssignedDetail = NotAssignedDetail
NotAssignedModalStyle.ModalBox = ModalBox
NotAssignedModalStyle.Text = Text
NotAssignedModalStyle.EditText = EditText

export default NotAssignedModalStyle
