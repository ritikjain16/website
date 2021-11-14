import React, { Component } from 'react'
import { Spin, notification, Radio, InputNumber, Button, Divider } from 'antd'
import { get, sortBy } from 'lodash'
import TextArea from 'antd/lib/input/TextArea'
import { PlayCircleFilled } from '@ant-design/icons'
import TopSection from './components/TopSection'
import fetchMentorAudit from '../../actions/mentorAudits/fetchMentorAudit'
import updateMentorAudit from '../../actions/mentorAudits/updateMentorAudit'
import getDataFromLocalStorage from '../../utils/extract-from-localStorage'
import {
  auditType,
  auditQuestionType, ratingDisplayType,
} from '../../constants/auditQuestionConst'
import MentorAuditStyle from './MentorAudit.style'
import TimeSpecificComment from './components/TimeSpecificComment'
import {
  addAuditAudio,
  fetchSinglePostSalesAudit, fetchSinglePreSalesAudit,
  updateSinglePostSalesAudit, updateSinglePreSalesAudit
} from '../../actions/audits'
import AudioDropzone from './components/AudioDropzone'
import AudioPlayer from './components/AudioPlayer'
import getFullPath from '../../utils/getFullPath'

const { preSales, postSales, mentor } = auditType

const titleStyle = {
  fontSize: '23px',
  fontWeight: '500',
  color: '#1c91ff',
  marginRight: '15px'
}

const rateDivStyle = {
  position: 'relative',
  width: 'auto',
  height: 'auto',
  backgroundColor: '#58cfd2',
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '15px'
}

const rateStarStyle = {
  fontSize: 18,
  color: '#047775'
}

const bottomDivStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 15px',
}

const rowStyle = {
  display: 'grid',
  justifyContent: 'space-between',
  margin: '8px auto',
  width: '100%',
  gridTemplateColumns: '45% 45%',
  alignItems: 'flex-start'
}

const saveButtonStyle = {
  color: '#ffffff',
  margin: '1rem .5rem',
  background: '#06b004',
  '&:hover': {
    textDecoration: 'auto !important',
    background: 'red',
  },
}

const MCQ_WITH_BOOLEANS_VALUE = 'mcqWithBooleansValue'

const MCQ_WITH_NA_AND_OTHER_OPTIONS = 'mcqWithNAAndOtherOptions'


