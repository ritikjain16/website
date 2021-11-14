import styled from 'styled-components'

const QuestionContainer = styled.div`
    overflow-y: auto;
    height: fit-content;
    background: #F6F8F7;
    border: 1px dashed #282828;
    box-sizing: border-box;
    padding: 15px;
    position: relative;
    width: 100%;
    min-width: 250px;
    max-width: 400px;
    & h1, & h2, & h3, & h4, & h5, & h6, & p{
      margin: 0;
      margin-right: 10px;
    }
`
const Mcq = styled.div`
margin: 0 auto;
width: 90%;
display: flex;
flex-direction: column;
align-items: center;
text-align: center;
`
const QuestionStatement = styled.div`
    height: auto;
    min-height: 78px;
    width: 100%;
    margin-bottom: 20px;
    font-family: Nunito;
    font-size: 14px;
    font-style: normal;
    color: #504f4f;
    font-weight: 600;
    line-height: 1.4;
    padding-top: 24px;
`

const Option = styled.div`
    width: 100%;
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
    width: 100%;
    min-height: 196px;
    background-color: rgb(43, 43, 43);
    margin-top: 11px;
    overflow-x: scroll;
    overflow: hidden;
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

const Block = styled.div`
    border-radius: 10px;
    display: inline-block;
    height: 33px;
    min-width: 60px;
    background-color: ${props => props.correctOption ? '#f7efec' : '#1ac9e8'};
    align-items: center;
    justify-content: center;
    margin: 0 10px;
`

const BlockText = styled.div`
    padding-left: 10px;
    padding-right: 10px;
    font-family: Monaco;
    color: #fff;
    font-size: 16px;
`

const SliderContainer = styled.div`
display: flex;
overflow-x: hidden;
`

export {
  QuestionContainer,
  Option,
  Mcq,
  OptionText,
  QuestionStatement,
  BlocksSection,
  AnswerSnippet,
  Answer,
  BlockText,
  Block,
  SliderContainer,
}
