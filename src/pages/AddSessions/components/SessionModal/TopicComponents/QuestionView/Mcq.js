import { get } from 'lodash'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import CodeTagParser from '../../../../../../utils/CodeTagParser'
import { Mcq, Option, OptionText, QuestionStatement } from './QuestionView.styles'

const McqBlock = ({ question, inputCodeStyles, isReordering }) => (
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
          )}{get(question, 'mcqOptions') &&
            get(question, 'mcqOptions', []).map((option) =>
              <Option>
                <OptionText>
                  {option.statement}
                </OptionText>
              </Option>)
            }
          <QuestionStatement style={{ minHeight: 'auto' }}>
            Answer: {get(question, 'mcqOptions', []).filter(option => option.isCorrect).map(option => <span>{CodeTagParser(option.statement)},</span>)}
          </QuestionStatement>
          <QuestionStatement style={{ minHeight: 'auto' }}>
            Hint: {CodeTagParser(get(question, 'hint'))}
          </QuestionStatement>
        </>
      )
    }
  </Mcq>
)

export default McqBlock
