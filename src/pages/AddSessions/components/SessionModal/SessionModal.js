import { PlusOutlined } from '@ant-design/icons'
import { Icon, Input, notification, Spin } from 'antd'
import { get, sortBy } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import RadioGroup from 'antd/lib/radio/group'
import {
  DragDropContext, Draggable, Droppable
} from 'react-beautiful-dnd'
import {
  filterKey, getOrderAutoComplete, getOrdersInUse,
  getSuccessStatus, isPythonCourse
} from '../../../../utils/data-utils'
import {
  ComponentPool, ComponentTab, ComponentTags,
  StyledButton, StyledModal, StyledSwitch, TopContainer
} from '../../AddSessions.styles'
import ComponentIcon from '../session-utils/ComponentIcon'
import getComponentName from '../../../../utils/getComponentName'
import dotIcons from '../../../../assets/dotsIcon.png'
import {
  LearningObjective, CodingAssignment,
  Quiz, Project, Practice, Videos
} from './SessionTabs'
import {
  ASSIGNMENT, HOMEWORK_ASSIGNMENT, LEARNING_OBJECTIVE,
  PRACTICE,
  PROJECT, QUIZ, VIDEO
} from '../../../../constants/CourseComponents'
import {
  addTopicSession, updateTopicSessions,
  removeComponentFromSession, fetchSingleComponent,
  fetchTopicData,
  fetchMessageQuestionAndComic,
} from '../../../../actions/courseMaker'
import parseChatStatement from '../../../../utils/parseStatement'
import Dropzone from '../../../../components/Dropzone'
import getFullPath from '../../../../utils/getFullPath'
import MainModal from '../../../../components/MainModal'
import SearchInput from '../SearchInput'
import HomeWorkAssignment from './SessionTabs/HomeWorkAssignment'
import { PUBLISHED_STATUS, UNPUBLISHED_STATUS } from '../../../../constants/questionBank'

class SessionModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 0,
      sessionTopic: '',
      sessionDescription: '',
      selectedComponents: [],
      selectedTab: '',
      videoList: [],
      quizList: [],
      projectList: [],
      practiceList: [],
      loList: [],
      assignmentList: [],
      chaptersList: [],
      homeworkAssignmentList: [],
      selectedChapter: '',
      imageFile: null,
      imageUrl: null,
      smallThumbnail: null,
      smallThumbnailUrl: null,
      isTrial: false,
      courseId: get(props, 'match.params.courseId'),
      selectedCourseLo: [],
      showLoading: false,
      status: UNPUBLISHED_STATUS
    }
  }
  componentDidMount = async () => {
    const { sessionData, operation, editData, match } = this.props
    const courseIdFromRoute = get(match, 'params.courseId')
    if (operation === 'add') {
      const orders = getOrdersInUse(sessionData)
      const orderAutoComplete = getOrderAutoComplete(orders)
      this.setState({
        order: orderAutoComplete,
        isTrial: true,
      })
      const { chapters: chaptersList = [] } =
        await fetchTopicData(null, courseIdFromRoute)
      const { learningObjectives: loData } = await fetchMessageQuestionAndComic(courseIdFromRoute)
      this.setState({
        chaptersList,
        selectedCourseLo: loData || []
      })
    } else if (operation === 'edit') {
      this.setState({
        showLoading: true
      })
      const { learningObjectives: loData } = await fetchMessageQuestionAndComic(courseIdFromRoute)
      this.setState({
        order: get(editData, 'order'),
        isTrial: get(editData, 'isTrial'),
        sessionTopic: get(editData, 'title'),
        sessionDescription: get(editData, 'description', ''),
        selectedCourseLo: loData || [],
        status: get(editData, 'status')
      }, () => this.setDefaultValue())
    }
  }

  componentDidUpdate = async (prevProps, prevState) => {
    const { videoFetchingStatus, questionBankFetchingStatus,
      projectFetchingStatus, practiceFetchingStatus,
      learningObectiveFetchingStatus, assignmentFetchingStatus,
      homeworkAssignmentFetchStatus } = this.props
    if (getSuccessStatus(videoFetchingStatus, prevProps.videoFetchingStatus)) {
      this.setComponentSelectorList('videoList', this.props.videoData ?
        this.props.videoData.toJS() : [])
    }
    if (getSuccessStatus(questionBankFetchingStatus, prevProps.questionBankFetchingStatus)) {
      this.setComponentSelectorList('quizList', this.props.questionBankData ?
        this.props.questionBankData.toJS() : [])
    }
    if (getSuccessStatus(projectFetchingStatus, prevProps.projectFetchingStatus)) {
      this.setComponentSelectorList('projectList', this.props.projectData ?
        this.props.projectData.toJS() : [])
    }
    if (getSuccessStatus(practiceFetchingStatus, prevProps.practiceFetchingStatus)) {
      this.setComponentSelectorList('practiceList', this.props.practiceData ?
        this.props.practiceData.toJS() : [])
    }
    if (getSuccessStatus(learningObectiveFetchingStatus,
      prevProps.learningObectiveFetchingStatus)) {
      this.setComponentSelectorList('loList', this.props.learningObjectiveData ?
        this.props.learningObjectiveData.toJS() : [])
    }
    if (getSuccessStatus(assignmentFetchingStatus, prevProps.assignmentFetchingStatus)) {
      this.setComponentSelectorList('assignmentList', this.props.assignmentData ?
        this.props.assignmentData.toJS() : [])
    }

    if (getSuccessStatus(homeworkAssignmentFetchStatus, prevProps.homeworkAssignmentFetchStatus)) {
      this.setComponentSelectorList('homeworkAssignmentList', this.props.homeworkAssignmentData ?
        this.props.homeworkAssignmentData.toJS() : [])
    }
    const { selectedTab, courseId } = this.state
    const isLOTabActive = selectedTab.includes(LEARNING_OBJECTIVE)
    if (prevState.courseId !== courseId && isLOTabActive) {
      await fetchMessageQuestionAndComic(courseId)
    }
  }

  setComponentSelectorList = (type, componentData = []) => {
    const { courseId } = this.state
    const { match } = this.props
    const courseIdFromRoute = get(match, 'params.courseId')
    if (type === 'quizList') {
      componentData = componentData.filter(data =>
        get(data, 'courses', []).map(course => get(course, 'id')).includes(courseIdFromRoute))
    } else {
      componentData = componentData.filter(data =>
        get(data, 'courses', []).map(course => get(course, 'id')).includes(courseId))
    }
    this.setState({
      [type]: componentData
    })
  }
  getComponentCount = (componentName) => {
    const { selectedComponents } = this.state
    const isExist = selectedComponents.find(component =>
      get(component, 'componentName') === componentName)
    if (isExist) {
      const componentArray = selectedComponents.filter(component =>
        get(component, 'componentName') === componentName)
      return componentArray.length
    }
    return 0
  }
  renderComponentPool = () => {
    const { coursesList, match } = this.props
    const courseIdFromRoute = get(match, 'params.courseId')
    const { selectedComponents } = this.state
    let components = []
    if (courseIdFromRoute && coursesList.length > 0) {
      components = get(coursesList.find(course =>
        get(course, 'id') === courseIdFromRoute), 'courseComponentRule')
    }
    if (components.length > 0) {
      const componentPool = get(coursesList.find(course =>
        get(course, 'id') === courseIdFromRoute), 'courseComponentRule')
      return (
        <ComponentPool>
          {sortBy(componentPool, 'order').map(component => (
            <ComponentTags
              selected={selectedComponents.map(compo =>
                get(compo, 'componentName')).includes(get(component, 'componentName'))}
              onClick={() => this.handleSelectComponent(component)}
            >
              <ComponentIcon componentName={get(component, 'componentName')} />
              <strong style={{ margin: '0 10px' }}>
                {getComponentName(get(component, 'componentName'))}
                <span style={{ marginLeft: '10px' }}>
                  ({this.getComponentCount(get(component, 'componentName'))})
                </span>
              </strong>
              <PlusOutlined />
            </ComponentTags>
          ))}
        </ComponentPool>
      )
    }
    return <h3><strong>No Component Available</strong></h3>
  }
  handleSelectComponent = (component) => {
    const { selectedComponents } = this.state
    const nextOrder = selectedComponents.length === 0 ? 1 :
      Math.max(...selectedComponents.map((data) => data.order)) + 1
    let newComponents = []
    if (get(component, 'componentName') === QUIZ || get(component, 'componentName') === ASSIGNMENT
      || get(component, 'componentName') === HOMEWORK_ASSIGNMENT) {
      const isExist = selectedComponents.find(comp => get(comp, 'componentName') === get(component, 'componentName'))
      if (!isExist) {
        newComponents = [...selectedComponents, {
          ...component,
          order: nextOrder,
          uniqueName: `${get(component, 'componentName')}${nextOrder}`,
          selectedValue: [],
          selectedData: [],
          selectedLo: []
        }]
      } else {
        notification.warn({
          message: 'Component Already added'
        })
        return
      }
    } else {
      const { match, coursesList } = this.props
      const courseIdFromRoute = get(match, 'params.courseId')
      const componentPool = get(coursesList.find(course =>
        get(course, 'id') === courseIdFromRoute), 'courseComponentRule')
      const componentMinMaxValue = componentPool.find(compo =>
        get(compo, 'componentName') === get(component, 'componentName'))
      const existCount = selectedComponents.filter(comp =>
        get(comp, 'componentName') === get(component, 'componentName'))
      if (existCount.length < get(componentMinMaxValue, 'max')) {
        newComponents = [...selectedComponents, {
          ...component,
          order: nextOrder,
          uniqueName: `${get(component, 'componentName')}${nextOrder}`,
          selectedValue: [],
          selectedData: []
        }]
      } else {
        notification.warn({
          message: `Maximum ${get(componentMinMaxValue, 'max')} 
          ${getComponentName(get(component, 'componentName'))} can be added`
        })
        return
      }
    }
    this.setState({
      selectedComponents: newComponents,
      selectedTab: `${get(component, 'componentName')}${nextOrder}`
    })
  }

  handleRemoveComponent = (component) => {
    const { selectedComponents } = this.state
    const isExist = selectedComponents.find(comp =>
      get(comp, 'uniqueName') === get(component, 'uniqueName'))
    if (isExist) {
      this.setState({
        selectedComponents: selectedComponents.filter(comp =>
          get(comp, 'uniqueName') !== get(component, 'uniqueName'))
      }, async () => {
        this.onRemoveComponent(isExist, true)
        const componentsArray = [...this.state.selectedComponents]
        let newTab = ''
        if (componentsArray.length > 0) {
          newTab = get(componentsArray[componentsArray.length - 1], 'uniqueName')
        }
        this.setState({
          selectedTab: newTab
        })
      })
    }
  }

  rowStyle = (isDragging, dragglePropsStyle) => (
    {
      maxWidth: '450px',
      margin: '0 auto',
      background: isDragging ? 'lightgray' : 'white',
      ...dragglePropsStyle
    }
  )
  reorder = (data, startIndex, endIndex) => {
    const result = Array.from(data)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }

  onDragEnd = (result) => {
    // dropped outside the list
    const { selectedComponents } = this.state
    if (!result.destination) {
      return
    }
    const data = [...selectedComponents]
    const draggedContent = this.reorder(
      data,
      result.source.index,
      result.destination.index
    )
    const newComponents = []
    draggedContent.forEach((component, i) => {
      const order = i + 1
      newComponents.push({
        ...component,
        order,
        uniqueName: `${get(component, 'componentName')}${order}`,
      })
    })
    this.setState({
      selectedComponents: newComponents
    })
  }

  setDefaultValue = async () => {
    const { editData, match } = this.props
    const courseIdFromRoute = get(match, 'params.courseId')
    const fetchedData = await fetchTopicData(get(editData, 'id'), courseIdFromRoute)
    const { chapters: chaptersData } = fetchedData
    const { topic: topicData } = fetchedData
    if (chaptersData && chaptersData.length > 0) {
      this.setState({
        chaptersList: chaptersData
      })
    }
    if (topicData) {
      const newSelectedComponent = []
      get(topicData, 'topicComponentRule', []).forEach(component => {
        if (get(component, 'componentName') === QUIZ) {
          let selectedValue = []
          let selectedData = []
          const selectedLo = []
          if (isPythonCourse(courseIdFromRoute)) {
            selectedValue = get(topicData, 'quiz', []).map((quiz) => ({
              label: parseChatStatement({
                statement: get(quiz, 'statement')
              }),
              key: get(quiz, 'id')
            }))
            selectedData = get(topicData, 'quiz', []).map(quiz => ({
              order: get(quiz, 'order', 0),
              data: quiz
            }))
            if (get(topicData, 'quiz', []).length > 0) {
              get(topicData, 'quiz', []).forEach(quiz => {
                const addedLoIds = selectedLo.map(lo => get(lo, 'key'))
                const currentCourseLo = this.state.selectedCourseLo.map(lo => get(lo, 'id'))
                const loFromQuizOfCurrCourse = get(quiz, 'learningObjectives', []).find(lo =>
                  currentCourseLo.includes(get(lo, 'id')))
                if (loFromQuizOfCurrCourse && !addedLoIds.includes(get(loFromQuizOfCurrCourse, 'id'))) {
                  selectedLo.push({
                    key: get(loFromQuizOfCurrCourse, 'id'),
                    label: get(loFromQuizOfCurrCourse, 'title'),
                  })
                }
              })
            }
          } else {
            selectedValue = get(topicData, 'quiz', []).map((quiz) => ({
              label: parseChatStatement({
                statement: get(quiz, 'question.statement')
              }),
              key: get(quiz, 'question.id')
            }))
            selectedData = sortBy(get(topicData, 'quiz', []).map(quiz => ({
              order: get(quiz, 'order', 0),
              data: get(quiz, 'question')
            })), 'order')
            if (get(topicData, 'quiz', []).length > 0) {
              get(topicData, 'quiz', []).forEach(quiz => {
                const addedLoIds = selectedLo.map(lo => get(lo, 'key'))
                const currentCourseLo = this.state.selectedCourseLo.map(lo => get(lo, 'id'))
                const loFromQuizOfCurrCourse = get(quiz, 'question.learningObjectives', []).find(lo =>
                  currentCourseLo.includes(get(lo, 'id')))
                if (loFromQuizOfCurrCourse && !addedLoIds.includes(get(loFromQuizOfCurrCourse, 'id'))) {
                  selectedLo.push({
                    key: get(loFromQuizOfCurrCourse, 'id'),
                    label: get(loFromQuizOfCurrCourse, 'title'),
                  })
                }
              })
            }
          }
          newSelectedComponent.push({
            ...component,
            uniqueName: `${get(component, 'componentName')}${get(component, 'order')}`,
            selectedValue,
            selectedData,
            selectedLo
          })
        } else if (get(component, 'componentName') === ASSIGNMENT) {
          let selectedValue = []
          let selectedData = []
          if (isPythonCourse(courseIdFromRoute)) {
            selectedValue = get(topicData, 'assignmentQuestions', []).map((quiz) => ({
              label: parseChatStatement({
                statement: get(quiz, 'statement')
              }),
              key: get(quiz, 'id')
            }))
            selectedData = get(topicData, 'assignmentQuestions').map(assignment => ({
              order: get(assignment, 'order', 0),
              data: assignment
            }))
          } else {
            selectedValue = get(topicData, 'assignmentQuestions', []).map((quiz) => ({
              label: parseChatStatement({
                statement: get(quiz, 'assignmentQuestion.statement')
              }),
              key: get(quiz, 'assignmentQuestion.id')
            }))
            selectedData = sortBy(get(topicData, 'assignmentQuestions').map(assignment => ({
              order: get(assignment, 'order', 0),
              data: get(assignment, 'assignmentQuestion')
            })), 'order')
          }
          newSelectedComponent.push({
            ...component,
            uniqueName: `${get(component, 'componentName')}${get(component, 'order')}`,
            selectedValue,
            selectedData
          })
        } else if (get(component, 'componentName') === HOMEWORK_ASSIGNMENT) {
          let selectedValue = []
          let selectedData = []
          if (isPythonCourse(courseIdFromRoute)) {
            selectedValue = get(topicData, 'homeworkAssignment', []).map((quiz) => ({
              label: parseChatStatement({
                statement: get(quiz, 'statement')
              }),
              key: get(quiz, 'id')
            }))
            selectedData = get(topicData, 'homeworkAssignment').map(assignment => ({
              order: get(assignment, 'order', 0),
              data: assignment
            }))
          } else {
            selectedValue = get(topicData, 'homeworkAssignment', []).map((quiz) => ({
              label: parseChatStatement({
                statement: get(quiz, 'assignmentQuestion.statement')
              }),
              key: get(quiz, 'assignmentQuestion.id')
            }))
            selectedData = sortBy(get(topicData, 'homeworkAssignment').map(assignment => ({
              order: get(assignment, 'order', 0),
              data: get(assignment, 'assignmentQuestion')
            })), 'order')
          }
          newSelectedComponent.push({
            ...component,
            uniqueName: `${get(component, 'componentName')}${get(component, 'order')}`,
            selectedValue,
            selectedData,
          })
        } else {
          let data = {}
          if (get(component, 'video')) {
            data = get(component, 'video')
          } else if (get(component, 'blockBasedProject')) {
            data = get(component, 'blockBasedProject')
          } else if (get(component, 'learningObjective')) {
            data = get(component, 'learningObjective')
          }
          newSelectedComponent.push({
            ...component,
            uniqueName: `${get(component, 'componentName')}${get(component, 'order')}`,
            selectedValue: [{ label: get(data, 'title'), key: get(data, 'id') }],
            selectedData: [data]
          })
        }
      })
      this.setState({
        selectedComponents: newSelectedComponent,
        selectedChapter: get(topicData, 'chapter.id', ''),
        showLoading: false
      }, () => {
        if (get(topicData, 'topicComponentRule', []).length > 0) {
          this.setState({
            selectedTab: get(this.state, 'selectedComponents[0].uniqueName', '')
          })
        }
      })
    } else {
      notification.warn({
        message: 'Something went wrong'
      })
    }
  }

  onValueSelect = async (value, uniqueName, type, fromQuizLo = false) => {
    const { selectedComponents } = this.state
    if (type === QUIZ || type === ASSIGNMENT || type === HOMEWORK_ASSIGNMENT) {
      const commonAddFunc = (existIndex, newData) => {
        const newComponent = [...selectedComponents]
        const [findComponent] = newComponent.splice(existIndex, 1)
        findComponent.selectedValue = [value, ...findComponent.selectedValue]
        const nextOrder = findComponent.selectedData.length === 0 ? 1 :
          Math.max(...findComponent.selectedData.map((data) => data.order)) + 1
        findComponent.selectedData = [{
          order: nextOrder,
          data: newData
        }, ...findComponent.selectedData]
        findComponent.selectedData = sortBy(findComponent.selectedData, 'order')
        newComponent.splice(existIndex, 0, findComponent)
        this.setState({
          selectedComponents: newComponent
        })
      }
      const existIndex = selectedComponents.findIndex(component => get(component, 'uniqueName') === uniqueName)
      if (existIndex !== -1) {
        if (type === QUIZ) {
          if (fromQuizLo) {
            // adding multiple quiz from the selected LO
            const { data: componentdata } = await fetchSingleComponent(get(value, 'key'), 'QuestionsFromLo')
            if (componentdata && get(componentdata, 'questionBanks', []).length > 0) {
              const newComponent = [...selectedComponents]
              const [findComponent] = newComponent.splice(existIndex, 1)
              findComponent.selectedLo = [value, ...findComponent.selectedLo]
              const quizValues = [...findComponent.selectedValue]
              const quizData = [...findComponent.selectedData]
              get(componentdata, 'questionBanks', []).forEach(question => {
                const selectedQuizValue = quizValues.map(quiz => get(quiz, 'key'))
                if (!selectedQuizValue.includes(get(question, 'id'))) {
                  quizValues.unshift({
                    key: get(question, 'id'),
                    label: get(question, 'statement')
                  })
                }
                const selectedQuizData = quizData.map(quiz => get(quiz, 'data.id'))
                if (!selectedQuizData.includes(get(question, 'id'))) {
                  const nextOrder = quizData.length === 0 ? 1 :
                    Math.max(...quizData.map((data) => data.order)) + 1
                  quizData.push({
                    order: nextOrder,
                    data: question
                  })
                }
              })
              findComponent.selectedValue = [...quizValues]
              findComponent.selectedData = sortBy(quizData, 'order')
              newComponent.splice(existIndex, 0, findComponent)
              this.setState({
                selectedComponents: newComponent
              })
            } else {
              notification.warn({
                message: 'No Quiz available'
              })
            }
          } else {
            // adding single quiz at a time
            const { data: componentdata } = await fetchSingleComponent(get(value, 'key'), type)
            let newData = {}
            if (componentdata) {
              newData = get(componentdata, 'questionBank')
            }
            commonAddFunc(existIndex, newData)
          }
        } else if (type === ASSIGNMENT || type === HOMEWORK_ASSIGNMENT) {
          const { data: componentdata } = await fetchSingleComponent(get(value, 'key'), type)
          let newData = {}
          if (componentdata) {
            newData = get(componentdata, 'assignmentQuestion')
          }
          commonAddFunc(existIndex, newData)
        }
      }
    } else {
      const existIndex = selectedComponents.findIndex(component => get(component, 'uniqueName') === uniqueName)
      if (existIndex !== -1) {
        const { data: componentdata } = await fetchSingleComponent(get(value, 'key'), type)
        let newData = {}
        if (componentdata) {
          if (type === VIDEO) {
            newData = get(componentdata, 'video')
          } else if (type === LEARNING_OBJECTIVE) {
            newData = get(componentdata, 'learningObjective')
          } else if (type === PRACTICE || type === PROJECT) {
            newData = get(componentdata, 'blockBasedProject')
          }
        }
        const newComponent = [...selectedComponents]
        const [findComponent] = newComponent.splice(existIndex, 1)
        findComponent.selectedValue = [value]
        findComponent.selectedData = [newData]
        newComponent.splice(existIndex, 0, findComponent)
        this.setState({
          selectedComponents: newComponent
        })
      }
    }
  }
  onRemoveComponent = (data, shouldDelete) => {
    const { operation, editData, match } = this.props
    const componentName = get(data, 'componentName')
    const courseIdFromRoute = get(match, 'params.courseId')
    if (operation === 'edit' && shouldDelete) {
      get(data, 'selectedValue', []).forEach(value => {
        if (isPythonCourse(courseIdFromRoute)) {
          removeComponentFromSession(
            get(editData, 'id'),
            get(value, 'key'),
            componentName
          )
        } else if (componentName !== QUIZ
          && componentName !== ASSIGNMENT
          && componentName !== HOMEWORK_ASSIGNMENT) {
          removeComponentFromSession(
            get(editData, 'id'),
            get(value, 'key'),
            componentName
          )
        }
      })
    }
  }
  onValueDeselect = async (value, type, uniqueName, fromQuizLo) => {
    const { selectedComponents } = this.state
    if (type === QUIZ || type === ASSIGNMENT || type === HOMEWORK_ASSIGNMENT) {
      const existIndex = selectedComponents.findIndex(component => get(component, 'uniqueName') === uniqueName)
      if (existIndex !== -1) {
        const newComponent = [...selectedComponents]
        const [findComponent] = newComponent.splice(existIndex, 1)
        const prevSelectedValue = [...findComponent.selectedValue]
        const prevSelectedData = [...findComponent.selectedData]
        const commonDeleteFunc = () => {
          findComponent.selectedValue = prevSelectedValue.filter(val => get(val, 'key') !== get(value, 'key'))
          findComponent.selectedData = prevSelectedData.filter(val => get(val, 'data.id') !== get(value, 'key'))
          findComponent.selectedData = sortBy(findComponent.selectedData, 'order')
          newComponent.splice(existIndex, 0, findComponent)
          this.setState({
            selectedComponents: newComponent
          })
        }
        if (type === QUIZ) {
          if (fromQuizLo) {
            const prevSelectedLo = [...findComponent.selectedLo]
            let prevSelectedQuizData = [...findComponent.selectedData]
            let prevSelectedQuizValue = [...findComponent.selectedValue]
            const { data: componentdata } = await fetchSingleComponent(get(value, 'key'), 'QuestionsFromLo')
            findComponent.selectedLo = prevSelectedLo.filter(val => get(val, 'key') !== get(value, 'key'))
            if (componentdata && get(componentdata, 'questionBanks', []).length > 0) {
              get(componentdata, 'questionBanks', []).forEach(quiz => {
                prevSelectedQuizValue = prevSelectedQuizValue.filter(val => get(val, 'key') !== get(quiz, 'id'))
                prevSelectedQuizData = prevSelectedQuizData.filter(val => get(val, 'data.id') !== get(quiz, 'id'))
              })
              findComponent.selectedData = sortBy(prevSelectedQuizData, 'order')
              findComponent.selectedValue = prevSelectedQuizValue
              newComponent.splice(existIndex, 0, findComponent)
              this.setState({
                selectedComponents: newComponent
              })
            }
          } else commonDeleteFunc()
        } else if (type === ASSIGNMENT || type === HOMEWORK_ASSIGNMENT) commonDeleteFunc()
      }
    } else {
      const existIndex = selectedComponents.findIndex(component => get(component, 'uniqueName') === uniqueName)
      if (existIndex !== -1) {
        const foundData = selectedComponents.find(component => get(component, 'uniqueName') === uniqueName)
        const newComponent = [...selectedComponents]
        newComponent.splice(existIndex, 1)
        this.onRemoveComponent(foundData)
        this.setState({
          selectedComponents: newComponent
        })
      }
    }
    const { operation, editData, match } = this.props
    const courseIdFromRoute = get(match, 'params.courseId')
    if (operation === 'edit') {
      if (isPythonCourse(courseIdFromRoute)) {
        await removeComponentFromSession(
          get(editData, 'id'),
          get(value, 'key'),
          type
        )
      } else if (type !== QUIZ && type !== ASSIGNMENT) {
        await removeComponentFromSession(
          get(editData, 'id'),
          get(value, 'key'),
          type
        )
      }
    }
  }

  disableSave = () => {
    const {
      selectedComponents, sessionTopic, order
    } = this.state
    let count = 0
    selectedComponents.forEach((component) => {
      if (get(component, 'selectedData', []).length === 0
        || get(component, 'selectedValue', []).length === 0) {
        count += 1
      }
    })
    const { operation } = this.props
    if (operation === 'add') {
      if (count === 0 && sessionTopic !== '' && order > 0) {
        return false
      }
    } else if (operation === 'edit') {
      if (sessionTopic !== '' && order > 0) {
        return false
      }
    }
    return true
  }

  onReorderSave = (dataArray, component) => {
    const newSelectedComponent = [...this.state.selectedComponents]
    const componentInd = newSelectedComponent.findIndex(compo =>
      get(compo, 'uniqueName') === get(component, 'uniqueName'))
    if (componentInd >= 0) {
      newSelectedComponent[componentInd].selectedData = sortBy(dataArray, 'order')
      this.setState({
        selectedComponents: newSelectedComponent
      })
    }
  }
  renderTabs = () => {
    const { selectedTab, selectedComponents,
      videoList, quizList, projectList, practiceList,
      loList, assignmentList, courseId, selectedCourseLo,
      homeworkAssignmentList } = this.state
    const { match } = this.props
    return selectedComponents.map(component => {
      if (get(component, 'componentName') === VIDEO && get(component, 'uniqueName') === selectedTab) {
        return (
          <Videos
            key={get(component, 'uniqueName')}
            onValueSelect={this.onValueSelect}
            onValueDeselect={this.onValueDeselect}
            videoList={videoList}
            courseId={courseId}
            {...component}
          />
        )
      } else if (get(component, 'componentName') === LEARNING_OBJECTIVE && get(component, 'uniqueName') === selectedTab) {
        return (
          <LearningObjective
            key={get(component, 'uniqueName')}
            onValueSelect={this.onValueSelect}
            onValueDeselect={this.onValueDeselect}
            loList={loList}
            courseId={courseId}
            {...component}
          />
        )
      } else if (get(component, 'componentName') === ASSIGNMENT && get(component, 'uniqueName') === selectedTab) {
        return (
          <CodingAssignment
            key={get(component, 'uniqueName')}
            onValueSelect={this.onValueSelect}
            onValueDeselect={this.onValueDeselect}
            assignmentList={assignmentList}
            onReorderSaved={(dataArray) =>
              this.onReorderSave(dataArray, component)}
            courseId={courseId}
            {...match}
            {...component}
          />
        )
      } else if (get(component, 'componentName') === QUIZ && get(component, 'uniqueName') === selectedTab) {
        return (
          <Quiz
            key={get(component, 'uniqueName')}
            onValueSelect={this.onValueSelect}
            onValueDeselect={this.onValueDeselect}
            quizList={quizList}
            loList={selectedCourseLo}
            onReorderSaved={(dataArray) =>
              this.onReorderSave(dataArray, component)}
            courseId={courseId}
            {...match}
            {...component}
          />
        )
      } else if (get(component, 'componentName') === PROJECT && get(component, 'uniqueName') === selectedTab) {
        return (
          <Project
            key={get(component, 'uniqueName')}
            onValueSelect={this.onValueSelect}
            onValueDeselect={this.onValueDeselect}
            projectList={projectList}
            courseId={courseId}
            {...component}
          />
        )
      } else if (get(component, 'componentName') === PRACTICE && get(component, 'uniqueName') === selectedTab) {
        return (
          <Practice
            key={get(component, 'uniqueName')}
            onValueSelect={this.onValueSelect}
            onValueDeselect={this.onValueDeselect}
            practiceList={practiceList}
            courseId={courseId}
            {...component}
          />
        )
      } else if (get(component, 'componentName') === HOMEWORK_ASSIGNMENT && get(component, 'uniqueName') === selectedTab) {
        return (
          <HomeWorkAssignment
            key={get(component, 'uniqueName')}
            onValueSelect={this.onValueSelect}
            onValueDeselect={this.onValueDeselect}
            assignmentList={homeworkAssignmentList}
            onReorderSaved={(dataArray) =>
              this.onReorderSave(dataArray, component)}
            courseId={courseId}
            {...match}
            {...component}
          />
        )
      }
    })
  }

  onSave = async () => {
    const {
      selectedComponents, sessionTopic, order,
      imageFile, sessionDescription, isTrial,
      selectedChapter, smallThumbnail,
      status
    } = this.state
    const { operation, editData, match } = this.props
    const courseIdFromRoute = get(match, 'params.courseId')
    const componentInput = []
    let questionsConnectId = []
    let assignmentConnectId = []
    const videoConnectId = []
    const loConnectId = []
    const blockBasedConnectId = []
    const topicQuestions = []
    const topicAssignmentQuestions = []
    const topicHomeworkAssignmentQuestion = []
    let updateComponentQuery = ''
    selectedComponents.forEach((component, ind) => {
      if (get(component, 'componentName') === VIDEO) {
        const videoId = get(component, 'selectedValue[0].key')
        if (videoId) {
          videoConnectId.push(videoId)
          updateComponentQuery += `video${ind}: updateVideo(id: "${videoId}", 
          coursesConnectIds: ["${courseIdFromRoute}"]) {
            id
          }`
          componentInput.push({
            componentName: get(component, 'componentName'),
            order: get(component, 'order'),
            videoConnectId: videoId
          })
        }
      } else if (get(component, 'componentName') === QUIZ) {
        if (isPythonCourse(courseIdFromRoute)) {
          questionsConnectId = get(component, 'selectedValue', []).map(quiz => get(quiz, 'key'))
        } else {
          get(component, 'selectedData', []).forEach(data => {
            topicQuestions.push({
              order: get(data, 'order'),
              questionConnectId: get(data, 'data.id')
            })
          })
        }
        get(component, 'selectedValue', []).forEach((quiz, index) => {
          updateComponentQuery += `quiz${ind}${index}: updateQuestionBank(id: "${get(quiz, 'key')}",
            coursesConnectIds: ["${courseIdFromRoute}"]) {
              id
            }`
        })
        componentInput.push({
          componentName: get(component, 'componentName'),
          order: get(component, 'order'),
        })
      } else if (get(component, 'componentName') === PROJECT) {
        const projectId = get(component, 'selectedValue[0].key')
        if (projectId) {
          blockBasedConnectId.push(projectId)
          updateComponentQuery += `project${ind}: updateBlockBasedProject(id: "${projectId}",
            coursesConnectIds: ["${courseIdFromRoute}"]) {
              id
            }`
          componentInput.push({
            componentName: get(component, 'componentName'),
            order: get(component, 'order'),
            blockBasedProjectConnectId: projectId
          })
        }
      } else if (get(component, 'componentName') === PRACTICE) {
        const practiceId = get(component, 'selectedValue[0].key')
        if (practiceId) {
          blockBasedConnectId.push(practiceId)
          updateComponentQuery += `practice${ind}: updateBlockBasedProject(id: "${practiceId}",
            coursesConnectIds: ["${courseIdFromRoute}"]) {
              id
            }`
          componentInput.push({
            componentName: get(component, 'componentName'),
            order: get(component, 'order'),
            blockBasedProjectConnectId: practiceId
          })
        }
      } else if (get(component, 'componentName') === LEARNING_OBJECTIVE) {
        const loId = get(component, 'selectedValue[0].key')
        if (loId) {
          updateComponentQuery += `lo${ind}: updateLearningObjective(id: "${loId}",
            coursesConnectIds: ["${courseIdFromRoute}"]) {
              id
            }`
          loConnectId.push(loId)
          componentInput.push({
            componentName: get(component, 'componentName'),
            order: get(component, 'order'),
            learningObjectiveConnectId: loId
          })
        }
      } else if (get(component, 'componentName') === ASSIGNMENT) {
        if (isPythonCourse(courseIdFromRoute)) {
          assignmentConnectId = [...assignmentConnectId, get(component, 'selectedValue', []).map(quiz => get(quiz, 'key'))]
        } else {
          get(component, 'selectedData', []).forEach(data => {
            topicAssignmentQuestions.push({
              order: get(data, 'order'),
              assignmentQuestionConnectId: get(data, 'data.id')
            })
          })
        }
        get(component, 'selectedValue', []).forEach((quiz, index) => {
          updateComponentQuery += `assignment${ind}${index}: updateAssignmentQuestion(id: "${get(quiz, 'key')}", 
            coursesConnectIds: ["${courseIdFromRoute}"]) {
              id
            }`
        })
        componentInput.push({
          componentName: get(component, 'componentName'),
          order: get(component, 'order'),
        })
      } else if (get(component, 'componentName') === HOMEWORK_ASSIGNMENT) {
        if (isPythonCourse(courseIdFromRoute)) {
          assignmentConnectId = [...assignmentConnectId, get(component, 'selectedValue', []).map(quiz => get(quiz, 'key'))]
        } else {
          get(component, 'selectedData', []).forEach(data => {
            topicHomeworkAssignmentQuestion.push({
              order: get(data, 'order'),
              assignmentQuestionConnectId: get(data, 'data.id')
            })
          })
        }
        get(component, 'selectedValue', []).forEach((quiz, index) => {
          updateComponentQuery += `assignment${ind}${index}: updateAssignmentQuestion(id: "${get(quiz, 'key')}", 
            coursesConnectIds: ["${courseIdFromRoute}"]) {
              id
            }`
        })
        componentInput.push({
          componentName: get(component, 'componentName'),
          order: get(component, 'order'),
        })
      }
    })
    if (operation === 'add') {
      let addInput = {
        input: {
          order: Number(order),
          title: sessionTopic,
          topicComponentRule: componentInput,
          description: sessionDescription,
          isTrial,
          status
        },
        videoConnectId: [...new Set(videoConnectId)],
        loConnectId: [...new Set(loConnectId)],
        blockBasedConnectId: [...new Set(blockBasedConnectId)],
        courseId: [courseIdFromRoute],
        chapterConnectId: selectedChapter || '',
        updateComponentQuery,
        thumbnail: imageFile,
        smallThumbnail
      }
      if (isPythonCourse(courseIdFromRoute)) {
        addInput = {
          ...addInput,
          questionsConnectId: [...new Set(questionsConnectId)],
          assignmentConnectId: [...new Set(assignmentConnectId)],
        }
      } else {
        addInput = {
          ...addInput,
          input: {
            ...addInput.input,
            topicQuestions,
            topicAssignmentQuestions,
            topicHomeworkAssignmentQuestion
          },
        }
      }
      await addTopicSession(addInput, courseIdFromRoute)
    } else if (operation === 'edit') {
      let editInput = {
        topicId: get(editData, 'id'),
        input: {
          order: Number(order),
          title: sessionTopic,
          description: sessionDescription || '',
          isTrial,
          status,
          topicComponentRule: {
            replace: componentInput
          },
        },
        videoConnectId: [...new Set(videoConnectId)],
        loConnectId: [...new Set(loConnectId)],
        blockBasedConnectId: [...new Set(blockBasedConnectId)],
        chapterConnectId: selectedChapter || '',
        courseId: courseIdFromRoute,
        updateComponentQuery,
        thumbnail: imageFile,
        smallThumbnail
      }
      if (isPythonCourse(courseIdFromRoute)) {
        editInput = {
          ...editInput,
          questionsConnectId: [...new Set(questionsConnectId)],
          assignmentConnectId: [...new Set(assignmentConnectId)],
        }
      } else {
        editInput = {
          ...editInput,
          input: {
            ...editInput.input,
            topicQuestions: {
              replace: topicQuestions
            },
            topicAssignmentQuestions: {
              replace: topicAssignmentQuestions
            },
            topicHomeworkAssignmentQuestion: {
              replace: topicHomeworkAssignmentQuestion
            }
          }
        }
      }
      await updateTopicSessions(editInput, courseIdFromRoute)
    }
  }
  thumbnailRef = React.createRef()
  smallThumbnailRef = React.createRef()
  onThumbnailDrop = (file) => {
    if (file) {
      this.setState({ imageFile: file })
    }
  }
  onSmallThumbnailDrop = (file) => {
    if (file) {
      this.setState({ smallThumbnail: file })
    }
  }
  onCourseChange = () => {
    this.setState({
      videoList: [],
      loList: [],
      assignmentList: [],
      projectList: [],
      practiceList: [],
      homeworkAssignmentList: []
    })
  }
  render() {
    const { order, sessionTopic, selectedComponents,
      selectedTab, imageFile, imageUrl, sessionDescription,
      isTrial, selectedChapter, chaptersList, smallThumbnail,
      smallThumbnailUrl, courseId, showLoading, status } = this.state
    const { operation, topicDataFetchingStatus, editData,
      coursesList, topicAddingStatus, topicUpdateStatus, match } = this.props
    const isQuizTabActive = selectedTab.includes('quiz')
    const courseIdFromRoute = get(match, 'params.courseId')
    const addingStatus = topicAddingStatus && topicAddingStatus.getIn([`topics/${courseIdFromRoute}`])
    const updatingStatus = topicUpdateStatus && topicUpdateStatus.getIn([`topics/${courseIdFromRoute}`])
    return (
      <Spin spinning={operation === 'edit' && showLoading}>
        <StyledModal>
          <TopContainer justify='space-between' style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: '0.15' }}><h4>Session Order</h4>
              <Input
                value={order}
                type='number'
                onChange={({ target: { value } }) =>
                  this.setState({ order: value })}
              />
            </div>
            <div style={{ marginLeft: '10px', flex: '0.3' }}>
              <h4>Session Topic <span style={{ color: 'red' }}>*</span></h4>
              <Input
                value={sessionTopic}
                onBlur={() => this.setState({ sessionTopic: sessionTopic.trim() })}
                type='text'
                onChange={({ target: { value } }) =>
                  this.setState({ sessionTopic: value })}
              />
            </div>
            <div style={{ marginLeft: '10px', flex: '0.3' }}>
              <h4>Session Description</h4>
              <Input.TextArea
                value={sessionDescription}
                type='text'
                onChange={({ target: { value } }) =>
                  this.setState({ sessionDescription: value })}
              />
            </div>
            <div style={{ flex: '0.2', marginLeft: '10px', }}>
              <h4>Select Chapter</h4>
              <SearchInput
                value={selectedChapter}
                loading={topicDataFetchingStatus
                  && get(topicDataFetchingStatus.toJS(), 'loading')}
                placeholder='Select a Course'
                onChange={(value) => this.setState({ selectedChapter: value })}
                dataArray={chaptersList}
              />
            </div>
          </TopContainer>
          <TopContainer>
            <RadioGroup
              name='isTrial'
              buttonStyle='solid'
              value={isTrial}
              onChange={({ target: { value } }) => this.setState({ isTrial: value })}
            >
              <MainModal.StyledRadio value={false}>Paid</MainModal.StyledRadio>
              <MainModal.StyledRadio value>Free</MainModal.StyledRadio>
            </RadioGroup>
            <div style={{ display: 'flex' }}>
              <span>Status : </span>
              <StyledSwitch
                bgcolor={status === PUBLISHED_STATUS ? '#64da7a' : '#ff5744'}
                checked={status === PUBLISHED_STATUS}
                onChange={() => this.setState({
                  status:
                    status === PUBLISHED_STATUS ? UNPUBLISHED_STATUS : PUBLISHED_STATUS
                })}
                size='default'
              />
            </div>
          </TopContainer>
          <TopContainer justify='space-between' style={{ alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <h3>Component Pool</h3>
              {this.renderComponentPool()}
            </div>
            <div style={{ width: '188px' }}>
              <h3>Thumbnail</h3>
              <Dropzone
                width='100%'
                height='200px'
                getDropzoneFile={this.onThumbnailDrop}
                ref={this.thumbnailRef}
                defaultImage={getFullPath(get(editData, 'thumbnail.uri', '')) || imageUrl}
                defaultFile={imageFile}
                onImageUrl={imgUrl => this.setState({ imageUrl: imgUrl })}
              >Click or drag to attach
              </Dropzone>
            </div>
            <div style={{ width: '188px' }}>
              <h3>Small Thumbnail</h3>
              <Dropzone
                width='100%'
                height='200px'
                getDropzoneFile={this.onSmallThumbnailDrop}
                ref={this.smallThumbnailRef}
                defaultImage={getFullPath(get(editData, 'thumbnailSmall.uri', '')) || smallThumbnailUrl}
                defaultFile={smallThumbnail}
                onImageUrl={imgUrl => this.setState({ smallThumbnailUrl: imgUrl })}
              >Click or drag to attach
              </Dropzone>
            </div>
          </TopContainer>
          <TopContainer>
            {
              !isQuizTabActive && (
                <div style={{ display: 'flex', alignItems: 'flex-start', flex: '1' }}>
                  <h3 style={{ width: '12%' }}>Select Course</h3>
                  <SearchInput
                    value={courseId}
                    placeholder='Select a Course'
                    onChange={(value) => this.setState({ courseId: value },
                      () => this.onCourseChange())}
                    dataArray={coursesList}
                  />
                </div>
              )
            }
          </TopContainer>
          <div style={{ margin: '15px 0' }} />
          {
            selectedComponents.length > 0 && (
              <DragDropContext onDragEnd={this.onDragEnd} >
                <Droppable droppableId='droppable' direction='horizontal' >
                  {provided => (
                    <div ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        width: '90vw',
                        overflowY: 'auto',
                        borderBottom: '2px solid #A8A7A7',
                        display: 'flex',
                        alignItems: 'flex-end',
                        paddingTop: '15px',
                        margin: '0 auto'
                      }}
                    >
                      {
                        sortBy(selectedComponents, 'order').map((component, i) => (
                          <Draggable index={i}
                            draggableId={component.order}
                            key={component.order}
                          >
                            {
                              (provid, snapshot) => (
                                <div
                                  ref={provid.innerRef}
                                  {...provid.draggableProps}
                                  {...provid.dragHandleProps}
                                  style={this.rowStyle(snapshot.isDragging,
                                      provid.draggableProps.style)}
                                >
                                  <ComponentTab
                                    selected={selectedTab === get(component, 'uniqueName')}
                                    onClick={() => this.setState({ selectedTab: get(component, 'uniqueName') })}
                                  >
                                    <Icon type='close' onClick={() => this.handleRemoveComponent(component)} />
                                    <img style={{ height: '15px', width: '15px', marginRight: '10px', objectFit: 'contain' }} src={dotIcons} alt='Icons' />
                                    <ComponentIcon
                                      componentName={get(component, 'componentName')}
                                      selected={selectedTab === get(component, 'uniqueName')}
                                    />
                                    <strong style={{ margin: '0 10px' }}>
                                      {getComponentName(get(component, 'componentName'))}
                                    </strong>
                                    <PlusOutlined />
                                  </ComponentTab>
                                </div>
                              )
                            }
                          </Draggable>
                        ))
                      }
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )
          }
          <div style={{ margin: '15px 0' }} />
          <TopContainer justify='flex-end'>
            <StyledButton
              icon='file'
              id='add-btn'
              disabled={this.disableSave()}
              onClick={this.onSave}
              loading={operation === 'add' ? addingStatus && get(addingStatus.toJS(), 'loading')
                : updatingStatus && get(updatingStatus.toJS(), 'loading')}
            >
              {operation === 'add' ? 'SAVE' : 'UPDATE'}
            </StyledButton>
          </TopContainer>
          {this.renderTabs()}
        </StyledModal>
      </Spin>
    )
  }
}

