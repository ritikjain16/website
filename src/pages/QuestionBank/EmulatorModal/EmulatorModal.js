import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Modal, Icon } from 'antd'
import Emulator from './EmulatorModal.style'
import Mcq from './Components/Mcq'
import { sectionValue } from '../../../constants/questionBank'
import Arrange from './Components/Arrange'
import FibInput from './Components/FibInput'
import FibBlock from './Components/FibBlock'
import Header from './Components/Header'
import Footer from './Components/Footer'

const { FIB_INPUT, FIB_BLOCK, MCQ, ARRANGE } = sectionValue


const EmulatorModal = (props) => {
  const renderBody = () => {
    const { emulatorViewData } = props
    const questionType = get(emulatorViewData, 'questionType', '')
    if (questionType === MCQ) {
      return <Mcq emulatorViewData={emulatorViewData} showAnswers={props.showAnswers} />
    } else if (questionType === FIB_INPUT) {
      return <FibInput emulatorViewData={emulatorViewData} showAnswers={props.showAnswers} />
    } else if (questionType === FIB_BLOCK) {
      return <FibBlock emulatorViewData={emulatorViewData} showAnswers={props.showAnswers} />
    } else if (questionType === ARRANGE) {
      return <Arrange emulatorViewData={emulatorViewData} showAnswers={props.showAnswers} />
    }

    return <div>Wrong Question Type!!</div>
  }

  const getPreviousQuestionId = () => {
    if (props.emulatorViewQuestionOrder === 0) {
      return (props.emulatorViewQuestions[props.emulatorViewQuestionOrder]).id
    }
    return (props.emulatorViewQuestions[props.emulatorViewQuestionOrder - 1]).id
  }

  const getNextQuestionId = () => {
    if (props.emulatorViewQuestionOrder === (props.emulatorViewQuestions).length - 1) {
      return (props.emulatorViewQuestions[props.emulatorViewQuestionOrder]).id
    }
    return (props.emulatorViewQuestions[props.emulatorViewQuestionOrder + 1]).id
  }

  return (
    <Modal
    // title={this.title()}
      visible={props.visible}
      onCancel={props.onCancel}
      onOk={props.onCancel}
      style={{ top: 10 }}
    >
      <Emulator.Outline>
        {
          props.emulatorViewQuestionOrder > 0 ? (
            <Icon type='left'
              style={{ fontSize: 46, display: 'flex', alignItems: 'center' }}
              onClick={() => props.openEmulatorView(getPreviousQuestionId())}
            />
          ) : <div style={{ width: '46px' }} />
        }
        <Emulator>
          <Emulator.Header><Header topicTitle={props.topicTitle} /></Emulator.Header>
          <Emulator.Body>
            {renderBody()}
          </Emulator.Body>
          <Emulator.Footer>
            <Footer
              emulatorViewQuestions={props.emulatorViewQuestions}
              questionOrderIdMap={props.questionOrderIdMap}
              openEmulatorView={(id) => props.openEmulatorView(id)}
              questionId={props.questionId}
              emulatorViewData={props.emulatorViewData}
              cancelClicked={props.cancelClicked}
              emulatorViewAnswers={(showAnswerState) => props.emulatorViewAnswers(showAnswerState)}
              emulatorViewHint={(showHintState) => props.emulatorViewHint(showHintState)}
              showAnswers={props.showAnswers}
              showHint={props.showHint}
            />
          </Emulator.Footer>
        </Emulator>
        {
          props.emulatorViewQuestionOrder < (get(props, 'questionData', []).length - 1) ?
            <Icon type='right'
              style={{ fontSize: 46, display: 'flex', alignItems: 'center' }}
              onClick={() => props.openEmulatorView(getNextQuestionId())}
            /> : <div style={{ width: '46px' }} />
        }

      </Emulator.Outline>
    </Modal>
  )
}
EmulatorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  topicTitle: PropTypes.string.isRequired,
  emulatorViewData: PropTypes.arrayOf(PropTypes.shape({})),
  openEmulatorView: PropTypes.func.isRequired,
  emulatorViewQuestions: PropTypes.shape({}),
  questionOrderIdMap: PropTypes.shape({}),
  questionId: PropTypes.string.isRequired,
  cancelClicked: PropTypes.bool.isRequired,
  showAnswers: PropTypes.bool.isRequired,
  showHint: PropTypes.bool.isRequired,
  emulatorViewAnswers: PropTypes.func.isRequired,
  emulatorViewHint: PropTypes.func.isRequired,
  emulatorViewQuestionOrder: PropTypes.number.isRequired
}
EmulatorModal.defaultProps = {
  emulatorViewData: [],
  emulatorViewQuestions: {},
  questionOrderIdMap: {}
}
export default EmulatorModal
