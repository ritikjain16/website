import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../../components/MainModal'
import { auditQuestionType } from '../../../../constants/auditQuestionConst'
import { BoolView, InputView, McqView, RatingView, TimestampView } from './QuestionTypeView'

const { bool, input, rating, timestamp, mcq } = auditQuestionType

const auditStatementStyle = { marginBottom: '10px' }

const auditStatementh3Style = { margin: 0 }

const auditDescStyle = { opacity: '0.5', fontSize: 'small' }

class AuditViewModal extends React.PureComponent {
    renderQuestionTypes = () => {
      const { auditViewData } = this.props
      const questionType = get(auditViewData, 'questionType')
      if (questionType === mcq) {
        return <McqView data={auditViewData}
          isViewOnlyMode
          auditDescStyle={auditDescStyle}
          auditStatementStyle={auditStatementStyle}
          auditStatementh3Style={auditStatementh3Style}
        />
      } else if (questionType === timestamp) {
        return <TimestampView data={auditViewData}
          auditDescStyle={auditDescStyle}
          auditStatementStyle={auditStatementStyle}
          auditStatementh3Style={auditStatementh3Style}
        />
      } else if (questionType === rating) {
        return <RatingView data={auditViewData}
          isViewOnlyMode
          auditDescStyle={auditDescStyle}
          auditStatementStyle={auditStatementStyle}
          auditStatementh3Style={auditStatementh3Style}
        />
      } else if (questionType === input) {
        return <InputView data={auditViewData}
          isViewOnlyMode
          auditDescStyle={auditDescStyle}
          auditStatementStyle={auditStatementStyle}
          auditStatementh3Style={auditStatementh3Style}
        />
      } else if (questionType === bool) {
        return <BoolView data={auditViewData}
          auditDescStyle={auditDescStyle}
          auditStatementStyle={auditStatementStyle}
          auditStatementh3Style={auditStatementh3Style}
        />
      }
      return null
    }
    render() {
      const { visible, onClose } = this.props
      return (
        <MainModal
          visible={visible}
          title='View audit question'
          onCancel={onClose}
          closable
          bodyStyle={{
          borderRadius: '24px'
        }}
          maskClosable
          width='670px'
          centered
          destroyOnClose
          footer={null}
        >{this.renderQuestionTypes()}
        </MainModal>
      )
    }
}

export default AuditViewModal
