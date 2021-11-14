import { Button, Icon, notification, Select, Spin } from 'antd'
import gql from 'graphql-tag'
import { get } from 'lodash'
import React from 'react'
import {
  removeFromCourseComponent,
  removeFromLoQuiz,
  updateAssignmentQuestion, updateContentProject,
  updateLearningObjective, updateQuestionBank, updateVideo
} from '../../../actions/contentMaker'
import { removeComponentFromSession } from '../../../actions/courseMaker'
import MainModal from '../../../components/MainModal'
import {
  ASSIGNMENT, HOMEWORK_ASSIGNMENT, LEARNING_OBJECTIVE,
  PRACTICE, PROJECT, QUIZ, VIDEO
} from '../../../constants/CourseComponents'
import getIdArrForQuery from '../../../utils/getIdArrForQuery'
import requestToGraphql from '../../../utils/requestToGraphql'
import { ContentWrapper, MDTable, SelectGrid } from '../Videos/Videos.styles'
import AssignSelectInput from './AssignSelectInput'

const { Option, OptGroup } = Select
class AssignModal extends React.Component {
  state = {
    selectedCourses: [],
    selectedTopics: [],
    selectedLo: [],
    allTopicsList: [],
    isTopicsLoading: false,
    coursesTopicsAndLo: [],
    learningObjectiveData: [],
    groupedTopics: {}
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { openAssignModal, componentName } = this.props
    const { allTopicsList, isTopicsLoading } = this.state
    if (prevProps.openAssignModal !== openAssignModal && openAssignModal) {
      this.setSelectedCourses()
      this.setSelectedTopics()
      if (componentName === QUIZ) this.setSelectedLo()
      if (allTopicsList.length === 0) this.fetchAllTopics()
    }
    if (prevState.isTopicsLoading !== isTopicsLoading && !isTopicsLoading) {
      this.setSelectedCourses()
      this.setSelectedTopics()
      if (componentName === QUIZ) this.setSelectedLo()
    }
  }

  setSelectedData = (data, type) => {
    const dataArray = []
    get(data, type, []).forEach(value => {
      dataArray.push({
        id: get(value, 'id'),
        title: get(value, 'title')
      })
    })
    return dataArray
  }
  setSelectedCourses = () => {
    const { assignModalData, coursesList, allLoList, componentName } = this.props
    const selectedCourses = this.setSelectedData(assignModalData, 'courses')
    const selectedTopics = this.setSelectedData(assignModalData, 'topics')
    const coursesTopicArray = []
    selectedCourses.forEach(course => {
      const courseData = coursesList.find(co => get(co, 'id') === get(course, 'id'))
      let courseDataObj = {
        courseId: get(course, 'id'),
        title: get(course, 'title'),
        topics: [],
        learningObjective: []
      }
      if (courseData && get(courseData, 'topics', []).length > 0) {
        get(courseData, 'topics', []).forEach(topic => {
          const isTopicSelected = selectedTopics.map(to => get(to, 'id'))
          if (isTopicSelected.includes(get(topic, 'id'))) {
            courseDataObj = {
              ...courseDataObj,
              topics: [...courseDataObj.topics, topic]
            }
          }
        })
      }
      coursesTopicArray.push(courseDataObj)
    })
    if (componentName === QUIZ) {
      const learningObjectiveData = []
      const selectedLo = this.setSelectedData(assignModalData, 'learningObjectives')
      if (selectedLo.length === 0) {
        const selectedCoursesData = this.setSelectedData(assignModalData, 'courses')
        selectedCoursesData.forEach(course => {
          const loData = {
            id: '',
            title: '',
            courses: [course]
          }
          learningObjectiveData.push(loData)
        })
      } else {
        selectedLo.forEach(lo => {
          let loData = {
            id: get(lo, 'id'),
            title: get(lo, 'title'),
            courses: []
          }
          const findLo = allLoList.find(lObj => get(lObj, 'id') === get(lo, 'id'))
          if (findLo && get(findLo, 'courses', []).length > 0) {
            const isSelectedCourse = selectedCourses.map(course => get(course, 'id'))
            const findCourse = get(findLo, 'courses', []).filter(course =>
              isSelectedCourse.includes(get(course, 'id')))
            if (findCourse && findCourse.length > 0) {
              loData = {
                ...loData,
                courses: findCourse
              }
            }
          }
          if (findLo && get(findLo, 'topics', []).length > 0) {
            const isTopicSelected = selectedTopics.map(topic => get(topic, 'id'))
            const findTopics = get(findLo, 'topics', []).filter(topic =>
              isTopicSelected.includes(get(topic, 'id')))
            if (findTopics && findTopics.length > 0) {
              loData = {
                ...loData,
                topics: findTopics
              }
            }
          }
          learningObjectiveData.push(loData)
        })
      }
      this.setState({
        learningObjectiveData
      })
      return
    }
    this.setState({
      selectedCourses,
      coursesTopicsAndLo: coursesTopicArray,
    })
  }
  fetchAllTopics = async () => {
    this.setState({ isTopicsLoading: true })
    const topics = await requestToGraphql(gql`
    {
      topics(orderBy: order_ASC) {
        id
        title
        courses{
          id
          title
        }
        assignmentQuestions(filter: { isHomework: false }) {
          id
        }
        homeworkAssignment: assignmentQuestions(filter: { isHomework: true }) {
          id
        }
        questions(filter: { assessmentType: quiz }) {
          id
        }
        topicComponentRule {
          componentName
          order
          learningObjective {
            id
          }
          video {
            id
          }
          blockBasedProject {
            type
            id
          }
        }
      }
    }
    `)
    const groupedTopics = get(topics, 'data.topics', []).reduce((acc, currVal) => {
      get(currVal, 'courses', []).forEach(course => {
        const courseName = `${get(course, 'title')}|${get(course, 'id')}`
        if (acc && acc[courseName]) {
          acc[courseName].push(currVal)
        } else {
          acc[courseName] = [currVal]
        }
      })
      return acc
    }, {})
    this.setState({
      allTopicsList: get(topics, 'data.topics', []),
      isTopicsLoading: false,
      groupedTopics
    })
  }

