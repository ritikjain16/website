import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import FibInput from './FibInput.style'
import codeTagParser from '../../../../../utils/CodeTagParser'

const FibInputBody = ({ emulatorViewData, showAnswers }) => {
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
  const { statement, questionCodeSnippet, answerCodeSnippet, fibInputOptions } = emulatorViewData
  const code = decodeURIComponent(answerCodeSnippet)
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
  const optionsStyles = {
    display: 'inline',
    textDecorationLine: 'underline',
    color: 'rgb(186, 186, 186)',
    fontFamily: 'monaco',
    fontWeight: 500,
    paddingLeft: '3px'
  }

  const getOrderedFibInputOptions = () => {
    const orderedFibInputOptions = []
    for (let index = 0; index < fibInputOptions.length; index += 1) {
      orderedFibInputOptions.push(fibInputOptions[index].answers[0])
    }
    return orderedFibInputOptions
  }

  const getAnswerSnippetWithAnswers = () => {
    if (showAnswers) {
      const answerSnippetList = code.split('___')
      const orderedFibInputOptions = getOrderedFibInputOptions()
      const startsWithBlank = code.indexOf('___') === 0
      const answerSnippetWithOptions = []
      const fibInputOptionsOrder = []
      let optionsOrder = 0
      for (let index = 0; index < answerSnippetList.length; index += 1) {
        if (startsWithBlank && index === 0) {
          answerSnippetWithOptions.push(orderedFibInputOptions[optionsOrder])
          fibInputOptionsOrder.push(index)
          optionsOrder += 1
        } else {
          answerSnippetWithOptions.push(answerSnippetList[index])
          if (optionsOrder < orderedFibInputOptions.length) {
            answerSnippetWithOptions.push(orderedFibInputOptions[optionsOrder])
            const fibInputOptionsOrderLen = fibInputOptionsOrder.length
            if (fibInputOptionsOrderLen) {
              fibInputOptionsOrder.push(fibInputOptionsOrder[fibInputOptionsOrderLen - 1] + 2)
            } else {
              fibInputOptionsOrder.push(index + 1)
            }
            optionsOrder += 1
          }
        }
      }
      return (
        <FibInput.AnswerSnippet>
          {answerSnippetWithOptions.map((answer, index) => {
            if (fibInputOptionsOrder.includes(index)) {
              return (
                <p style={optionsStyles}>
                  {answer}
                </p>
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
        </FibInput.AnswerSnippet>
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
  return (
    <FibInput>
      <FibInput.Question>
        {codeTagParser(statement)}
      </FibInput.Question>
      {questionCodeSnippet && (
        <SyntaxHighlighter
          language='python'
          style={darcula}
          customStyle={inputCodeStyles}
          codeTagProps={{ style: { marginHorizontal: 15, fontFamily: 'monaco' } }}
          fontSize={16}
          fontFamily='monaco'
          highlighter='prism'
        >
          {decodeURIComponent(get(emulatorViewData, 'questionCodeSnippet', ''))}
        </SyntaxHighlighter>
      )}
      {getAnswerSnippetWithAnswers()}
    </FibInput>
  )
}

FibInputBody.propTypes = {
  emulatorViewData: PropTypes.shape({}).isRequired,
  showAnswers: PropTypes.bool.isRequired
}

export default FibInputBody
