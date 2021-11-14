import styled from 'styled-components'

const EmptySlotAssignModalStyle = styled.div`
    font-family: 'Inter' !important;
    height: 100%;
    width: 100%;
    margin: 0 auto;
`

const HeaderIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 45px;
    background: ${props => props.bgColor ? props.bgColor : '#fff'};
    border-radius: ${props => props.borderRadius ? props.borderRadius : '10px'};
`

const HeaderDetails = styled.div`
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    font-family: Inter;
`

const SecondaryText = styled.div`
    font-weight: 500;
    font-size: 13px;
    color: #333333;
    padding-bottom: 12px;
`

EmptySlotAssignModalStyle.HeaderIcon = HeaderIcon
EmptySlotAssignModalStyle.HeaderDetails = HeaderDetails
EmptySlotAssignModalStyle.SecondaryText = SecondaryText

export default EmptySlotAssignModalStyle