class MentorAudit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isViewOnlyMode: false,
      stateAuditData: null,
      totalQualityScore: 0,
      customSectionWiseScore: 0,
      overAllQuestionScore: 0,
      audioFile: null,
      auditAudioFile: null,
      imageUploading: false,
      isAudioExist: false,
      isBatchAudit: false,
      auditStatus: 'started'
    }
  }

  enableViewOnlyMode = (audit) => {
    const currentLoggedInUserId = getDataFromLocalStorage('login.id')
    if (currentLoggedInUserId !== get(audit, 'auditor.id', null)) {
      this.setState({
        isViewOnlyMode: true
      })
    }
  }

  async componentDidMount() {
    this.fetchAuditDetails()
  }
  fetchAuditDetails = async () => {
    const { match } = this.props
    if (get(match, 'params.auditType') === preSales
      && get(match, 'params.auditId')) {
      await fetchSinglePreSalesAudit(get(match, 'params.auditId'))
    } else if (get(match, 'params.auditType') === postSales
      && get(match, 'params.auditId')) {
      await fetchSinglePostSalesAudit(get(match, 'params.auditId'))
    } else if (get(match, 'params.auditType') === mentor
      && get(match, 'params.auditId')) {
      const mentorMenteeSessionAuditId = get(match, 'params.auditId')
      await fetchMentorAudit(mentorMenteeSessionAuditId)
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.mentorMenteeSessionAudit !== prevProps.mentorMenteeSessionAudit) {
      const mentorMenteeSessionAuditData =
        this.props.mentorMenteeSessionAudit &&
        this.props.mentorMenteeSessionAudit.toJS()
      this.enableViewOnlyMode(mentorMenteeSessionAuditData)
      this.setState({
        stateAuditData: mentorMenteeSessionAuditData
      }, this.setInitialStateScore)
    }
    if (get(this.props, 'isMentorMenteeSessionAuditUpdateSuccess', false) &&
    !get(prevProps, 'isMentorMenteeSessionAuditUpdateSuccess', false)) {
      notification.success({
        message: 'Audit updated successfully',
      })
    }
    const { preSalesAuditFetchStatus, postSalesAuditFetchStatus } = this.props
    if (preSalesAuditFetchStatus && !get(preSalesAuditFetchStatus.toJS(), 'loading')
      && get(preSalesAuditFetchStatus.toJS(), 'success') &&
      (prevProps.preSalesAuditFetchStatus !== preSalesAuditFetchStatus)) {
      this.setState({
        stateAuditData: this.props.preSalesAudit && this.props.preSalesAudit.toJS()
      }, this.setInitialStateScore)
      this.enableViewOnlyMode(this.props.preSalesAudit && this.props.preSalesAudit.toJS())
    }
    if (postSalesAuditFetchStatus && !get(postSalesAuditFetchStatus.toJS(), 'loading')
      && get(postSalesAuditFetchStatus.toJS(), 'success') &&
      (prevProps.postSalesAuditFetchStatus !== postSalesAuditFetchStatus)) {
      this.setState({
        stateAuditData: this.props.postSalesAudit && this.props.postSalesAudit.toJS()
      }, this.setInitialStateScore)
      this.enableViewOnlyMode(this.props.postSalesAudit && this.props.postSalesAudit.toJS())
    }
  }

  // Helper to remove undefined or null properties from an object
  removeNullFromObject = (obj) => {
    const unwantedFields = ['createdAt', 'updatedAt', 'id', 'auditor',
      'mentorMenteeSession', 'timestampCommentMeta',
      'timestampComment', 'scoreWeightage', 'isViewOnlyMode',
      'timestampAnswer', 'timestampAnswerMeta']
    // Protect against null/undefined object passed in
    return Object.keys(obj || {}).reduce((x, k) => {
      // Check for null or undefined
      if (obj[k] !== null && !unwantedFields.includes(k)) {
        x[k] = obj[k]
      }
      return x
    }, {})
  }

  updateMentorAuditSession = async () => {
    const mentorMenteeSessionAuditId = this.props.match.params.id
    const input = this.removeNullFromObject(this.state)
    /**
     * @auditorConnectId needs to be empty!
     * i.e to change audit status from alloted to started (if required)
     */
    const auditorConnectId = ''
    await updateMentorAudit(mentorMenteeSessionAuditId, auditorConnectId, input)
  }
  updateAuditData = (sectionName) => {
    const { match } = this.props
    const auditTypeFromRoute = get(match, 'params.auditType')
    const auditId = get(match, 'params.auditId')
    const { stateAuditData, customSectionWiseScore,
      totalQualityScore, overAllQuestionScore } = this.state
    const auditQuestionInputs = []
    const customSectionScore = []
    get(stateAuditData, 'auditQuestionsData', []).forEach(auditQuestion => {
      auditQuestionInputs.push({
        auditQuestionConnectId: get(auditQuestion, 'auditQuestion.id'),
        mcqAnswers: get(auditQuestion, 'mcqAnswers'),
        boolAnswers: get(auditQuestion, 'boolAnswers'),
        ratingAnswer: get(auditQuestion, 'ratingAnswer'),
        customScore: get(auditQuestion, 'customScore'),
        inputAnswer: get(auditQuestion, 'inputAnswer')
      })
    })
    get(stateAuditData, 'customSectionScore', []).forEach(section => {
      customSectionScore.push({
        questionSectionConnectId: get(section, 'questionSection.id'),
        customScore: get(section, 'customScore')
      })
    })
    let status = 'allotted'
    if (sectionName === 'completed') {
      status = sectionName
      this.setState({
        auditStatus: status
      })
    }
    const updateInput = {
      auditId,
      input: {
        status,
        overallClassComment: get(stateAuditData, 'overallClassComment') || '',
        auditQuestions: {
          replace: auditQuestionInputs
        },
        customSectionScore: {
          replace: customSectionScore
        },
        score: Number(totalQualityScore),
        customScore: Number(customSectionWiseScore),
        totalScore: Number(overAllQuestionScore)
      },
      section: sectionName
    }
    if (auditTypeFromRoute === preSales) {
      updateSinglePreSalesAudit(updateInput)
    } else if (auditTypeFromRoute === postSales) {
      updateSinglePostSalesAudit(updateInput)
    } else if (auditTypeFromRoute === mentor) {
      updateMentorAudit(auditId, '', {
        status,
        overallClassComment: get(stateAuditData, 'overallClassComment') || '',
        auditQuestions: {
          replace: auditQuestionInputs
        },
        customSectionScore: {
          replace: customSectionScore
        },
        score: Number(totalQualityScore),
        customScore: Number(customSectionWiseScore),
        totalScore: Number(overAllQuestionScore)
      }, `mentorMenteeSessionAudit/${sectionName}`)
    }
  }
  getAttemptedQuestionScore = () => {
    const { stateAuditData } = this.state
    const newstateAuditData = [...get(stateAuditData, 'auditQuestionsData')]
    const newCustomSectionScore = [...get(stateAuditData, 'customSectionScore')]
    let totalQualityQuestionScore = 0
    let overAllQuestionScore = 0
    newstateAuditData.forEach(auditQuestion => {
      let includesNA = false
      if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.input
        && get(auditQuestion, 'inputAnswer')) {
        totalQualityQuestionScore += get(auditQuestion, 'auditQuestion.score')
      }
      if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.bool
        && get(auditQuestion, 'boolAnswers')) {
        totalQualityQuestionScore += get(auditQuestion, 'auditQuestion.score')
      }
      if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.rating
        && get(auditQuestion, 'ratingAnswer')) {
        totalQualityQuestionScore += (get(auditQuestion, 'ratingAnswer') / get(auditQuestion, 'auditQuestion.maxRating')) * get(auditQuestion, 'auditQuestion.score')
      }
      if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.mcq
        && get(auditQuestion, 'mcqAnswers', []).length) {
        const includesNAAndSelected = (value) => get(auditQuestion, 'mcqAnswers', []).filter(answer =>
          get(answer, 'statement').trim().toLowerCase() === value && get(answer, 'isSelected'))
        const mcqOptions = get(auditQuestion, 'auditQuestion.mcqOptions', [])
        const isMcqWithBoolValues = this.isYesNoOrNAExist(mcqOptions) === MCQ_WITH_BOOLEANS_VALUE
        const isOnlyNA = this.isYesNoOrNAExist(mcqOptions) === MCQ_WITH_NA_AND_OTHER_OPTIONS
        if (isMcqWithBoolValues) {
          const includesYesAndSelected = get(auditQuestion, 'mcqAnswers', []).filter(answer =>
            get(answer, 'statement').trim().toLowerCase() === 'yes' && get(answer, 'isSelected'))
          const includesPartialAndSelected = get(auditQuestion, 'mcqAnswers', []).filter(answer =>
            get(answer, 'statement').trim().toLowerCase() === 'partially correct' && get(answer, 'isSelected'))
          if (includesYesAndSelected.length > 0) {
            totalQualityQuestionScore += get(auditQuestion, 'auditQuestion.score')
          }
          if (includesPartialAndSelected.length > 0) {
            totalQualityQuestionScore += parseInt((get(auditQuestion, 'auditQuestion.score') / 2), 0)
          }
        } else if (isOnlyNA) {
          const selectedNA = includesNAAndSelected('na').length > 0 || includesNAAndSelected('n/a').length > 0
          if (!selectedNA) {
            const numOfSelectedOptions = get(auditQuestion, 'mcqAnswers', []).filter(answer => get(answer, 'isSelected'))
            if (numOfSelectedOptions.length > 0) {
              totalQualityQuestionScore += (numOfSelectedOptions.length / get(auditQuestion, 'mcqAnswers', []).length) * get(auditQuestion, 'auditQuestion.score')
            }
          }
        } else {
          const numOfSelectedOptions = get(auditQuestion, 'mcqAnswers', []).filter(answer => get(answer, 'isSelected'))
          if (numOfSelectedOptions.length > 0) {
            totalQualityQuestionScore += (numOfSelectedOptions.length / get(auditQuestion, 'mcqAnswers', []).length) * get(auditQuestion, 'auditQuestion.score')
          }
        }
        // check for includes NA and it is selected
        includesNA = includesNAAndSelected('na').length > 0 || includesNAAndSelected('n/a').length > 0
      }
      if (!includesNA) {
        overAllQuestionScore += get(auditQuestion, 'auditQuestion.score')
      }
    })
    let customSectionWiseScore = 0
    newCustomSectionScore.forEach(sectionScore => {
      if (get(sectionScore, 'customScore', 0)) {
        customSectionWiseScore += get(sectionScore, 'customScore', 0)
      }
    })
    this.setState({
      customSectionWiseScore,
      totalQualityScore: parseInt(totalQualityQuestionScore, 0),
      overAllQuestionScore
    })
  }

  isYesNoOrNAExist = (mcqOptions) => {
    // checking if yes or no type mcq
    const optionStatementsIncludes = (value) => mcqOptions.filter(option => get(option, 'statement').trim().toLowerCase() === value)
    const containsYesOrNo = optionStatementsIncludes('yes').length > 0 && optionStatementsIncludes('no').length > 0
    const isBooleanOfMcqtype = mcqOptions.length === 2 && containsYesOrNo
    // checking if yes/no and NA type mcq
    const containsYesOrNoOrNA = optionStatementsIncludes('yes').length > 0 && optionStatementsIncludes('no').length > 0
      && (optionStatementsIncludes('na').length > 0 || optionStatementsIncludes('n/a').length > 0)
    const containsYesOrNoOrPartial = optionStatementsIncludes('yes').length > 0 && optionStatementsIncludes('no').length > 0
      && optionStatementsIncludes('partially correct').length > 0
    const containsYesOrNoNAOrPartial = optionStatementsIncludes('yes').length > 0 && optionStatementsIncludes('no').length > 0
      && optionStatementsIncludes('partially correct').length > 0
      && (optionStatementsIncludes('na').length > 0 || optionStatementsIncludes('n/a').length > 0)
    const isBooleanWithNaOption = mcqOptions.length >= 3 && containsYesOrNoOrNA
    const containsOnlyNA = optionStatementsIncludes('na').length > 0 || optionStatementsIncludes('n/a').length > 0 && !containsYesOrNo
    let returnType = ''
    if (isBooleanOfMcqtype || containsYesOrNoNAOrPartial
      || isBooleanWithNaOption || containsYesOrNoOrPartial) {
      returnType = MCQ_WITH_BOOLEANS_VALUE
    } else if (containsOnlyNA) return MCQ_WITH_NA_AND_OTHER_OPTIONS
    return returnType
  }

  onStateChange = (value, auditQuestion, type, checked, key) => {
    const { stateAuditData } = this.state
    if (type !== 'sectionCustomScore' && type !== 'overallClassComment') {
      const newstateAuditData = [...get(stateAuditData, 'auditQuestionsData')]
      const findAuditInd = newstateAuditData.findIndex(audit =>
        get(audit, 'auditQuestion.id') === get(auditQuestion, 'auditQuestion.id'))
      if (findAuditInd !== -1) {
        if (type === 'mcqAnswers') {
          const mcqAnswers = newstateAuditData[findAuditInd][type]
          const mcqOptions = get(auditQuestion, 'auditQuestion.mcqOptions', [])
          if (mcqAnswers && mcqAnswers.length > 0) {
            const newMcqAnswers = [...mcqAnswers]
            const selectedOption = newMcqAnswers.filter(answer => get(answer, 'isSelected'))
            if ((this.isYesNoOrNAExist(mcqOptions) === MCQ_WITH_BOOLEANS_VALUE) && checked
              && selectedOption.length >= 1) {
              newMcqAnswers.forEach(option => option.isSelected = false)
            }
            if ((this.isYesNoOrNAExist(mcqOptions) === MCQ_WITH_NA_AND_OTHER_OPTIONS) && checked) {
              const valueStatement = get(value, 'statement', '').trim().toLowerCase()
              if (valueStatement === 'na' || valueStatement === 'n/a') {
                newMcqAnswers.forEach(option => option.isSelected = false)
              } else {
                const unCheckNAInd = newMcqAnswers.findIndex(mcq => get(mcq, 'statement').trim().toLowerCase() === 'na'
                  || get(mcq, 'statement').trim().toLowerCase() === 'n/a')
                if (unCheckNAInd) newMcqAnswers[unCheckNAInd].isSelected = false
              }
            }
            const findMcqInd = newMcqAnswers.findIndex(mcq => get(mcq, 'statement') === get(value, 'statement'))
            if (findAuditInd !== -1) {
              newMcqAnswers[findMcqInd].isSelected = checked
            }
            newstateAuditData[findAuditInd][type] = newMcqAnswers
          } else {
            mcqOptions.forEach(option => {
              mcqAnswers.push({
                statement: get(option, 'statement'),
                isSelected: false
              })
            })
            const newMcqAnswers = [...mcqAnswers]
            const findMcqInd = newMcqAnswers.findIndex(mcq => get(mcq, 'statement') === get(value, 'statement'))
            if (findAuditInd !== -1) {
              newMcqAnswers[findMcqInd].isSelected = checked
            }
            newstateAuditData[findAuditInd][type] = newMcqAnswers
          }
        } else {
          newstateAuditData[findAuditInd][type] = value
        }
        this.setState({
          stateAuditData: {
            ...this.state.stateAuditData,
            auditQuestionsData: newstateAuditData
          }
        })
      }
    } else if (type === 'sectionCustomScore') {
      const newCustomSectionScore = [...get(stateAuditData, 'customSectionScore')]
      const sectionTitle = auditQuestion
      const findSectionInd = newCustomSectionScore.findIndex(section =>
        get(section, 'questionSection.title') === sectionTitle)
      if (findSectionInd !== -1) {
        newCustomSectionScore[findSectionInd].customScore = value
        let customSectionWiseScore = 0
        newCustomSectionScore.forEach(sectionScore => {
          if (get(sectionScore, 'customScore', 0)) {
            customSectionWiseScore += get(sectionScore, 'customScore', 0)
          }
        })
        this.setState({
          customSectionWiseScore,
          stateAuditData: {
            ...this.state.stateAuditData,
            customSectionScore: newCustomSectionScore
          }
        })
      }
    } else {
      this.setState({
        stateAuditData: {
          ...this.state.stateAuditData,
          overallClassComment: value
        }
      })
    }
    if (key) {
      const newCustomSectionScore = [...get(this.state.stateAuditData, 'customSectionScore')]
      const findSectionInd = newCustomSectionScore.findIndex(section =>
        get(section, 'questionSection.title') === key)
      if (findSectionInd !== -1) {
        const auditQuestionsOfKey = [...get(this.state.stateAuditData, 'auditQuestionsData')].filter(auditQ =>
          get(auditQ, 'auditQuestion.section.title') === key)
        let totalCustomScore = 0
        auditQuestionsOfKey.forEach(auditData => {
          if (get(auditData, 'auditQuestion.questionType') === auditQuestionType.input && get(auditData, 'inputAnswer')) {
            totalCustomScore += get(auditData, 'auditQuestion.score')
          }
          if (get(auditData, 'auditQuestion.questionType') === auditQuestionType.bool && get(auditData, 'boolAnswers')) {
            totalCustomScore += get(auditData, 'auditQuestion.score')
          }
          if (get(auditData, 'auditQuestion.questionType') === auditQuestionType.rating && get(auditData, 'ratingAnswer')) {
            totalCustomScore += (get(auditData, 'ratingAnswer') / get(auditData, 'auditQuestion.maxRating')) * get(auditData, 'auditQuestion.score')
          }
          if (get(auditData, 'auditQuestion.questionType') === auditQuestionType.mcq
            && get(auditData, 'mcqAnswers', []).length) {
            const mcqOptions = get(auditData, 'auditQuestion.mcqOptions', [])
            const isYesOrNoOrNA = this.isYesNoOrNAExist(mcqOptions) === MCQ_WITH_BOOLEANS_VALUE
            const isOnlyNA = this.isYesNoOrNAExist(mcqOptions) === MCQ_WITH_NA_AND_OTHER_OPTIONS
            if (isYesOrNoOrNA) {
              const includesYesAndSelected = get(auditData, 'mcqAnswers', []).filter(answer =>
                get(answer, 'statement').trim().toLowerCase() === 'yes' && get(answer, 'isSelected'))
              if (includesYesAndSelected.length > 0) {
                totalCustomScore += get(auditData, 'auditQuestion.score')
              }
              const includesPartialAndSelected = get(auditData, 'mcqAnswers', []).filter(answer =>
                get(answer, 'statement').trim().toLowerCase() === 'partially correct' && get(answer, 'isSelected'))
              if (includesPartialAndSelected.length > 0) {
                totalCustomScore += parseInt((get(auditQuestion, 'auditQuestion.score') / 2), 0)
              }
            } else if (isOnlyNA) {
              const includesNAAndSelected = (val) => get(auditQuestion, 'mcqAnswers', []).filter(answer =>
                get(answer, 'statement').trim().toLowerCase() === val && get(answer, 'isSelected'))
              const NASelected = includesNAAndSelected('na').length > 0 || includesNAAndSelected('n/a').length > 0
              if (!NASelected) {
                const numOfSelectedOptions = get(auditData, 'mcqAnswers', []).filter(answer => get(answer, 'isSelected'))
                if (numOfSelectedOptions.length > 0) {
                  totalCustomScore += (numOfSelectedOptions.length / get(auditData, 'mcqAnswers', []).length) * get(auditData, 'auditQuestion.score')
                }
              }
            } else {
              const numOfSelectedOptions = get(auditData, 'mcqAnswers', []).filter(answer => get(answer, 'isSelected'))
              if (numOfSelectedOptions.length > 0) {
                totalCustomScore += (numOfSelectedOptions.length / get(auditData, 'mcqAnswers', []).length) * get(auditData, 'auditQuestion.score')
              }
            }
          }
        })
        if (totalCustomScore >= 0) {
          newCustomSectionScore[findSectionInd].customScore = parseInt(totalCustomScore, 0)
        }
        this.setState({
          stateAuditData: {
            ...this.state.stateAuditData,
            customSectionScore: newCustomSectionScore
          }
        })
      }
    }
    this.getAttemptedQuestionScore()
  }
  renderQuestions = (auditQuestion, key) => {
    const { isViewOnlyMode, stateAuditData } = this.state
    const boolStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      margin: '8px auto',
      width: '100%',
    }
    if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.rating &&
        get(auditQuestion, 'auditQuestion.ratingDisplayType') === ratingDisplayType.star) {
      return (
        <div style={{ width: '45%' }}>
          <div style={{ ...rowStyle, gridTemplateColumns: '95%' }}>
            <h3>{get(auditQuestion, 'auditQuestion.statement')}</h3>
            {
              get(auditQuestion, 'auditQuestion.description')
                && <span style={{ opacity: '0.75' }}>({get(auditQuestion, 'auditQuestion.description')})</span>
            }
            <div>
              <div style={rateDivStyle}>
                <MentorAuditStyle.StyledRating
                  disabled={isViewOnlyMode}
                  value={get(auditQuestion, 'ratingAnswer')}
                  count={get(auditQuestion, 'auditQuestion.maxRating')}
                  style={rateStarStyle}
                  tooltips={[...Array(get(auditQuestion, 'auditQuestion.maxRating') + 1).keys()].slice(1)}
                  onChange={(value) => this.onStateChange(value, auditQuestion, 'ratingAnswer', null, key)}
                />
                <PlayCircleFilled
                  onClick={() => {
                    if (get(this.state, 'stateAuditData.mentorMenteeSession.sessionRecordingLink')) {
                      window.open(get(this.state, 'stateAuditData.mentorMenteeSession.sessionRecordingLink'), '_blank')
                    }
                  }}
                  style={{
                    fontSize: '35px',
                    float: 'right',
                  }}
                />
              </div>
              <div style={bottomDivStyle}>
                <h5 style={{ color: '#fc6d6d' }}>Terrible</h5>
                <h5 style={{ color: '#5cbd4a' }}>Wow!</h5>
              </div>
            </div>
          </div>
        </div>
      )
    }
    if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.rating &&
      get(auditQuestion, 'auditQuestion.ratingDisplayType') === ratingDisplayType.number) {
      return (
        <div style={{ width: '45%' }}>
          <div style={{ ...rowStyle, gridTemplateColumns: '95%' }}>
            <h3>{get(auditQuestion, 'auditQuestion.statement')}</h3>
            {
              get(auditQuestion, 'auditQuestion.description')
                && <span style={{ opacity: '0.75' }}>({get(auditQuestion, 'auditQuestion.description')})</span>
            }
            <div style={bottomDivStyle}>
              <h5 style={{ color: '#fc6d6d' }}>Terrible</h5>
              <div style={{ display: 'flex' }}>
                {[...Array(get(auditQuestion, 'auditQuestion.maxRating') + 1).keys()].map((num, ind) => (
                num > 0 && (
                <label htmlFor={`option${ind}`} style={{ margin: '0px 10px' }} >
                  <p style={{ margin: 0 }}>{num}</p>
                  <MentorAuditStyle.StyledCheckbox
                    checked={num <= get(auditQuestion, 'ratingAnswer')}
                    id={`options${ind}`}
                    onChange={() =>
                    this.onStateChange(num, auditQuestion, 'ratingAnswer', null, key)}
                  />
                </label>)
              ))}
              </div>
              <h5 style={{ color: '#5cbd4a' }}>Wow!</h5>
            </div>
          </div>
        </div>
      )
    }
    if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.bool) {
      return (
        <div style={{ width: '100%' }}>
          <div style={{ ...boolStyle }}>
            <div style={{ flex: '0.8' }}>
              <h3>{get(auditQuestion, 'auditQuestion.statement')}</h3>
              {
                get(auditQuestion, 'auditQuestion.description')
                  && <span style={{ opacity: '0.75' }}>({get(auditQuestion, 'auditQuestion.description')})</span>
              }
            </div>
            <Radio.Group
              style={{ float: 'right' }}
              value={get(auditQuestion, 'boolAnswers')}
              onChange={({ target: { value } }) =>
                this.onStateChange(value, auditQuestion, 'boolAnswers', null, key)}
            >
              <MentorAuditStyle.StyledRadio
                style={{
                  userSelect: isViewOnlyMode && 'none',
                  pointerEvents: isViewOnlyMode && 'none'
                }}
                color='#6fcf97'
                value
              >Yes
              </MentorAuditStyle.StyledRadio>
              <MentorAuditStyle.StyledRadio
                style={{
                  userSelect: isViewOnlyMode && 'none',
                  pointerEvents: isViewOnlyMode && 'none'
                }}
                color='#eb7979'
                value={false}
              >No
              </MentorAuditStyle.StyledRadio>
            </Radio.Group>
          </div>
        </div>
      )
    }
    if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.input) {
      return (
        <div style={{ width: '100%' }}>
          <div style={{ ...rowStyle, gridTemplateColumns: '80%' }}>
            <h3>{get(auditQuestion, 'auditQuestion.statement')}</h3>
            {
              get(auditQuestion, 'auditQuestion.description')
                && <span style={{ opacity: '0.75' }}>({get(auditQuestion, 'auditQuestion.description')})</span>
            }
            <TextArea
              readOnly={isViewOnlyMode}
              rows={3}
              bordered={false}
              value={get(auditQuestion, 'inputAnswer')}
              onChange={({ target: { value } }) =>
                this.onStateChange(value, auditQuestion, 'inputAnswer', null, key)}
              placeholder='Enter input'
              style={{
                width: '100%',
                height: '100px',
                backgroundColor: '#e4e4e4'
              }}
            />
          </div>
        </div>
      )
    }
    if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.mcq) {
      const mcqOptions = get(auditQuestion, 'auditQuestion.mcqOptions', [])
      const isBooleanOfMcqtype = this.isYesNoOrNAExist(mcqOptions) === MCQ_WITH_BOOLEANS_VALUE
        && mcqOptions.length === 2
      return (
        <div style={{ width: '100%' }}>
          <div style={isBooleanOfMcqtype ? { ...boolStyle } : { ...rowStyle, gridTemplateColumns: 'auto' }}>
            <div>
              <h3>{get(auditQuestion, 'auditQuestion.statement')}</h3>
              {
                get(auditQuestion, 'auditQuestion.description')
                  && <span style={{ opacity: '0.75' }}>({get(auditQuestion, 'auditQuestion.description')})</span>
              }
            </div>
            {
              isBooleanOfMcqtype ? (
                <div>
                  {mcqOptions.map((options, ind) => (
                    <MentorAuditStyle.StyledCheckbox
                      style={{
                          userSelect: isViewOnlyMode && 'none',
                          pointerEvents: isViewOnlyMode && 'none',
                          padding: '10px 0'
                        }}
                      checked={get(auditQuestion, `mcqAnswers[${ind}].isSelected`)}
                      onChange={({ target: { checked } }) =>
                        this.onStateChange(options, auditQuestion, 'mcqAnswers', checked, key)}
                    >
                      {options.statement}
                    </MentorAuditStyle.StyledCheckbox>
                  ))}
                </div>
              ) : (
                mcqOptions.map((options, ind) => (
                  <MentorAuditStyle.StyledCheckbox
                    style={{
                      userSelect: isViewOnlyMode && 'none',
                      pointerEvents: isViewOnlyMode && 'none',
                      padding: '10px 0'
                    }}
                    checked={get(auditQuestion, `mcqAnswers[${ind}].isSelected`)}
                    onChange={({ target: { checked } }) =>
                    this.onStateChange(options, auditQuestion, 'mcqAnswers', checked, key)}
                  >
                    {options.statement}
                  </MentorAuditStyle.StyledCheckbox>
                ))
              )
            }
          </div>
        </div>
      )
    }
    if (get(auditQuestion, 'auditQuestion.questionType') === auditQuestionType.timestamp) {
      const { match } = this.props
      const auditId = get(match, 'params.auditId')
      const timestampAnswerFromState = get(stateAuditData, 'timestampAnswer', [])
      const timestampAnswer = timestampAnswerFromState.filter(timeComment =>
        get(timeComment, 'auditQuestion.id') === get(auditQuestion, 'auditQuestion.id'))
      const auditTypeFromRoute = get(match, 'params.auditType')
      return (
        <TimeSpecificComment
          isViewOnlyMode={isViewOnlyMode}
          isMentorMenteeSessionTimestampCreating={
          this.props.isMentorMenteeSessionTimestampCreating
        }
          isMentorMenteeSessionTimestampDeleting={
          this.props.isMentorMenteeSessionTimestampDeleting
        }
          isMentorMenteeSessionTimestampUpdating={
          this.props.isMentorMenteeSessionTimestampUpdating
        }
          setTimeStampComment={(timeStampData) =>
          this.setState({ timestampComment: timeStampData })
        }
          question={auditQuestion}
          auditId={auditId}
          auditTypeFromRoute={auditTypeFromRoute}
          stateAuditData={stateAuditData}
          timestampAnswer={timestampAnswer}
          fetchAuditDetails={this.fetchAuditDetails}
          mentorMenteeSessionAudit={this.state}
        />
      )
    }
  }
  setInitialStateScore = () => {
    const { stateAuditData } = this.state
    if (!this.state.auditAudioFile) {
      this.setState({
        auditAudioFile: getFullPath(get(stateAuditData, 'auditAudioFile.uri')),
      })
    }
    this.setState({
      totalQualityScore: get(stateAuditData, 'score') || 0,
      overAllQuestionScore: get(stateAuditData, 'totalScore') || 0,
      customSectionWiseScore: get(stateAuditData, 'customScore') || 0,
      isBatchAudit: get(stateAuditData, 'isBatchAudit') || false,
      auditStatus: get(stateAuditData, 'status')
    }, () => {
      // calculating scores from questions for previous audits if we are not getting from auditData
      if (!get(stateAuditData, 'score') && !get(stateAuditData, 'totalScore')
        && !get(stateAuditData, 'customScore')) {
        this.getAttemptedQuestionScore()
      }
    })
  }
  renderSectionWiseQuestion = () => {
    const { isViewOnlyMode, stateAuditData, auditStatus } = this.state
    const { preSalesAuditUpdateStatus, match,
      postSalesAuditUpdateStatus, mentorMenteeSessionAuditUpdating } = this.props
    const sectionQuestions = []
    const auditTypeFromRoute = get(match, 'params.auditType')
    const notInSection = get(stateAuditData, 'auditQuestionsData', []).filter(auditQuestion =>
      !get(auditQuestion, 'auditQuestion.section.id'))
    const rowStyleInner = {
      ...rowStyle,
      display: 'flex',
      justifyContent: 'flex-start',
    }
    const flexContainer = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      width: '100%'
    }
    const auditQuestionWithSection = get(stateAuditData, 'auditQuestionsData', []).filter(auditQuestion =>
      get(auditQuestion, 'auditQuestion.section.id'))
    const groupBySection = auditQuestionWithSection.reduce((accumulator, currentValue) => {
      accumulator[get(currentValue, 'auditQuestion.section.title')] = accumulator[get(currentValue, 'auditQuestion.section.title')] || []
      accumulator[get(currentValue, 'auditQuestion.section.title')].push(currentValue)
      return accumulator
    }, {})
    Object.keys(groupBySection).forEach((key, ind) => {
      const auditQuestionOfSection = get(stateAuditData, 'auditQuestionsData', []).filter(auditQuestion =>
        get(auditQuestion, 'auditQuestion.section.title') === key)
      let savedLoading = false
      if (auditTypeFromRoute === preSales) {
        savedLoading = preSalesAuditUpdateStatus && get(preSalesAuditUpdateStatus.toJS(), `preSalesAudit/${ind}.loading`)
      } else if (auditTypeFromRoute === postSales) {
        savedLoading = postSalesAuditUpdateStatus && get(postSalesAuditUpdateStatus.toJS(), `postSalesAudit/${ind}.loading`)
      } else if (auditTypeFromRoute === mentor) {
        savedLoading = mentorMenteeSessionAuditUpdating
          && get(mentorMenteeSessionAuditUpdating.toJS(), `mentorMenteeSessionAudit/${ind}.loading`)
      }
      const auditQuestionWithSubSection = auditQuestionOfSection.filter(auditQuestion =>
        get(auditQuestion, 'auditQuestion.subSection'))
      const auditQuestionWithOutSubSection = auditQuestionOfSection.filter(auditQuestion =>
        !get(auditQuestion, 'auditQuestion.subSection'))
      const groupBySubSection = auditQuestionWithSubSection.reduce((accumulator, currentValue) => {
        accumulator[get(currentValue, 'auditQuestion.subSection.title')] =
          accumulator[get(currentValue, 'auditQuestion.subSection.title')] || []
        accumulator[get(currentValue, 'auditQuestion.subSection.title')].push(currentValue)
        return accumulator
      }, {})
      const sectionScore = [...get(stateAuditData, 'customSectionScore')].find(section =>
        get(section, 'questionSection.title') === key)
      sectionQuestions.push((
        <div>
          <div style={rowStyleInner}>
            <h1 style={titleStyle}>{key}</h1>
            <InputNumber
              value={get(sectionScore, 'customScore') || 0}
              onChange={(value) => {
                if (typeof value === 'number') {
                  this.onStateChange(parseInt(value, 0), key, 'sectionCustomScore')
                }
              }}
            />
          </div>
          <div style={flexContainer}>
            {
              sortBy(auditQuestionWithOutSubSection, 'auditQuestion.order').map((auditQuestion) =>
                this.renderQuestions(auditQuestion, key))
            }
            {
              Object.keys(groupBySubSection).map(subKey => {
              const auditQuestionOfSubSection = get(stateAuditData, 'auditQuestionsData', []).filter(auditQuestion =>
                get(auditQuestion, 'auditQuestion.section.title') === key
                && get(auditQuestion, 'auditQuestion.subSection.title') === subKey)
              if (auditQuestionOfSubSection && auditQuestionOfSubSection.length > 0) {
                return (
                  <div style={{ width: '100%' }}>
                    <h1 style={{ ...titleStyle, fontSize: '18px' }}>{subKey}</h1>
                    <div style={flexContainer}>
                      {
                        sortBy(auditQuestionOfSubSection, 'auditQuestion.order').map((auditQuestion) =>
                          this.renderQuestions(auditQuestion, key))
                      }
                    </div>
                  </div>
                )
              }
            })
            }
          </div>
          {!isViewOnlyMode && (
          <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
          >
            <Button
              type='default'
              shape='round'
              size='large'
              style={saveButtonStyle}
              disabled={auditStatus === 'completed'}
              loading={savedLoading}
              onClick={() => this.updateAuditData(ind)}
            >
              Save {key} Audit
            </Button>
          </div>
          )}
          <Divider style={{ height: '2px' }} />
        </div>
      ))
    })
    if (notInSection && notInSection.length > 0) {
      let savedLoading = false
      if (auditTypeFromRoute === preSales) {
        savedLoading = preSalesAuditUpdateStatus && get(preSalesAuditUpdateStatus.toJS(), 'preSalesAudit/otherAudits100.loading')
      } else if (auditTypeFromRoute === postSales) {
        savedLoading = postSalesAuditUpdateStatus && get(postSalesAuditUpdateStatus.toJS(), 'postSalesAudit/otherAudits100.loading')
      } else if (auditTypeFromRoute === mentor) {
        savedLoading = mentorMenteeSessionAuditUpdating
          && get(mentorMenteeSessionAuditUpdating.toJS(), 'mentorMenteeSessionAudit/otherAudits100.loading')
      }
      sectionQuestions.push((
        <div>
          <div style={rowStyleInner}>
            <h1 style={titleStyle}>Other Audits</h1>
          </div>
          <div style={flexContainer}>
            {
                notInSection.map((auditQuestion) =>
                  this.renderQuestions(auditQuestion))
              }
          </div>
          {!isViewOnlyMode && (
          <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <Button
              type='default'
              shape='round'
              size='large'
              style={saveButtonStyle}
              disabled={auditStatus === 'completed'}
              loading={savedLoading}
              onClick={() => this.updateAuditData('otherAudits100')}
            >
                  Save Other Audit
            </Button>
          </div>
              )}
          <Divider style={{ height: '2px' }} />
        </div>
      ))
    }
    return sectionQuestions
  }
  setAudioFile = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (get(get(event.target.files, '[0].type', '').split('/'), '[0]', '') === 'audio') {
        this.setState({
          audioFile: event.target.files[0],
          auditAudioFile: URL.createObjectURL(event.target.files[0]),
        })
      } else {
        notification.warn({
          message: 'Unsupported file format.'
        })
      }
    }
  }
  uploadAudioFile = async () => {
    const { audioFile, stateAuditData } = this.state
    const { match } = this.props
    const auditId = get(match, 'params.auditId')
    const auditTypeFromRoute = get(match, 'params.auditType')
    this.setState({
      imageUploading: true
    })
    await addAuditAudio({
      file: audioFile,
      auditTypeValue: auditTypeFromRoute,
      auditId,
      prevFileId: get(stateAuditData, 'auditAudioFile.id')
    }).then(() => {
      this.setState({
        imageUploading: false,
        audioFile: null,
      }, this.fetchAuditDetails)
    }).catch((error) => {
      notification.error({
        message: get(error, 'errors[0].message')
      })
    })
  }
  render() {
    const { preSalesAuditFetchStatus, isMentorMenteeSessionAuditFetching,
      preSalesAuditUpdateStatus, postSalesAuditFetchStatus,
      postSalesAuditUpdateStatus, mentorMenteeSessionAuditUpdating } = this.props
    const auditTypeFromRoute = get(this.props, 'match.params.auditType')
    let loading = false
    if (auditTypeFromRoute === preSales) {
      loading = preSalesAuditFetchStatus && get(preSalesAuditFetchStatus.toJS(), 'loading')
    } else if (auditTypeFromRoute === mentor) {
      loading = isMentorMenteeSessionAuditFetching
    } else if (auditTypeFromRoute === postSales) {
      loading = postSalesAuditFetchStatus && get(postSalesAuditFetchStatus.toJS(), 'loading')
    }
    const { stateAuditData, isViewOnlyMode, totalQualityScore,
      customSectionWiseScore, overAllQuestionScore,
      audioFile, auditAudioFile, imageUploading, isBatchAudit } = this.state
    let savedLoading = false
    if (auditTypeFromRoute === preSales) {
      savedLoading = preSalesAuditUpdateStatus && get(preSalesAuditUpdateStatus.toJS(), 'preSalesAudit/completed.loading')
    } else if (auditTypeFromRoute === postSales) {
      savedLoading = postSalesAuditUpdateStatus && get(postSalesAuditUpdateStatus.toJS(), 'postSalesAudit/completed.loading')
    } else if (auditTypeFromRoute === mentor) {
      savedLoading = mentorMenteeSessionAuditUpdating
        && get(mentorMenteeSessionAuditUpdating.toJS(), 'mentorMenteeSessionAudit/completed.loading')
    }
    return (
      <Spin
        spinning={loading}
        size='large'
      >
        <div style={{ height: 'auto', padding: '0px 20px' }}>
          <TopSection
            isViewOnlyMode={this.state.isViewOnlyMode}
            totalQualityScore={totalQualityScore}
            customSectionWiseScore={customSectionWiseScore}
            auditTypeFromRoute={auditTypeFromRoute}
            stateAuditData={stateAuditData}
            overAllQuestionScore={overAllQuestionScore}
            isBatchAudit={isBatchAudit}
            mentorMenteeSession={this.state.mentorMenteeSession}
          />
          {
            auditTypeFromRoute !== mentor && (
              <div>
                <h1 style={titleStyle}>Audit Audio</h1>
                {
                  auditAudioFile && (
                    <div style={{ position: 'relative', width: '50%' }}>
                      <AudioPlayer audioSrc={auditAudioFile} />
                    </div>
                  )
                }
                <div style={{ display: 'flex', marginTop: '20px' }}>
                  <AudioDropzone
                    audioFile={audioFile}
                    audioFileUri={auditAudioFile}
                    setAudioFile={this.setAudioFile}
                  />
                  <Button onClick={this.uploadAudioFile}
                    loading={imageUploading}
                    disabled={!audioFile}
                    style={{ margin: '0 10px' }}
                  >Upload
                  </Button>
                </div>
                <Divider style={{ height: '2px' }} />
              </div>
            )
          }
          {this.renderSectionWiseQuestion()}
          <div style={{ marginTop: '15px' }}>
            <div style={{ marginTop: '15px' }}>
              <p style={titleStyle}>Conclude Class</p>
            </div>
            <TextArea
              readOnly={isViewOnlyMode}
              rows={3}
              placeholder='Add Final Comment'
              style={{ width: '85%' }}
              value={get(stateAuditData, 'overallClassComment')}
              onChange={({ target: { value } }) => this.onStateChange(value, null, 'overallClassComment')}
            />
            {!isViewOnlyMode && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              >
                <div>
                  <Button
                    type='default'
                    shape='round'
                    size='large'
                    style={saveButtonStyle}
                    loading={savedLoading}
                    onClick={() => this.updateAuditData('completed')}
                  >
                    Save and Complete Audit
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Spin>
    )
  }
}

export default MentorAudit
