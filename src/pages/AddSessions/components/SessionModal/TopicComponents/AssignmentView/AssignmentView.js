import { get } from 'lodash'
import React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import CodeTagParser from '../../../../../../utils/CodeTagParser'
import parseChatStatement from '../../../../../../utils/parseStatement'
import { CloseIcon } from '../../../../AddSessions.styles'
import AssignmentCard from './Assignment.styles'

const AssignmentView = (props) => {
  const { assignmentData, onDelete, isReordering } = props
  const inputCodeStyles = {
    height: 'fit-content',
    borderRadius: '3px',
    backgroundColor: '#013d4e',
    marginTop: '11px',
    marginBottom: '12px',
    marginHorizontal: 0,
    paddingVertical: '12px',
    paddingHorizontal: 0,
    textAign: 'left'
  }
  return (
    <AssignmentCard>
      <CloseIcon onClick={onDelete} />
      <h3 style={{ width: '80%' }}>{parseChatStatement({ statement: get(assignmentData, 'statement') })}</h3>
      {
        !isReordering && (
          <>
            {get(assignmentData, 'questionCodeSnippet') && (
            <SyntaxHighlighter
              language='python'
              style={darcula}
              customStyle={inputCodeStyles}
              codeTagProps={{ style: { marginHorizontal: 15, fontFamily: 'monaco' } }}
              fontSize={16}
              fontFamily='Monaco'
              highlighter='prism'
            >
              {decodeURIComponent(get(assignmentData, 'questionCodeSnippet'))}
            </SyntaxHighlighter>
            )}
            {get(assignmentData, 'answerCodeSnippet') && (
              <>
                <h4>Answer: </h4>
                <div style={{ width: '100%' }} >
                  <SyntaxHighlighter
                    language='python'
                    style={darcula}
                    customStyle={inputCodeStyles}
                    codeTagProps={{ style: { marginHorizontal: 15, fontFamily: 'monaco' } }}
                    fontSize={16}
                    fontFamily='Monaco'
                    highlighter='prism'
                  >
                    {get(assignmentData, 'answerCodeSnippet')}
                  </SyntaxHighlighter>
                </div>
              </>
            )}
            <h3>Hint: {CodeTagParser(get(assignmentData, 'hint'))}</h3>
          </>
        )
      }
    </AssignmentCard>
  )
}

export default AssignmentView
