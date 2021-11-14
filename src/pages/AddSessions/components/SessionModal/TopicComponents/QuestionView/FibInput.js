import { get } from 'lodash'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import CodeTagParser from '../../../../../../utils/CodeTagParser'
import { AnswerSnippet, Mcq, QuestionStatement } from './QuestionView.styles'

const FibInput = ({ question, inputCodeStyles, isReordering }) => {
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
    const fibInputOptions = get(question, 'fibInputOptions')
    for (let index = 0; index < fibInputOptions.length; index += 1) {
      orderedFibInputOptions.push(fibInputOptions[index].answers[0])
    }
    return orderedFibInputOptions
  }
  const getAnswerSnippetWithAnswers = () => {
    const code = decodeURIComponent(get(question, 'answerCodeSnippet'))
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
      <AnswerSnippet>
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
              codeTagProps={codeTagProps}
              fontSize={16}
              fontFamily='monaco'
              highlighter='prism'
            >
              {decodeURIComponent(get(question, 'questionCodeSnippet'))}
            </SyntaxHighlighter>
            )}
            {getAnswerSnippetWithAnswers()}
            <QuestionStatement style={{ minHeight: 'auto' }}>
              Hint: {CodeTagParser(get(question, 'hint'))}
            </QuestionStatement>
          </>
        )
      }
    </Mcq>
  )
}

export default FibInput