  setSelectedLo = () => {
    const { assignModalData } = this.props
    const selectedLo = this.setSelectedData(assignModalData, 'learningObjectives')
    this.setState({
      selectedLo
    })
  }

  setSelectedTopics = () => {
    const { assignModalData } = this.props
    const selectedTopics = this.setSelectedData(assignModalData, 'topics')
    this.setState({
      selectedTopics
    })
  }

  onSelect = (value, type) => {
    const { selectedTopics, selectedLo,
      allTopicsList, isTopicsLoading } = this.state
    const { allLoList, coursesList, componentName } = this.props
    if (!isTopicsLoading) {
      if (type === 'topics') {
        if (componentName === QUIZ) {
          let newLoObjData = [...this.state.learningObjectiveData]
          const findTopic = allTopicsList.find(topic => get(topic, 'id') === value)
          if (findTopic) {
            const findTopicInLo = allLoList.filter(lo => get(lo, 'topics', []).map(topic => get(topic, 'id')).includes(value))
            if (findTopicInLo && findTopicInLo.length > 0) {
              findTopicInLo.forEach(lo => {
                const findInd = newLoObjData.findIndex(loObj => get(loObj, 'id') === get(lo, 'id'))
                const topicData = { id: get(findTopic, 'id'), title: get(findTopic, 'title') }
                if (findInd >= 0) {
                  const isExistTopic = newLoObjData[findInd].topics.find(to => get(to, 'id') === get(findTopic, 'id'))
                  if (!isExistTopic) {
                    newLoObjData[findInd].topics.push(topicData)
                  }
                } else {
                  newLoObjData = [...newLoObjData, {
                    id: get(lo, 'id'),
                    title: get(lo, 'title'),
                    courses: get(lo, 'courses'),
                    topics: [topicData]
                  }]
                }
              })
              this.setState({
                learningObjectiveData: newLoObjData
              })
            }
          }
        } else {
          this.setState({
            coursesTopicsAndLo: this.onAddData(value, type)
          })
        }
        const topicsList = [...selectedTopics, value]
        this.setState({
          selectedTopics: topicsList
        })
      } else if (type === 'courses') {
        if (componentName === QUIZ) {
          let newLoObjData = [...this.state.learningObjectiveData]
          const findCourse = coursesList.find(course => get(course, 'id') === value)
          if (findCourse) {
            const courseInLo = allLoList.filter(lo => get(lo, 'courses', []).map(course => get(course, 'id')).includes(value))
            if (courseInLo && courseInLo.length > 0) {
              courseInLo.forEach(lo => {
                const findInd = newLoObjData.findIndex(loObj => get(loObj, 'id') === get(lo, 'id'))
                const courseData = { id: get(findCourse, 'id'), title: get(findCourse, 'title') }
                if (findInd >= 0) {
                  const isExistCourse = newLoObjData[findInd].courses.find(to => get(to, 'id') === get(findCourse, 'id'))
                  if (!isExistCourse) {
                    newLoObjData[findInd].courses.push(courseData)
                  }
                } else {
                  newLoObjData = [...newLoObjData, {
                    id: get(lo, 'id'),
                    title: get(lo, 'title'),
                    courses: [courseData],
                    topics: get(lo, 'topics')
                  }]
                }
              })
              this.setState({
                learningObjectiveData: newLoObjData
              })
            }
          }
        } else {
          this.setState({
            coursesTopicsAndLo: this.onAddData(value, type)
          })
        }
      } else if (type === 'learningObjectives') {
        if (componentName === QUIZ) {
          const findLo = allLoList.find(lo => get(lo, 'id') === value)
          let newLoObjData = [...this.state.learningObjectiveData]
          const isExist = newLoObjData.find(lo => get(lo, 'id') === value)
          if (!isExist) {
            newLoObjData = [...newLoObjData, {
              id: get(findLo, 'id'),
              title: get(findLo, 'title'),
              topics: get(findLo, 'topics'),
              courses: get(findLo, 'courses')
            }]
            this.setState({
              learningObjectiveData: newLoObjData
            })
          }
        } else {
          const loDataExist = allLoList.find(lo => get(lo, 'id') === value)
          if (loDataExist) {
            this.setState({
              coursesTopicsAndLo: this.onAddData(value, type)
            }, () => {
              let updatedCourseTopicAndLo = [...this.state.coursesTopicsAndLo]
              get(loDataExist, 'topics', []).forEach(topic => {
                const topicData = allTopicsList.find(to => get(to, 'id') === topic.id)
                if (topicData) {
                  const selectedCourseIds = updatedCourseTopicAndLo.map(data => get(data, 'courseId'))
                  get(topicData, 'courses', []).forEach(course => {
                    if (!selectedCourseIds.includes(get(course, 'id'))) {
                      updatedCourseTopicAndLo = [...updatedCourseTopicAndLo, {
                        courseId: get(course, 'id'),
                        title: get(course, 'title'),
                        topics: [{
                          id: get(topicData, 'id'),
                          title: get(topicData, 'title')
                        }],
                        learningObjective: []
                      }]
                    } else {
                      const courseDataInd = updatedCourseTopicAndLo.findIndex(data => get(data, 'courseId') === get(course, 'id'))
                      if (courseDataInd >= 0) {
                        const addedTopics = get(updatedCourseTopicAndLo[courseDataInd], 'topics', []).map(to => get(to, 'id'))
                        if (!addedTopics.includes(topic.id)) {
                          updatedCourseTopicAndLo[courseDataInd].topics.push({
                            id: get(topicData, 'id'),
                            title: get(topicData, 'title')
                          })
                        }
                      }
                    }
                  })
                }
              })
              this.setState({
                coursesTopicsAndLo: updatedCourseTopicAndLo
              })
            })
          }
        }
        const loList = [...selectedLo, value]
        const loData = allLoList.find(lo => get(lo, 'id') === get(value, 'id'))
        this.addAssociatedCourseAndTopic(loData, 'courses')
        this.addAssociatedCourseAndTopic(loData, 'topics')
        this.setState({
          selectedLo: loList
        })
      }
    }
  }

