import styled from 'styled-components'

const StyledText = styled.span`
    font-family: Nunito;
    font-size: 14px;
    font-style: normal;
    color: #504f4f;
    line-height: 1.4;
`

const BoldText = styled.span`
    font-family: Nunito;
    font-size: 14px;
    font-style: normal;
    color: #504f4f;
    line-height: 1.4;
`
const BlockText = styled.span`
    background-color: rgba(26, 201, 232, 0.16);
    font-family: Nunito;
    font-size: 14px;
    font-style: normal;
    color: #504f4f;
    line-height: 1.4;
`

StyledText.BoldText = BoldText
StyledText.BlockText = BlockText

export default StyledText
