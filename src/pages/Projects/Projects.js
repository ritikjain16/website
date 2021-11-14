import { notification } from 'antd'
import { get, sortBy } from 'lodash'
import React from 'react'
import { fetchProjects } from '../../actions/projects'
import TopicNav from '../../components/TopicNav'
import topicJourneyRoutes from '../../constants/topicJourneyRoutes'
import ProjectModal from './components/ProjectModal'
import ProjectTab from './components/ProjectTab'
import { TopContainer, StyledButton } from './Projects.style'

class Projects extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      topicId: this.props.match.params.topicId,
      openModal: false,
      operation: null,
      editData: null,
      projects: [],
      selectedProject: '',
    }
  }
  componentDidMount = async () => {
    const { topicTitle, fetchTopics, stickerEmojis, fetchStickerEmoji } = this.props
    const { topicId } = this.state
    await fetchProjects(topicId)
    if (!topicTitle) {
      fetchTopics(topicId)
    }
    if (stickerEmojis.length === 0) {
      fetchStickerEmoji()
    }
  }
  componentDidUpdate = (prevProps, prevState) => {
    const { isProjectsFetching, isProjectsFetched, projectUpdateStatus,
      projectUpdateFailure } = this.props
    if (!isProjectsFetching && isProjectsFetched) {
      if (get(prevProps, 'projects') !== get(this.props, 'projects')) {
        this.setState({ projects: this.props.projects ? sortBy(this.props.projects.toJS(), 'order') : [] },
          () => this.setState({ selectedProject: this.state.projects.length > 0 ? this.state.projects[0].id : '' })
        )
      }
    }
    if (projectUpdateStatus && !get(projectUpdateStatus.toJS(), 'loading')
      && get(projectUpdateStatus.toJS(), 'success') &&
      (prevProps.projectUpdateStatus !== projectUpdateStatus)) {
      notification.success({
        message: 'Project updated successfully'
      })
      if (
        get(prevProps, 'projects') !== get(this.props, 'projects')
      ) {
        this.setState({
          projects: this.props.projects ? this.props.projects.toJS() : []
        }, () => this.setState({ selectedProject: prevState.selectedProject }))
      }
    } else if (projectUpdateStatus && !get(projectUpdateStatus.toJS(), 'loading')
      && get(projectUpdateStatus.toJS(), 'failure') &&
      (prevProps.projectUpdateFailure !== projectUpdateFailure)) {
      if (projectUpdateFailure && projectUpdateFailure.toJS().length > 0) {
        notification.error({
          message: get(get(projectUpdateFailure.toJS()[0], 'error').errors[0], 'message')
        })
      }
    }
  }
  openModal = () => {
    this.setState({ openModal: true, operation: 'add' })
  }
  selectProject = (dataId) => {
    this.setState({
      selectedProject: dataId
    })
  }
  setEditModal = (data) => {
    this.setState({
      openModal: true,
      editData: data,
      operation: 'edit'
    })
  }
  render() {
    const { topicId, openModal, operation, editData, selectedProject, projects } = this.state
    return (
      <>
        <TopicNav activeTab={topicJourneyRoutes.project} />
        <TopContainer>
          <StyledButton
            icon='plus'
            type='primary'
            style={{ marginLeft: 'auto' }}
            onClick={this.openModal}
          >ADD PROJECT
          </StyledButton>
          <ProjectModal
            openModal={openModal}
            operation={operation}
            projectsData={projects}
            editData={editData}
            closeEditModal={() =>
            this.setState({ openModal: false, operation: null, editData: null })}
            closeModal={() => this.setState({ openModal: false, operation: null })}
            topicId={topicId}
            {...this.props}
          />
        </TopContainer>
        {selectedProject && projects.length > 0 && (
          <ProjectTab
            stickerEmojis={this.props.stickerEmojis}
            topicId={topicId}
            selectedProject={selectedProject}
            projectsData={projects}
            setEditModal={this.setEditModal}
            selectProject={this.selectProject}
            {...this.props}
          />
        )}
      </>
    )
  }
}

export default Projects
