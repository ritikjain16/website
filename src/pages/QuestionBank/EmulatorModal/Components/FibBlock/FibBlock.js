import React from 'react'
import PropTypes from 'prop-types'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import FibBlock from './FibBlock.style'
import codeTagParser from '../../../../../utils/CodeTagParser'

const FibBlockBody = ({ emulatorViewData, showAnswers }) => {
  const inputCodeStyles = {
    height: '44px',
    borderRadius: '3px',
    backgroundColor: '#013d4e',
    marginTop: '11px',
    marginBottom: '12px',
    marginHorizontal: 0,
    paddingVertical: '12px',
    paddingHorizontal: 0
  }
  const codeTagProps = {
    style: {
      fontFamily: 'monaco'
    }
  }
  const terminalStyles = {
    width: '328px',
    height: '196px',
    margin: 0,
    marginTop: '11px',
    paddingTop: 0,
    paddingHorizontal: 0
  }
  const terminalWithAnswersStyles = {
    display: 'inline',
    paddingTop: 0,
    paddingHorizontal: 0
  }

  const { statement, fibBlocksOptions, questionCodeSnippet } = emulatorViewData
  const code = decodeURIComponent(emulatorViewData.answerCodeSnippet)

  const getFibBlockAnswers = () => {
    const fibBlockAnswers = []
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

  const getAnswerSnippetWithAnswers = () => {
    if (showAnswers) {
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
        <FibBlock.AnswerSnippet>
          {answerSnippetWithOptions.map((answer, index) => {
              if (fibBlockOptionsOrder.includes(index)) {
                return (
                  <FibBlock.Answer>
                    {answer}
                  </FibBlock.Answer>
                )
              }
              return answer && (
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
            })}
        </FibBlock.AnswerSnippet>
      )
    }
    return code ? (
      <SyntaxHighlighter
        language='python'
        style={darcula}
        customStyle={terminalStyles}
        codeTagProps={codeTagProps}
        fontSize={14}
        fontFamily='Monaco'
        highlighter='prism'
      >
        {code}
      </SyntaxHighlighter>
    ) : <></>
  }

  const renderOptions = () => {
    if (showAnswers) {
      return fibBlocksOptions.map((option) => {
        if (option.correctPositions.length > 0) {
          return (
            <FibBlock.Block correctOption />
          )
        }
        return (
          <FibBlock.Block>
            <FibBlock.BlockText>{option.statement}</FibBlock.BlockText>
          </FibBlock.Block>
        )
      })
    }
    return fibBlocksOptions.map((option) =>
      (
        <FibBlock.Block>
          <FibBlock.BlockText>{option.statement}</FibBlock.BlockText>
        </FibBlock.Block>
      )
    )
  }

  return (
    <FibBlock>
      <FibBlock.Question>
        {codeTagParser(statement)}
      </FibBlock.Question>
      {questionCodeSnippet && (
        <SyntaxHighlighter
          language='python'
          style={darcula}
          customStyle={inputCodeStyles}
          codeTagProps={{ style: { marginHorizontal: 15, fontFamily: 'monaco' } }}
          fontSize={16}
          fontFamily='Monaco'
          highlighter='prism'
        >
          {decodeURIComponent(emulatorViewData.questionCodeSnippet)}
        </SyntaxHighlighter>
      )}
      {getAnswerSnippetWithAnswers()}
      <FibBlock.BlocksSection>
        {renderOptions()}
      </FibBlock.BlocksSection>
    </FibBlock>
  )
}

FibBlockBody.propTypes = {
  emulatorViewData: PropTypes.shape({}).isRequired,
  showAnswers: PropTypes.bool.isRequired
}

export default FibBlockBody
