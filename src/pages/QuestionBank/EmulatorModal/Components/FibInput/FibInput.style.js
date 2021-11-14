import styled from 'styled-components'

const FibInput = styled.div`
   height: 424px;
   margin-right:16px;
   margin-left: 16px;
`
const Question = styled.div`
    height: auto;
    min-height: 78px;
    width: 328px;
    font-family: Nunito;
    font-weight: 600;
    font-size: 14px;
    font-style: normal;
    color: #504f4f;
    line-height: 1.4;
    padding-top: 24px;
`

const AnswerSnippet = styled.div`
    width: 328px;
    min-height: 196px;
    background-color: rgb(43, 43, 43);
    margin-top: 11px;
    padding: 8px;
`

const Option = styled.div`
    width: 328px;
    height: 42px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.97);
    border-style: solid;
    border-width: 1.2px;
    border-color: #aaacae;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
    font-weight: 600;
`

FibInput.Question = Question
FibInput.Option = Option
FibInput.AnswerSnippet = AnswerSnippet
export default FibInput
