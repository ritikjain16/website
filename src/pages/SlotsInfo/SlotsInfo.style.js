import styled from 'styled-components'

const SlotsInfoStyle = styled.div`
  display: flex;
  width: 100%;
`

const SlotCount = styled.div`
    margin-left: 5px;
    font-family: Nunito;
    color: ${props => props.color ? props.color : 'rgba(0, 0, 0, 0.55)'};
`

const SubInfoNode = styled.div`
    display: flex;
    align-items: center;
    justify-content: ${props => props.big ? 'flex-start' : 'center'};
    height: 100%;
    padding: 0px !important;
    width: ${props => props.big ? '108px' : '54px'};
    border-right: ${props => props.big ? '1px solid #ada5a5' : 'none'};
    font-size: 13px !important;
    font-weight: 600 !important;
`

const InfoNode = styled.div`
    display: flex;
    flex-direction: row;
    font-size: ${props => props.header ? '13px' : '14px'};
    align-items: center;
    justify-content: ${props => !props.report ? 'center' : 'flex-start !important'};
    height: 30px;
    border-right: ${props => props.index !== 3 ? '1px solid #ada5a5' : 'none'};
    border-top: ${props => props.header ? '1px solid #ada5a5' : 'none'};
    width: ${props => !props.report ? '54px' : '100%'};
    padding: 0px;
    background-color: ${props => props.colored ? props.backgroundColor : 'none'};
    &:hover {
        opacity: ${props => !props.disableHover ? '0.9' : '1'};
        cursor: ${props => !props.disableHover ? 'pointer' : 'default'};
        background-color: ${props => !props.disableHover ? 'rgba(0, 0, 0, 0.1)' : 'none'}
    }
`

const StyledButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${props => props.height ? props.height : '30px'};
    background-color: ${props => props.refresh ? 'rgba(196, 248, 255, 1)' : 'rgba(232, 247, 97, 1)'};
    font-family: Nunito;
    font-size: ${props => props.fontSize ? props.fontSize : '16px'};
    width: ${props => props.width ? props.width : '80px'};
    font-weight: bold;
    border-radius: 4px;
    min-width: fit-content;
    padding: ${props => props.padding ? props.padding : '0'};
    margin-left: ${props => props.marginLeft ? props.marginLeft : '0'};
    margin-top: ${props => props.marginTop ? props.marginTop : '0'};
    color: ${props => props.refresh ? 'rgba(136, 85, 85, 0.9)' : '#885555'};
    &:hover {
        cursor: ${props => props.allowHover ? 'pointer' : 'not-allowed'};
        background-color: ${props => props.hoverColor ? props.hoverColor : 'rgba(232, 247, 97, 0.7)'};
        font-size: ${props => props.hoverFontSize ? props.hoverFontSize : '17px'};
    }
    &:active {
        font-size: 16px;
    }
`
const StyledIndicator = styled.div`
height: 15px;
width: 15px;
background-color: #eedfff;
margin-right: 10px;
`
const StatusBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 27px;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : '#fff'};
    font-family: Nunito;
    font-size: 12px;
    width: ${props => props.width ? props.width : '100px'};
    font-weight: 600;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: rgba(0, 0, 0, 0.4);
    &:hover {
        cursor: ${props => props.hoverCursor ? props.hoverCursor : 'default'};
        background-color: ${props => props.hoverBackgroundColor ? props.hoverBackgroundColor : '#fff'};
    }
`

SlotsInfoStyle.SlotCount = SlotCount
SlotsInfoStyle.InfoNode = InfoNode
SlotsInfoStyle.StyledButton = StyledButton
SlotsInfoStyle.SubInfoNode = SubInfoNode
SlotsInfoStyle.StatusBox = StatusBox
SlotsInfoStyle.StyledIndicator = StyledIndicator

export default SlotsInfoStyle