  onAddData = (value, type) => {
    const { allTopicsList, coursesTopicsAndLo } = this.state
    const { coursesList, allLoList } = this.props
    let newCoursesTopicsAndLo = [...coursesTopicsAndLo]
    let searchData = null
    if (type === 'courses') {
      const courseExist = newCoursesTopicsAndLo.find(data => get(data, 'courseId') === value)
      const courseData = coursesList.find(course => get(course, 'id') === value)
      if (!courseExist && courseData) {
        newCoursesTopicsAndLo = [...newCoursesTopicsAndLo, {
          courseId: get(courseData, 'id'),
          title: get(courseData, 'title'),
          topics: [],
          learningObjective: []
        }]
      }
      return newCoursesTopicsAndLo
    } else if (type === 'topics') {
      searchData = allTopicsList.find(topic => get(topic, 'id') === value)
    } else {
      searchData = allLoList.find(lo => get(lo, 'id') === value)
    }
    if (searchData) {
      const selectedCoursesIds = newCoursesTopicsAndLo.map(data => get(data, 'courseId'))
      get(searchData, 'courses', []).forEach(course => {
        if (!selectedCoursesIds.includes(get(course, 'id'))) {
          if (type === 'topics') {
            newCoursesTopicsAndLo = [...newCoursesTopicsAndLo, {
              courseId: get(course, 'id'),
              title: get(course, 'title'),
              topics: [{
                id: get(searchData, 'id'),
                title: get(searchData, 'title')
              }],
              learningObjective: []
            }]
          } else {
            newCoursesTopicsAndLo = [...newCoursesTopicsAndLo, {
              courseId: get(course, 'id'),
              title: get(course, 'title'),
              topics: [],
              learningObjective: [
                {
                  id: get(searchData, 'id'),
                  title: get(searchData, 'title')
                }
              ]
            }]
          }
        } else {
          const courseDataInd = newCoursesTopicsAndLo.findIndex(data => get(data, 'courseId') === get(course, 'id'))
          if (courseDataInd >= 0) {
            const alreadyAdded = get(newCoursesTopicsAndLo[courseDataInd], type, []).map(to => get(to, 'id'))
            if (!alreadyAdded.includes(value)) {
              if (type === 'topics') {
                newCoursesTopicsAndLo[courseDataInd].topics.push({
                  id: get(searchData, 'id'),
                  title: get(searchData, 'title')
                })
              } else {
                newCoursesTopicsAndLo[courseDataInd].learningObjective.push({
                  id: get(searchData, 'id'),
                  title: get(searchData, 'title')
                })
              }
            }
          }
        }
      })
      return newCoursesTopicsAndLo
    }
  }

