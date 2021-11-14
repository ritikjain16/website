import styled from 'styled-components'


const StyledFooter = styled.div`
    height: ${props => props.showHelp ? '186px' : '112px'};
    width: 360px;
    margin: ${props => props.showHelp ? '-50px 0 0 0' : '30px 0 0 0'};
    box-shadow: 0px -4px 2px #e9e9ea;
`

const NumberSection = styled.div`
    width: 360px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    overflow: auto;
`

const HelpSection = styled.div`
    height: 76px;
    max-width: 350px;
    font-family: Nunito;
    font-size: 14px;
    font-style: normal;
    line-height: 1.4;
    padding: 10px 5px 0 5px;
    background-color: #ffffff;
`

const HelpExplanationOptionSection = styled.div`
    max-width: 350px;
    min-height: 40px;
    padding: 10px 5px 5px 5px;
    background-color: #ffffff;
`

const Number = styled.div`
    color: #aaacae;
    height: 18px;
    font-family: Nunito;
    font-size: 14px;
    font-weight: bold;
`

const NumberText = styled.div`
    font-family: Nunito;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    margin: 0 5px;
    :hover {
        cursor: pointer;
    }
`

const HelpText = styled.div`
    font-family: Nunito;
    font-size: 14px;
    display: flex;
    justify-content: center;
`

const ButtonSection = styled.div`
    height: 76px;
    width: 360px;
    display: flex;
    align-items: center;
    justify-content: space-around;
`

const HelpButton = styled.div`
    width: 76px;
    height: 42.9px;
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    border-color: #34e4ea;
    background-color: ${props => props.showHelp ? '#00ade6' : '#ffffff'};
    display: flex;
    color: ${props => props.showHelp ? '#ffffff' : '#34e4ea'};
    justify-content: center;
    align-items: center;
    font-family: Nunito;
    font-size: 18px;
    font-weight: 500;
    :hover {
        cursor: pointer;
    }
`

const CheckButton = styled.div`
    width: 159px;
    height: 42.9px;
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    border-color: #34e4ea;
    background-color: ${props => props.showAnswer ? '#00ade6' : '#ffffff'};
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.showAnswer ? '#ffffff' : '#34e4ea'};
    font-family: Nunito;
    font-weight: 500;
    font-size: 18px;
    :hover {
        cursor: pointer;
    }
`

const Underline = styled.div`
    width: 24px;
    height: 2px;
    background-color: #00ade6;
`

const Options = styled.div`
    display: inline;
    padding: 0 10px 0 10px;
    font-family: Nunito;
    font-weight: 500;
    font-size: 15px;
    color: ${props => props.highlightOption ? '#34e4ea' : '#000000'};
    border-bottom: ${props => props.highlightOption ? '2px solid' : ''};
    :hover {cursor: ${props => props.activateHover ? 'pointer' : ''};}
`


StyledFooter.Number = Number
StyledFooter.NumberSection = NumberSection
StyledFooter.ButtonSection = ButtonSection
StyledFooter.HelpButton = HelpButton
StyledFooter.CheckButton = CheckButton
StyledFooter.Underline = Underline
StyledFooter.NumberText = NumberText
StyledFooter.HelpText = HelpText
StyledFooter.HelpSection = HelpSection
StyledFooter.HelpExplanationOptionSection = HelpExplanationOptionSection
StyledFooter.Options = Options
export default StyledFooter
