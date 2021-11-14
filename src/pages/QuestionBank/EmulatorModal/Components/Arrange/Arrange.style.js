import styled from 'styled-components'

const Arrange = styled.div`
   height: 424px;
   margin-right:16px;
   margin-left: 16px;
`
const Question = styled.div`
    height: auto;
    min-height: 78px;
    width: 328px;
    font-family: Nunito;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    color: #504f4f;
    line-height: 1.4;
    padding-top: 24px;
`

const Option = styled.div`
    width: 328px;
    height: 42px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.97);
    border-style: solid;
    border-width: 0.4px;
    border-color: #aaacae;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`

const OptionText = styled.div`
    font-family: Nunito;
    font-size: 14px;
    text-align: left;
    color: #504f4f;
    font-weight: 600;
`

Arrange.Question = Question
Arrange.Option = Option
Arrange.OptionText = OptionText

export default Arrange