  onDeselect = (value, type) => {
    const { isTopicsLoading, coursesTopicsAndLo,
      learningObjectiveData } = this.state
    const newCoursesTopicsAndLo = [...coursesTopicsAndLo]
    const { coursesList, componentName } = this.props
    if (!isTopicsLoading) {
      if (type === 'topics') {
        if (componentName === QUIZ) {
          const newLoObjData = [...learningObjectiveData]
          const foundtopics = newLoObjData.filter(lo =>
            get(lo, 'topics', []).map(topic =>
              get(topic, 'id')).includes(get(value, 'id')))
          if (foundtopics && foundtopics.length > 0) {
            foundtopics.forEach(lo => {
              const findInd = newLoObjData.findIndex(loObj => get(loObj, 'id') === get(lo, 'id'))
              if (findInd >= 0) {
                newLoObjData[findInd].topics = [...newLoObjData[findInd].topics].filter(topic => get(topic, 'id') !== get(value, 'id'))
              }
            })
            this.setState({
              learningObjectiveData: newLoObjData
            })
          }
        } else {
          const isExistTopic = newCoursesTopicsAndLo.filter(course =>
            get(course, 'topics', []).map(to =>
              get(to, 'id')).includes(get(value, 'id')))

          if (isExistTopic && isExistTopic.length > 0) {
            isExistTopic.forEach(tData => {
              const dataInd = newCoursesTopicsAndLo.findIndex(courseData =>
                get(courseData, 'courseId') === get(tData, 'courseId'))
              if (dataInd >= 0) {
                newCoursesTopicsAndLo[dataInd].topics =
                  [...newCoursesTopicsAndLo[dataInd].topics].filter(to =>
                    get(to, 'id') !== get(value, 'id'))
              }
            })
          }
        }
        this.setState({
          coursesTopicsAndLo: newCoursesTopicsAndLo
        })
      } else if (type === 'courses') {
        if (componentName === QUIZ) {
          const newLoObjData = [...learningObjectiveData]
          const foundCourse = newLoObjData.filter(lo =>
            get(lo, 'courses', []).map(course =>
              get(course, 'id')).includes(get(value, 'id')))
          if (foundCourse && foundCourse.length > 0) {
            foundCourse.forEach(lo => {
              const findInd = newLoObjData.findIndex(loObj => get(loObj, 'id') === get(lo, 'id'))
              if (findInd >= 0) {
                newLoObjData[findInd].courses =
                  [...newLoObjData[findInd].courses].filter(course =>
                    get(course, 'id') !== get(value, 'id'))
              }
            })
            this.setState({
              learningObjectiveData: newLoObjData
            })
          }
        } else {
          const isExistCourse = newCoursesTopicsAndLo.find(course => get(course, 'courseId') === get(value, 'id'))
          if (isExistCourse) {
            this.setState({
              coursesTopicsAndLo: newCoursesTopicsAndLo.filter(course => get(course, 'courseId') !== get(value, 'id'))
            }, () => {
              const newCourseData = [...this.state.coursesTopicsAndLo]
              if (newCourseData.length > 0 && get(isExistCourse, 'topics', []).length > 0) {
                get(isExistCourse, 'topics', []).forEach(topic => {
                  const topicsFromCourse = coursesList.find(course => get(course, 'id') === get(value, 'id'))
                  const coursesTopicIds = get(topicsFromCourse, 'topics', []).map(to => get(to, 'id'))
                  if (coursesTopicIds.includes(get(topic, 'id'))) {
                    const topicsWithOtherCourse = newCourseData.filter(course =>
                      get(course, 'topics').map(to => get(to, 'id')).includes(topic.id))
                    if (topicsWithOtherCourse.length === 0) {
                      const courseInd = newCourseData.findIndex(courseData =>
                        get(courseData, 'topics', []).map(to =>
                          get(to, 'id')).includes(get(topic, 'id')))
                      if (courseInd >= 0) {
                        newCourseData[courseInd].topics =
                          [...newCourseData[courseInd].topics].filter(to => get(to, 'id') !== get(topic, 'id'))
                      }
                      this.removeComponentOperation(get(topic, 'id'), 'topics')
                    }
                  }
                })
              }
            })
          }
        }
      } else if (type === 'learningObjectives' && componentName === QUIZ) {
        let newLoObjData = [...learningObjectiveData]
        const loData = newLoObjData.find(loObj => get(loObj, 'id') === get(value, 'id'))
        if (loData) {
          newLoObjData = [...newLoObjData].filter(lo => get(lo, 'id') !== get(value, 'id'))
          this.setState({
            learningObjectiveData: newLoObjData
          }, () => {
            const newLoOData = [...this.state.learningObjectiveData]
            if (get(loData, 'topics', []).length > 0) {
              get(loData, 'topics', []).forEach(topic => {
                const isTopicExist = newLoOData.filter(lo =>
                  get(lo, 'topics', []).map(to =>
                    get(to, 'id')).includes(get(topic, 'id')))
                if (isTopicExist && isTopicExist.length === 0) {
                  this.removeComponentOperation(get(topic, 'id'), 'topics')
                }
              })
            }
            if (get(loData, 'courses', []).length > 0) {
              get(loData, 'courses', []).forEach(course => {
                const isTopicExist = newLoOData.filter(lo =>
                  get(lo, 'courses', []).map(to =>
                    get(to, 'id')).includes(get(course, 'id')))
                if (isTopicExist && isTopicExist.length === 0) {
                  this.removeComponentOperation(get(course, 'id'), 'courses')
                }
              })
            }
          })
        }
      }
      this.removeComponentOperation(get(value, 'id'), type)
    }
  }

  removeTopicOrLO = (value, type) => {
    const { coursesList, allLoList } = this.props
    const { selectedTopics, allTopicsList, selectedLo } = this.state
    const topicsFromCourse = coursesList.find(course => get(course, 'id') === value)
    if (topicsFromCourse) {
      let newSelectedTopic = [...selectedTopics]
      selectedTopics.forEach(topic => {
        const coursesTopicIds = get(topicsFromCourse, 'topics', []).map(to => get(to, 'id'))
        if (coursesTopicIds.includes(get(topic, 'id'))) {
          const otherCourse = allTopicsList.find(top => get(top, 'id') === get(topic, 'id'))
          if (otherCourse && get(otherCourse, 'courses', []).length === 1) {
            newSelectedTopic = newSelectedTopic.filter(to => get(to, 'id') !== get(topic, 'id'))
            this.removeComponentOperation(get(topic, 'id'), 'topics')
          }
        }
      })
      this.setState({
        selectedTopics: newSelectedTopic
      })
    }
    if (type) {
      const courseLo = allLoList.filter(lo => get(lo, 'courses', []).map(course => get(course, 'id')).includes(value))
      if (courseLo && courseLo.length > 0) {
        let newSelectedLo = [...selectedLo]
        courseLo.forEach(lo => {
          if (get(lo, 'courses', []).length === 1) {
            const selectedLoIds = selectedLo.map(lObj => get(lObj, 'id'))
            if (selectedLoIds.includes(get(lo, 'id'))) {
              newSelectedLo = newSelectedLo.filter(lObj => get(lObj, 'id') !== get(lo, 'id'))
              this.removeComponentOperation(get(lo, 'id'), 'learningObjectives')
            }
          }
        })
        this.setState({
          selectedLo: newSelectedLo
        })
      }
    }
  }

