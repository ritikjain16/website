import styled from 'styled-components'

const Mcq = styled.div`
   height: 424px;
   margin-right:16px;
   margin-left: 16px;
`
const QuestionStatement = styled.div`
    height: auto;
    min-height: 78px;
    width: 328px;
    font-family: Nunito;
    font-size: 14px;
    font-style: normal;
    color: #504f4f;
    font-weight: 600;
    line-height: 1.4;
    padding-top: 24px;
`

const Option = styled.div`
    width: 328px;
    height: 42px;
    border-radius: 3px;
    background-color: ${props => props.highlightOptions ? '#00ade6' : 'rgba(255, 255, 255, 0.97)'};
    border-style: solid;
    border-width: 1.2px;
    border-color: #aaacae;
    display: flex;
    justify-content: flex-start;
    padding-left: 16px;
    align-items: center;
    margin-bottom: 12px;
    box-shadow: 0px 1px 2px grey;
`

const OptionText = styled.div`
    font-family: Nunito;
    font-size: 14px;
    text-align: left;
    color: ${props => props.highlightOptions ? '#ffffff' : '#504f4f'};
    font-weight: 600;
`
const BlocklyContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`

const BlocklyItem = styled.div`
    width: 150px;
    height: 150px;
    border-radius: 12px;
    overflow: hidden;
    margin: 8px 4px;
    border: ${props => props.highlightOptions ? '4px solid #00ade6' : 'transparent'};
`

Mcq.QuestionStatement = QuestionStatement
Mcq.BlocklyContainer = BlocklyContainer
Mcq.BlocklyItem = BlocklyItem
Mcq.Option = Option
Mcq.OptionText = OptionText

export default Mcq
