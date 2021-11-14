import { get } from 'lodash'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import CodeTagParser from '../../../../../../utils/CodeTagParser'
import { Mcq, Option, QuestionStatement } from './QuestionView.styles'

const ArrangeBlock = ({ question, inputCodeStyles, isReordering }) => {
  const terminalStyles = {
    height: '100%',
    width: '100%',
    margin: 0,
    paddingRight: 30,
    paddingLeft: 16,
    backgroundColor: '#002f3e',
    borderColor: '#aaacae',
    borderWidth: 1,
    borderStyle: 'solid'
  }

  const getArrangeOptionsCorrectOrder = () => {
    const arrangeOptionsCorrectOrder = []
    const arrangeOptions = get(question, 'arrangeOptions')
    for (let order = 1; order <= arrangeOptions.length; order += 1) {
      for (let index = 0; index < arrangeOptions.length; index += 1) {
        if (arrangeOptions[index].correctPosition === order) {
          arrangeOptionsCorrectOrder.push(arrangeOptions[index])
          break
        }
      }
    }
    return arrangeOptionsCorrectOrder
  }
  const renderArrangeOptions = (options) => options.map((option) => (
    <Option>
      {
        get(option, 'statement') && (
          <SyntaxHighlighter
            language='python'
            style={darcula}
            fontSize={14}
            codeTagProps={{ style: { fontFamily: 'monaco' } }}
            fontFamily='Monaco'
            customStyle={terminalStyles}
          >
            {get(option, 'statement')}
          </SyntaxHighlighter>
        )
      }
    </Option>
  ))
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
            {renderArrangeOptions(getArrangeOptionsCorrectOrder())}
            <QuestionStatement style={{ minHeight: 'auto' }}>
              Hint: {CodeTagParser(get(question, 'hint'))}
            </QuestionStatement>
          </>
        )
      }
    </Mcq>
  )
}

export default ArrangeBlock