  removeTopicOrCourseOnDelete = (searchData, filterData, typeLo) => {
    const { allTopicsList } = this.state
    const { allLoList } = this.props
    if (typeLo) {
      if (get(searchData, typeLo, []).length > 0) {
        get(searchData, typeLo, []).forEach(value => {
          const allAssociatedData = allLoList.filter(lo =>
            get(lo, typeLo, []).map(co => get(co, 'id')).includes(get(value, 'id')))
          let topicCount = 0
          allAssociatedData.forEach(data => {
            const selectedValueIds = filterData.map(to => get(to, 'id'))
            if (selectedValueIds.includes(get(data, 'id'))) {
              topicCount += 1
            }
          })
          if (topicCount === 0) {
            if (typeLo === 'courses') {
              const newCourses = [...this.state.selectedCourses].filter(co =>
                get(co, 'id') !== get(value, 'id'))
              this.setState({
                selectedCourses: newCourses
              })
              this.removeComponentOperation(get(value, 'id'), 'courses')
            } else {
              const newTopics = [...this.state.selectedTopics].filter(to =>
                get(to, 'id') !== get(value, 'id'))
              this.setState({
                selectedTopics: newTopics
              })
              this.removeComponentOperation(get(value, 'id'), 'topics')
            }
          }
        })
      }
      /* eslint-disable no-lonely-if */
    } else {
      if (get(searchData, 'courses', []).length > 0) {
        get(searchData, 'courses', []).forEach(course => {
          const allAssociatedTopics = allTopicsList.filter(topic =>
            get(topic, 'courses', []).map(co => get(co, 'id')).includes(get(course, 'id')))
          let topicCount = 0
          allAssociatedTopics.forEach(topic => {
            const selectedTopicIds = filterData.map(to => get(to, 'id'))
            if (selectedTopicIds.includes(get(topic, 'id'))) {
              topicCount += 1
            }
          })
          if (topicCount === 0) {
            const newCourses = [...this.state.selectedCourses].filter(co =>
              get(co, 'id') !== get(course, 'id'))
            this.setState({
              selectedCourses: newCourses
            })
            this.removeComponentOperation(get(course, 'id'), 'courses')
          }
        })
      }
    }
  }

  addAssociatedCourseAndTopic = (searchData, type) => {
    const { selectedCourses, selectedTopics } = this.state
    if (get(searchData, type, []).length > 0) {
      const newSelectedCourse = [...selectedCourses]
      const newSelectedTopic = [...selectedTopics]
      get(searchData, type, []).forEach(val => {
        if (type === 'courses') {
          const selectedCourseIds = newSelectedCourse.map(co => get(co, 'id'))
          if (!selectedCourseIds.includes(get(val, 'id'))) {
            newSelectedCourse.push({
              id: get(val, 'id'),
              title: get(val, 'title')
            })
          }
        } else {
          const selectedTopicIds = newSelectedTopic.map(co => get(co, 'id'))
          if (!selectedTopicIds.includes(get(val, 'id'))) {
            newSelectedTopic.push({
              id: get(val, 'id'),
              title: get(val, 'title')
            })
          }
        }
      })
      if (type === 'courses') this.setState({ selectedCourses: newSelectedCourse })
      else this.setState({ selectedTopics: newSelectedTopic })
    }
  }
  onCloseModal = () => {
    const { onCloseAssignModal } = this.props
    this.setState({
      coursesTopicsAndLo: [],
      learningObjectiveData: []
    }, onCloseAssignModal)
  }

