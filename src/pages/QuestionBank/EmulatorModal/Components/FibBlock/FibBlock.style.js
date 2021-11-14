import styled from 'styled-components'

const FibBlock = styled.div`
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
    color: #504f4f;
    line-height: 1.4;
    font-weight: 600;
    padding-top: 24px;
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

const Block = styled.div`
    border-radius: 10px;
    display: inline-block;
    height: 33px;
    min-width: 60px;
    background-color: ${props => props.correctOption ? '#f7efec' : '#1ac9e8'};
    align-items: center;
    justify-content: center;
`

const BlockText = styled.div`
    padding-left: 10px;
    padding-right: 10px;
    font-family: Monaco;
    color: #fff;
    font-size: 16px;
`

const BlocksSection = styled.div`
    display: flex;
    height: 74px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 24px;
    flex-wrap: wrap;
    position: relative;
`

const AnswerSnippet = styled.div`
    width: 328px;
    min-height: 196px;
    background-color: rgb(43, 43, 43);
    margin-top: 11px;
    overflow-x: scroll;
    overflow: hidden;
    padding: 8px;
`

const Answer = styled.div`
    min-height: 18px;
    padding: 0 3px 0 3px;
    border: solid 1px;
    border-color: rgb(186, 186, 186);
    border-radius: 4px;
    display: inline-block;
    color: rgb(186, 186, 186);
`

FibBlock.Question = Question
FibBlock.Option = Option
FibBlock.Block = Block
FibBlock.BlockText = BlockText
FibBlock.BlocksSection = BlocksSection
FibBlock.AnswerSnippet = AnswerSnippet
FibBlock.Answer = Answer

export default FibBlock
