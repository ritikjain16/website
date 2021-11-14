import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, Progress } from 'antd'
import { get } from 'lodash'
import DashboardMain from './Dashboard.style'
import './dashboard.css'

class Dashboard extends Component {
  static propTypes = {
    dashboard: PropTypes.shape({}).isRequired,
    fetchDashboard: PropTypes.func.isRequired,
    fetchCourses: PropTypes.func.isRequired,
    hasCoursesFetched: PropTypes.bool.isRequired,
    isFetchingCourse: PropTypes.bool.isRequired,
    isFetchingDashboard: PropTypes.bool.isRequired,
    courses: PropTypes.shape({}).isRequired
  }

  state = {
    currentCourse: ''
  }

  componentDidMount() {
    const {
      hasCoursesFetched,
      fetchDashboard,
      fetchCourses
    } = this.props

    if (!hasCoursesFetched) {
      fetchCourses()
    }
    if (hasCoursesFetched) {
      this.setState({ currentCourse: this.props.courses[0].id }, () => {
        fetchDashboard(this.state.currentCourse)
      })
    }
  }

  componentDidUpdate(prevProps) {
    const {
      fetchDashboard
    } = this.props
    if (!prevProps.hasCoursesFetched && this.props.hasCoursesFetched) {
      this.setState({ currentCourse: this.props.courses[0].id }, () => {
        fetchDashboard(this.state.currentCourse)
      })
    }
  }

  render() {
    const {
      dashboard,
      courses,
      fetchDashboard,
      isFetchingCourse,
      isFetchingDashboard
    } = this.props

    const percentage = (published, unpublished) =>
      ((published * 100) / (published + unpublished))

    const dashboardData = []
    dashboardData.push({ title: 'Chapters', pub_data: get(dashboard, 'dashboard.pub_chapters.count'), unpub_data: get(dashboard, 'dashboard.unpub_chapters.count') })
    dashboardData.push({ title: 'Topics', pub_data: get(dashboard, 'dashboard.pub_topics.count'), unpub_data: get(dashboard, 'dashboard.unpub_topics.count') })
    dashboardData.push({ title: 'Learning Objectives', pub_data: get(dashboard, 'dashboard.pub_LO.count'), unpub_data: get(dashboard, 'dashboard.unpub_LO.count') })
    dashboardData.push({ title: 'Practice Questions', pub_data: get(dashboard, 'dashboard.pub_pq.count'), unpub_data: get(dashboard, 'dashboard.unpub_pq.count') })
    dashboardData.push({ title: 'Quiz Questions', pub_data: get(dashboard, 'dashboard.pub_quiz.count'), unpub_data: get(dashboard, 'dashboard.unpub_quiz.count') })
    dashboardData.push({ title: 'Badges', pub_data: get(dashboard, 'dashboard.pub_badges.count'), unpub_data: get(dashboard, 'dashboard.unpub_badges.count') })
    dashboardData.push({ title: 'Cheatsheet', pub_data: get(dashboard, 'dashboard.pub_cheatSheet.count'), unpub_data: get(dashboard, 'dashboard.unpub_cheatSheet.count') })
    dashboardData.push({ title: 'Workbooks', pub_data: get(dashboard, 'dashboard.pub_workbooks.count'), unpub_data: get(dashboard, 'dashboard.unpub_workbooks.count') })

    if (isFetchingCourse) {
      const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
      return <div style={{ padding: '10px' }}>{loadingIcon}</div>
    }

    if (isFetchingDashboard) {
      const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
      return (
        <div>
          <DashboardMain.Select
            showSearch
            placeholder='Select Course'
            type='text'
            value={this.state.currentCourse}
            onChange={(value) => {
   this.setState({ currentCourse: value }, () => {
          fetchDashboard(this.state.currentCourse)
   })
            }}
          >
            {courses.map(course => (
              <DashboardMain.Option value={course.id}>{course.title}</DashboardMain.Option>
                  ))}
          </DashboardMain.Select>
          <div style={{ padding: '10px' }}>{loadingIcon}</div>
        </div>)
    }

    return (
      <div>
        <DashboardMain.Select
          showSearch
          placeholder='Select Course'
          type='text'
          value={this.state.currentCourse}
          onChange={(value) => {
 this.setState({ currentCourse: value }, () => {
        fetchDashboard(this.state.currentCourse)
 })
          }}
        >
          {courses.map(course => (
            <DashboardMain.Option value={course.id}>{course.title}</DashboardMain.Option>
                ))}
        </DashboardMain.Select>
        <DashboardMain>
          <DashboardMain.flexContainer>
            {dashboardData.map(dashboardItem => (
              // <DashboardMain.flexItem>
              <div
                style={{ display: 'flex',
 flexDirection: 'column',
 minWidth: '20%',
                flexgrow: '1',
                background: 'white',
                margin: '0.5vw',
                width: '300px',
                // minHeight: '90px',
                marginBottom: '2vw',
                padding: 0,
                fontWeight: 'normal',
                fontSize: '1.3em',
                textAlign: 'center',
                borderRadius: '.6vw .6vw 0vw 0vw',

                boxShadow: '0.3vw 0.3vw .4vw silver',
                transition: ' 0.3s' }}
              >
                <div style={{ backgroundColor: '#E6F7FF', color: '#00ADE6', borderRadius: '.6vw .6vw 0 0', height: '2.5vw', paddingTop: '.2vw' }}><strong>{dashboardItem.title}</strong>
                </div>
                <div style={{ fontSize: '1.2vw', margin: '1vw' }}>

                  <div style={{ float: 'left', width: '50%', fontSize: '1.3vw', color: '#80D3BB', textAlign: 'left' }} >Published <br /><font style={{ fontSize: '2.5vw' }}>{dashboardItem.pub_data}</font></div>
                  <div style={{ float: 'right', width: '50%', fontSize: '1.3vw', color: '#777777', textAlign: 'right' }} >Unpublished <br /><font style={{ fontSize: '2.5vw' }}>{dashboardItem.unpub_data}</font></div>

                </div>

                <div style={{ width: '100%', borderRadius: '0 0 1vw 1vw ' }} />

                <Progress percent={100} strokeLinecap='square' strokeColor='#FFECB8' strokeSuccess='#FFECB8' successPercent={percentage(dashboardItem.pub_data, dashboardItem.unpub_data)} type='line' strokeWidth='2.5vw' showInfo={false} />

              </div>
              // </DashboardMain.flexItem>
            ))}

          </DashboardMain.flexContainer>
        </DashboardMain>
      </div>
    )
  }
}

export default Dashboard