  getTopicUpdateData = () => {
    const { allTopicsList, coursesTopicsAndLo, learningObjectiveData } = this.state
    const { componentName, assignModalData } = this.props
    let selectedTopics = []
    let selectedCourses = []
    let selectedLo = []
    if (componentName === QUIZ) {
      learningObjectiveData.forEach(lo => {
        selectedLo.push(get(lo, 'id'))
        if (get(lo, 'topics', []).length > 0) {
          selectedTopics.push(...get(lo, 'topics', []).map(topic => get(topic, 'id')))
        }
        if (get(lo, 'courses', []).length > 0) {
          selectedCourses.push(...get(lo, 'courses', []).map(course => get(course, 'id')))
        }
      })
    } else {
      coursesTopicsAndLo.forEach(course => {
        selectedCourses.push(get(course, 'courseId'))
        if (get(course, 'topics', []).length > 0) {
          selectedTopics.push(...get(course, 'topics', []).map(topic => get(topic, 'id')))
        }
        if (get(course, 'learningObjective', []).length > 0) {
          selectedLo.push(...get(course, 'learningObjective', []).map(lo => get(lo, 'id')))
        }
      })
    }
    selectedCourses = [...new Set(selectedCourses)]
    selectedTopics = [...new Set(selectedTopics)]
    selectedLo = [...new Set(selectedLo)]
    const newlyAddedTopics = []
    selectedTopics.forEach(topic => {
      const prevTopicIds = get(assignModalData, 'topics', []).map(to => get(to, 'id'))
      if (!prevTopicIds.includes(topic)) {
        newlyAddedTopics.push(topic)
      }
    })
    const updateTopicDataArray = []
    newlyAddedTopics.forEach(topic => {
      const isExist = allTopicsList.find(to => get(to, 'id') === topic)
      if (isExist) {
        let topicData = {
          id: get(isExist, 'id'),
          assignmentConnectId: get(isExist, 'assignmentQuestions', []).map(assignment => get(assignment, 'id')),
          questionsConnectId: get(isExist, 'questions', []).map(question => get(question, 'id')),
          homeworkAssignmentId: get(isExist, 'homeworkAssignment', []).map(homework => get(homework, 'id'))
        }
        const videoConnectId = []
        const blockBasedConnectId = []
        const loConnectId = []
        let componentInput = ''
        const ordersArr = []
        let isQuizExist = false
        let isAssignmentExist = false
        let isHomeworkExist = false
        get(isExist, 'topicComponentRule', []).forEach(component => {
          if (get(component, 'componentName') === VIDEO) {
            if (get(component, 'video.id')) {
              videoConnectId.push(get(component, 'video.id'))
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')},
                videoConnectId: "${get(component, 'video.id')}"
              },`
            } else {
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')}
              },`
            }
            ordersArr.push(get(component, 'order'))
          } else if (get(component, 'componentName') === QUIZ) {
            isQuizExist = true
            componentInput += `{
              componentName: ${get(component, 'componentName')},
              order: ${get(component, 'order')}
            },`
            ordersArr.push(get(component, 'order'))
          } else if (get(component, 'componentName') === PROJECT) {
            if (get(component, 'blockBasedProject.id')) {
              blockBasedConnectId.push(get(component, 'blockBasedProject.id'))
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')},
                blockBasedProjectConnectId: "${get(component, 'blockBasedProject.id')}"
              },`
            } else {
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')}
              },`
            }
            ordersArr.push(get(component, 'order'))
          } else if (get(component, 'componentName') === PRACTICE) {
            if (get(component, 'blockBasedProject.id')) {
              blockBasedConnectId.push(get(component, 'blockBasedProject.id'))
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')},
                blockBasedProjectConnectId: "${get(component, 'blockBasedProject.id')}"
              },`
            } else {
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')}
              },`
            }
            ordersArr.push(get(component, 'order'))
          } else if (get(component, 'componentName') === LEARNING_OBJECTIVE) {
            if (get(component, 'learningObjective.id')) {
              loConnectId.push(get(component, 'learningObjective.id'))
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')},
                learningObjectiveConnectId: "${get(component, 'learningObjective.id')}"
              },`
            } else {
              componentInput += `{
                componentName: ${get(component, 'componentName')},
                order: ${get(component, 'order')}
              },`
            }
            ordersArr.push(get(component, 'order'))
          } else if (get(component, 'componentName') === ASSIGNMENT) {
            isAssignmentExist = true
            componentInput += `{
              componentName: ${get(component, 'componentName')},
              order: ${get(component, 'order')},
            },`
            ordersArr.push(get(component, 'order'))
          } else if (get(component, 'componentName') === HOMEWORK_ASSIGNMENT) {
            isHomeworkExist = true
            componentInput += `{
              componentName: ${get(component, 'componentName')},
              order: ${get(component, 'order')},
            },`
            ordersArr.push(get(component, 'order'))
          }
        })
        topicData = {
          ...topicData,
          videoConnectId,
          blockBasedConnectId,
          loConnectId,
          componentInput
        }
        if (componentName === VIDEO) {
          topicData = {
            ...topicData,
            videoConnectId: [...get(topicData, 'videoConnectId'), get(assignModalData, 'id')],
            componentInput: `${get(topicData, 'componentInput')}{
              componentName: ${VIDEO},
              order: ${this.getNextOrder(ordersArr)},
              videoConnectId: "${get(assignModalData, 'id')}"
            }`
          }
        } else if (componentName === LEARNING_OBJECTIVE) {
          topicData = {
            ...topicData,
            loConnectId: [...get(topicData, 'loConnectId'), get(assignModalData, 'id')],
            componentInput: `${get(topicData, 'componentInput')}{
              componentName: ${LEARNING_OBJECTIVE},
              order: ${this.getNextOrder(ordersArr)},
              learningObjectiveConnectId: "${get(assignModalData, 'id')}"
            }`
          }
        } else if (componentName === ASSIGNMENT) {
          if (isAssignmentExist) {
            topicData = {
              ...topicData,
              assignmentConnectId: [...get(topicData, 'assignmentConnectId'), ...get(topicData, 'homeworkAssignmentId'), get(assignModalData, 'id')],
            }
          } else {
            topicData = {
              ...topicData,
              assignmentConnectId: [...get(topicData, 'assignmentConnectId'), ...get(topicData, 'homeworkAssignmentId'), get(assignModalData, 'id')],
              componentInput: `${get(topicData, 'componentInput')}{
                componentName: ${ASSIGNMENT},
                order: ${this.getNextOrder(ordersArr)},
              }`
            }
          }
        } else if (componentName === PROJECT || componentName === PRACTICE) {
          topicData = {
            ...topicData,
            blockBasedConnectId: [...get(topicData, 'blockBasedConnectId'), get(assignModalData, 'id')],
            componentInput: `${get(topicData, 'componentInput')}{
              componentName: ${componentName},
              order: ${this.getNextOrder(ordersArr)},
              blockBasedProjectConnectId: "${get(assignModalData, 'id')}"
            }`
          }
        } else if (componentName === QUIZ) {
          if (isQuizExist) {
            topicData = {
              ...topicData,
              questionsConnectId: [...get(topicData, 'questionsConnectId'), get(assignModalData, 'id')],
            }
          } else {
            topicData = {
              ...topicData,
              questionsConnectId: [...get(topicData, 'questionsConnectId'), get(assignModalData, 'id')],
              componentInput: `${get(topicData, 'componentInput')}{
                componentName: ${QUIZ},
                order: ${this.getNextOrder(ordersArr)},
              }`
            }
          }
        } else if (componentName === HOMEWORK_ASSIGNMENT) {
          if (isHomeworkExist) {
            topicData = {
              ...topicData,
              assignmentConnectId: [...get(topicData, 'homeworkAssignmentId'), ...get(topicData, 'assignmentConnectId'), get(assignModalData, 'id')],
            }
          } else {
            topicData = {
              ...topicData,
              assignmentConnectId: [...get(topicData, 'homeworkAssignmentId'), ...get(topicData, 'assignmentConnectId'), get(assignModalData, 'id')],
              componentInput: `${get(topicData, 'componentInput')}{
                componentName: ${HOMEWORK_ASSIGNMENT},
                order: ${this.getNextOrder(ordersArr)},
              }`
            }
          }
        }
        updateTopicDataArray.push(topicData)
      }
    })
    return updateTopicDataArray
  }
  updateTopics = async () => {
    const topicInputs = this.getTopicUpdateData()
    if (topicInputs.length === 0) return
    let updateQuery = ''
    topicInputs.forEach(({ id, assignmentConnectId = [], blockBasedConnectId = [],
      componentInput, loConnectId = [], questionsConnectId = [], videoConnectId = [] },
    index) => {
      updateQuery += `
      updateTopic${index}: updateTopic(
        id: "${id}"
        ${assignmentConnectId.length > 0 ? `assignmentQuestionsConnectIds: [${getIdArrForQuery(assignmentConnectId)}]` : ''}
        ${blockBasedConnectId.length > 0 ? `blockBasedProjectsConnectIds: [${getIdArrForQuery(blockBasedConnectId)}]` : ''}
        ${loConnectId.length > 0 ? `learningObjectivesConnectIds: [${getIdArrForQuery(loConnectId)}]` : ''}
        ${questionsConnectId.length > 0 ? `questionsConnectIds: [${getIdArrForQuery(questionsConnectId)}]` : ''}
        ${videoConnectId.length > 0 ? `videoContentConnectIds: [${getIdArrForQuery(videoConnectId)}]` : ''}
        ${componentInput ? `input: {
          topicComponentRule: {
            replace: [${componentInput}]
          }
        }` : ''}
      ) {
        id
      }
      `
    })

    const updatedData = await requestToGraphql(gql`mutation {${updateQuery}}`)
    return updatedData
  }
  onSave = async () => {
    const { componentName, assignModalData } = this.props
    const { coursesTopicsAndLo, learningObjectiveData } = this.state
    let selectedTopics = []
    let selectedCourses = []
    let selectedLo = []
    if (componentName === QUIZ) {
      learningObjectiveData.forEach(lo => {
        if (get(lo, 'id')) {
          selectedLo.push(get(lo, 'id'))
        }
        if (get(lo, 'topics', []).length > 0) {
          selectedTopics.push(...get(lo, 'topics', []).map(topic => get(topic, 'id')))
        }
        if (get(lo, 'courses', []).length > 0) {
          selectedCourses.push(...get(lo, 'courses', []).map(course => get(course, 'id')))
        }
      })
    } else {
      coursesTopicsAndLo.forEach(course => {
        selectedCourses.push(get(course, 'courseId'))
        if (get(course, 'topics', []).length > 0) {
          selectedTopics.push(...get(course, 'topics', []).map(topic => get(topic, 'id')))
        }
        if (get(course, 'learningObjective', []).length > 0) {
          selectedLo.push(...get(course, 'learningObjective', []).map(lo => get(lo, 'id')))
        }
      })
    }
    selectedCourses = [...new Set(selectedCourses)]
    selectedTopics = [...new Set(selectedTopics)]
    selectedLo = [...new Set(selectedLo)]
    if (componentName === VIDEO) {
      await updateVideo({
        videoId: get(assignModalData, 'id'),
        input: {},
        coursesList: selectedCourses,
        topicsList: selectedTopics
      }).then(res => {
        if (res && res.updateVideo && res.updateVideo.id) {
          this.updateTopics()
          this.onCloseModal()
          notification.success({
            message: 'Video updated successfully'
          })
        }
      })
    } else if (componentName === LEARNING_OBJECTIVE) {
      await updateLearningObjective({
        loId: get(assignModalData, 'id'),
        input: {},
        selectedCourses,
        selectedTopics
      }).then(res => {
        if (res && res.updateLearningObjective && res.updateLearningObjective.id) {
          this.updateTopics()
          this.onCloseModal()
        }
      })
    } else if (componentName === ASSIGNMENT) {
      await updateAssignmentQuestion({
        assignmentId: get(assignModalData, 'id'),
        input: {},
        selectedCourses,
        selectedTopics,
        componentName
      }).then(res => {
        if (res && res.updateAssignmentQuestion && res.updateAssignmentQuestion.id) {
          this.updateTopics()
          this.onCloseModal()
        }
      })
    } else if (componentName === PROJECT) {
      await updateContentProject({
        projectId: get(assignModalData, 'id'),
        input: {
          type: 'project'
        },
        key: 'project',
        selectedCourses,
        selectedTopics
      }).then(res => {
        if (res && res.updateBlockBasedProject && res.updateBlockBasedProject.id) {
          this.updateTopics()
          this.onCloseModal()
        }
      })
    } else if (componentName === PRACTICE) {
      await updateContentProject({
        projectId: get(assignModalData, 'id'),
        input: {},
        key: 'practice',
        selectedCourses,
        selectedTopics
      }).then(res => {
        if (res && res.updateBlockBasedProject && res.updateBlockBasedProject.id) {
          this.updateTopics()
          this.onCloseModal()
        }
      })
    } else if (componentName === QUIZ) {
      await updateQuestionBank({
        questionId: get(assignModalData, 'id'),
        input: {},
        key: QUIZ,
        coursesId: selectedCourses,
        topicIds: selectedTopics,
        loIds: selectedLo
      }).then(res => {
        if (res && res.updateQuestionBank && res.updateQuestionBank.id) {
          this.updateTopics()
          this.onCloseModal()
        }
      })
    } else if (componentName === HOMEWORK_ASSIGNMENT) {
      await updateAssignmentQuestion({
        assignmentId: get(assignModalData, 'id'),
        input: {},
        selectedCourses,
        selectedTopics,
        componentName
      }).then(res => {
        if (res && res.updateAssignmentQuestion && res.updateAssignmentQuestion.id) {
          this.updateTopics()
          this.onCloseModal()
        }
      })
    }
  }

  getNextOrder = (dataArray = []) =>
    dataArray.length === 0 ? 1 : Math.max(...dataArray) + 1

  removeComponentOperation = async (dataId, type) => {
    const { assignModalData, componentName } = this.props
    const dataList = get(assignModalData, type, []).map(val => get(val, 'id'))
    if (dataList.includes(dataId)) {
      if (type === 'topics') {
        await removeComponentFromSession(dataId, get(assignModalData, 'id'), componentName)
      } else if (type === 'courses') {
        await removeFromCourseComponent(dataId, get(assignModalData, 'id'), componentName)
      } else if (type === 'learningObjectives') {
        await removeFromLoQuiz(dataId, get(assignModalData, 'id'))
      }
    }
  }

  getTableColumn = () => {
    const { componentName } = this.props
    let columns = [
      {
        title: 'Courses',
        dataIndex: 'courseId',
        key: 'courseId',
        width: 300,
        render: (_, data) => this.getContents(data, 'courses')
      },
      {
        title: 'Topics',
        dataIndex: 'topics',
        key: 'topics',
        width: 400,
        render: (_, data) => (
          get(data, 'topics', []).map(topic => this.getContents(topic, 'topics', data))
        )
      },
    ]
    if (componentName === QUIZ) {
      columns = [
        {
          title: 'Courses',
          dataIndex: 'courseId',
          key: 'courseId',
          width: 300,
          render: (_, data) => (
            get(data, 'courses', []).map(course => this.getContents({
              ...course,
              courseId: get(course, 'id')
            }, 'courses', data))
          )
        },
        {
          title: 'Topics',
          dataIndex: 'topics',
          key: 'topics',
          width: 400,
          render: (_, data) => (
            get(data, 'topics', []).map(topic => this.getContents(topic, 'topics', data))
          )
        },
        {
          title: 'Learning Objectives',
          dataIndex: 'Learning Objective',
          key: 'Learning Objective',
          width: 400,
          render: (_, data) => data.id && this.getContents(data, 'learningObjectives')
        },
      ]
      columns.push()
    }
    return columns
  }

  getContents = (data, type, courseData) => (
    <ContentWrapper>
      {
        type === 'courses' ? (
          <Icon
            type='close'
            onClick={() =>
              this.onDeselect({
                title: get(data, 'title'),
                id: get(data, 'courseId'),
              }, type)}
          />
        ) : (
          <Icon
            type='close'
            onClick={() => this.onDeselect({
              ...data,
              courseId: get(courseData, 'courseId')
            }, type)}
          />
        )
      }
      {get(data, 'title')}
    </ContentWrapper>
  )

  getSplitedValue = (value) => {
    if (value) {
      const splittedValue = value.split('|')
      if (splittedValue.length > 0) {
        return splittedValue[0]
      }
    }
    return ''
  }
  render() {
    const { openAssignModal, coursesList, saveLoading,
      coursesFetchStatus, componentName, assignModalData, groupedLOs } = this.props
    const { isTopicsLoading, learningObjectiveData,
      groupedTopics, coursesTopicsAndLo } = this.state
    const divStyle = {
      margin: '8px 0'
    }
    return (
      <MainModal
        visible={openAssignModal}
        title={`Assign Courses and Topics ${get(assignModalData, 'title') ? ` for: ${get(assignModalData, 'title')}` : ''}`}
        onCancel={this.onCloseModal}
        maskClosable={false}
        width='80%'
        centered
        destroyOnClose
        footer={null}
      >
        <MDTable
          scroll={{ x: 'max-content' }}
          pagination={false}
          dataSource={componentName === QUIZ ? learningObjectiveData : coursesTopicsAndLo}
          columns={this.getTableColumn()}
          bordered
          rowClassName='assign-table'
        />
        <SelectGrid quiz={componentName === QUIZ}>
          <AssignSelectInput
            placeholder='Select Courses'
            value=''
            loading={coursesFetchStatus && coursesFetchStatus}
            onSelect={(value) => this.onSelect(value, 'courses')}
            dataArray={coursesList}
          />
          <div style={divStyle}>
            <h3>Select Topics</h3>
            <Select
              showSearch
              placeholder='Select Topics'
              notFoundContent={isTopicsLoading ? <Spin size='small' /> : 'No Data Found'}
              value=''
              loading={isTopicsLoading}
              onSelect={(value) => this.onSelect(this.getSplitedValue(value), 'topics')}
              style={{ width: '100%' }}
            >
              {Object.keys(groupedTopics).map((groupedtopic, ind) => (
                <OptGroup key={groupedtopic} label={this.getSplitedValue(groupedtopic)}>
                  {
                    groupedTopics[groupedtopic].map((item, i) => (
                      <Option value={`${get(item, 'id')}|${ind}${i}`}
                        key={get(item, 'id')}
                      >{get(item, 'title')}
                      </Option>
                    ))
                  }
                </OptGroup>
        ))
        }
            </Select>
          </div>
          {
            componentName === QUIZ && (
              <div style={divStyle}>
                <h3>Select Learning Objective</h3>
                <Select
                  showSearch
                  placeholder='Select Learning Objective'
                  notFoundContent='No Data Found'
                  value=''
                  onSelect={(value) => this.onSelect(this.getSplitedValue(value), 'learningObjectives')}
                  style={{ width: '100%' }}
                >
                  {Object.keys(groupedLOs).map((groupedLO, ind) => (
                    <OptGroup key={groupedLO} label={this.getSplitedValue(groupedLO)}>
                      {
                    groupedLOs[groupedLO].map((item, i) => (
                      <Option value={`${get(item, 'id')}|${ind}${i}`}
                        key={get(item, 'id')}
                      >{get(item, 'title')}
                      </Option>
                    ))
                  }
                    </OptGroup>
        ))
        }
                </Select>
              </div>
            )
          }
        </SelectGrid>
        <div style={{ textAlign: 'center' }}>
          <Button
            type='primary'
            loading={saveLoading && saveLoading}
            onClick={this.onSave}
          >
            Save
          </Button>
        </div>
      </MainModal>
    )
  }
}

export default AssignModal
