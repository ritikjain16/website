import styled from 'styled-components'
import { Icon } from 'antd'


const StyledHeader = styled.div`
    height: 104px;
    width: 360px;
    box-shadow: 0px 4px 2px #e9e9ea;
`
const TitleSection = styled.div`
    display: flex;
    padding-top: 24px;
`

const PreviousIcon = styled(Icon)`
    color: #34e4ea !important;
    padding-top: 5px;
    margin-left:16px;
`

const Title = styled.div`
    height: 24px;
    font-family: Nunito;
    font-size: 18px;
    color: #707070;
    margin-left: 12px;
    font-weight: bold;
`

const NavigationSection = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    padding-top: 30px;
`
const Chat = styled.div`
    color: #bfbfbf;
    height: 20px;
    width: 50%;
    font-family: Nunito;
    font-size: 16px;
    font-weight: bold;
    justify-content: center;
    display: flex;
`
const PQ = styled.div`
    color: #00ade6;
    width: 50%;
    height: 20px;
`

const PQText = styled.div`
    font-family: Nunito;
    font-size: 16px;
    font-weight: bold;    
    padding-left: 42px;
`

const UnderLine = styled.div`
    width: 163px;
    background-color: #00ade6;
    height: 2px;
    border-radius: 2px;
`

const ShareIcon = styled(Icon)`
    color: #34e4ea !important;
    margin-top: 2px;
    margin-left: 40px;

`

StyledHeader.PreviousIcon = PreviousIcon
StyledHeader.Title = Title
StyledHeader.TitleSection = TitleSection
StyledHeader.NavigationSection = NavigationSection
StyledHeader.Chat = Chat
StyledHeader.PQ = PQ
StyledHeader.PQText = PQText
StyledHeader.UnderLine = UnderLine
StyledHeader.ShareIcon = ShareIcon
export default StyledHeader