const mapStateToProps = (state) => ({
  videoFetchingStatus: state.data.getIn(['videos', 'fetchStatus', 'videos']),
  videoData: state.data.getIn(['videos', 'data']),
  questionBankFetchingStatus: state.data.getIn(['questionBanks', 'fetchStatus', 'questionBanks']),
  questionBankData: state.data.getIn(['questionBanks', 'data']),
  projectFetchingStatus: state.data.getIn(['blockBasedProjects', 'fetchStatus', 'project']),
  projectData: filterKey(state.data.getIn(['blockBasedProjects', 'data']), 'project'),
  practiceFetchingStatus: state.data.getIn(['blockBasedProjects', 'fetchStatus', 'practice']),
  practiceData: filterKey(state.data.getIn(['blockBasedProjects', 'data']), 'practice'),
  learningObectiveFetchingStatus: state.data.getIn(['learningObjectives', 'fetchStatus', 'learningObjectives']),
  learningObjectiveData: filterKey(state.data.getIn(['learningObjectives', 'data']), 'learningObjectives'),
  assignmentFetchingStatus: state.data.getIn(['assignmentQuestions', 'fetchStatus', 'assignmentQuestions']),
  assignmentData: filterKey(state.data.getIn(['assignmentQuestion', 'data']), 'assignmentQuestions'),
  topicDataFetchingStatus: state.data.getIn(['sessionTopic', 'fetchStatus', 'sessionTopic']),
  homeworkAssignmentFetchStatus: state.data.getIn(['assignmentQuestions', 'fetchStatus', 'homeworkAssignment']),
  homeworkAssignmentData: filterKey(state.data.getIn(['assignmentQuestion', 'data']), 'homeworkAssignment')
})

export default connect(mapStateToProps)(SessionModal)
