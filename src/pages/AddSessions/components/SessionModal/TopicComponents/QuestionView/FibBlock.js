import { get } from 'lodash'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import CodeTagParser from '../../../../../../utils/CodeTagParser'
import {
  Answer, AnswerSnippet, Block,
  BlocksSection, BlockText, Mcq, QuestionStatement
} from './QuestionView.styles'

const FibBlock = ({ question, inputCodeStyles, isReordering }) => {
  const terminalWithAnswersStyles = {
    display: 'inline',
    paddingTop: 0,
    paddingHorizontal: 0
  }

  const codeTagProps = {
    style: {
      fontFamily: 'monaco'
    }
  }

  const getFibBlockAnswers = () => {
    const fibBlockAnswers = []
    const fibBlocksOptions = get(question, 'fibBlocksOptions')
    for (let index = 0; index < fibBlocksOptions.length; index += 1) {
      if (fibBlocksOptions[index].correctPositions.length > 0) {
        fibBlockAnswers.push(fibBlocksOptions[index])
      }
    }
    return fibBlockAnswers
  }

  const getSortedFibBlockAnswersJson = () => {
    const fibBlockAnswersOrderedJson = {}
    const ordersUsed = []
    const fibBlockAnswers = getFibBlockAnswers()
    for (let order = 1; order <= fibBlockAnswers.length; order += 1) {
      for (let index = 0; index < fibBlockAnswers.length; index += 1) {
        if (!ordersUsed.includes((fibBlockAnswers[index]).displayOrder)
            && (fibBlockAnswers[index]).correctPositions.includes(order)) {
          fibBlockAnswersOrderedJson[order] = fibBlockAnswers[index]
          ordersUsed.push((fibBlockAnswers[index]).displayOrder)
          break
        }
      }
    }
    return fibBlockAnswersOrderedJson
  }

  const renderOptions = () => {
    const fibBlocksOptions = get(question, 'fibBlocksOptions')
    return fibBlocksOptions.map((option) => {
      if (option.correctPositions.length > 0) {
        return (
          <Block correctOption />
        )
      }
      return (
        <Block>
          <BlockText>{option.statement}</BlockText>
        </Block>
      )
    })
  }

  const getAnswerSnippetWithAnswers = () => {
    const code = decodeURIComponent(get(question, 'answerCodeSnippet'))
    const answerSnippetList = code.split('___')
    const fibBlockAnswersOrderedJson = getSortedFibBlockAnswersJson()
    const startsWithBlank = code.indexOf('___') === 0
    const answerSnippetWithOptions = []
    const fibBlockOptionsOrder = []
    let optionsOrder = 1
    for (let index = 0; index < answerSnippetList.length; index += 1) {
      if (startsWithBlank && index === 0) {
        answerSnippetWithOptions.push(fibBlockAnswersOrderedJson[optionsOrder].statement)
        fibBlockOptionsOrder.push(index)
        optionsOrder += 1
      } else {
        answerSnippetWithOptions.push(answerSnippetList[index])
        if (optionsOrder <= Object.keys(fibBlockAnswersOrderedJson).length) {
          const fibBlockOptionsOrderLen = fibBlockOptionsOrder.length
          answerSnippetWithOptions.push(fibBlockAnswersOrderedJson[optionsOrder].statement)
          if (fibBlockOptionsOrderLen) {
            fibBlockOptionsOrder.push(fibBlockOptionsOrder[fibBlockOptionsOrderLen - 1] + 2)
          } else {
            fibBlockOptionsOrder.push(index + 1)
          }
          optionsOrder += 1
        }
      }
    }
    return (
      <AnswerSnippet>
        {answerSnippetWithOptions.map((answer, index) => {
          if (fibBlockOptionsOrder.includes(index)) {
            return (
              <Answer>
                {answer}
              </Answer>
            )
          }
          if (answer) {
            return (
              <SyntaxHighlighter
                language='python'
                style={darcula}
                customStyle={terminalWithAnswersStyles}
                codeTagProps={codeTagProps}
                fontSize={14}
                fontFamily='Monaco'
                highlighter='prism'
                searchWords={answerSnippetList}
              >
                {answer}
              </SyntaxHighlighter>
            )
          }
        })}
      </AnswerSnippet>
    )
  }
  return (
    <Mcq>
      <QuestionStatement>
        {CodeTagParser(get(question, 'statement'))}
      </QuestionStatement>
      {
        !isReordering && (
          <>
            {get(question, 'questionCodeSnippet') && (
            <SyntaxHighlighter
              language='python'
              style={darcula}
              customStyle={inputCodeStyles}
              codeTagProps={{ style: { marginHorizontal: 15, fontFamily: 'monaco' } }}
              fontSize={16}
              fontFamily='Monaco'
              highlighter='prism'
            >
              {decodeURIComponent(get(question, 'questionCodeSnippet'))}
            </SyntaxHighlighter>
            )}
            {getAnswerSnippetWithAnswers()}
            <BlocksSection>
              {renderOptions()}
            </BlocksSection>
            <QuestionStatement style={{ minHeight: 'auto' }}>
              Hint: {CodeTagParser(get(question, 'hint'))}
            </QuestionStatement>
          </>
        )
      }
    </Mcq>
  )
}

export default FibBlock
