import React, { memo, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-dracula'
import { get } from 'lodash'
import { Icon, Tooltip } from 'antd'
import EditApprovedCodeStyle from '../EditApprovedCode.style'

const CodePreview = ({ userSavedCodes, updateApprovedCode, isEditable = true }) => {
  const [codeInputString, setCodeInputString] = useState('')

  useEffect(() => {
    if (userSavedCodes && userSavedCodes.userApprovedCode) {
      setCodeInputString(userSavedCodes.userApprovedCode.approvedCode)
    }
  }, [userSavedCodes])

  const onSave = () => {
    const input = {
      approvedCode: codeInputString
    }
    if (codeInputString !== get(userSavedCodes, 'userApprovedCode.approvedCode')) {
      updateApprovedCode(get(userSavedCodes, 'userApprovedCode.id'), input)
    }
  }

  const checkIfUserApprovedCodeExists = () => {
    if (get(userSavedCodes, 'userApprovedCode', false)) {
      return true
    }
    return false
  }

  return (
    <>
      <EditApprovedCodeStyle.StyledRow>
        <EditApprovedCodeStyle.StyledCol span={checkIfUserApprovedCodeExists() ? 12 : 24}>
          <EditApprovedCodeStyle.StyledCodeContainer>
            <EditApprovedCodeStyle.StyledCodeInput>
              {userSavedCodes &&
                <AceEditor
                  mode='python'
                  readOnly
                  setOptions={{
                      showLineNumbers: false,
                      highlightActiveLine: true,
                      wrapBehavioursEnabled: true,
                      highlightGutterLine: true,
                      highlightSelectedWord: true,
                      enableBasicAutocompletion: true,
                      enableSnippets: true,
                      enableLiveAutocompletion: true,
                      showGutter: false,
                      displayIndentGuides: true,
                    }}
                  wrapEnabled
                  theme='dracula'
                  name='editor'
                  value={userSavedCodes.code}
                  style={{
                      top: '8px',
                      height: '100%',
                      fontSize: '20px',
                      lineHeight: '12px',
                      backgroundColor: '#002a38',
                    }}
                  editorProps={{ $blockScrolling: true }}
                />
              }
            </EditApprovedCodeStyle.StyledCodeInput>
          </EditApprovedCodeStyle.StyledCodeContainer>
        </EditApprovedCodeStyle.StyledCol>
        {checkIfUserApprovedCodeExists() && (
          <EditApprovedCodeStyle.StyledCol span={12}>
            <EditApprovedCodeStyle.StyledCodeContainer>
              {isEditable && (
                <Tooltip title='Save Code' placement='left'>
                  <EditApprovedCodeStyle.SaveButton onClick={onSave} style={{ position: 'absolute', right: 0, top: 0 }}>
                    <Icon type='save' />
                  </EditApprovedCodeStyle.SaveButton>
                </Tooltip>
              )}
              <EditApprovedCodeStyle.StyledCodeInput>
                {userSavedCodes &&
                  <>
                    <AceEditor
                      mode='python'
                      readOnly={!isEditable}
                      setOptions={{
                        showLineNumbers: false,
                        highlightActiveLine: true,
                        wrapBehavioursEnabled: true,
                        highlightGutterLine: true,
                        highlightSelectedWord: true,
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: true,
                        showGutter: false,
                        displayIndentGuides: true,
                      }}
                      placeholder='//Start  Your  Code from here'
                      wrapEnabled
                      theme='dracula'
                      name='editor'
                      value={codeInputString}
                      onChange={(codeString) => {
                        setCodeInputString(codeString)
                      }}
                      style={{
                        top: '8px',
                        height: '100%',
                        fontSize: '20px',
                        lineHeight: '12px',
                        backgroundColor: '#002a38',
                      }}
                      editorProps={{ $blockScrolling: true }}
                    />
                    </>
                }
              </EditApprovedCodeStyle.StyledCodeInput>
            </EditApprovedCodeStyle.StyledCodeContainer>
          </EditApprovedCodeStyle.StyledCol>
        )}
      </EditApprovedCodeStyle.StyledRow>
    </>
  )
}

export default memo(CodePreview)
