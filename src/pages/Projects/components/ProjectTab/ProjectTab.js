/* eslint max-len: 0 */
import React from 'react'
import { sortBy } from 'lodash'
import { message } from 'antd'
import SplitScreen from '../SplitScreen/SplitScreen'
import ProjectForm from '../ProjectForm'
import { editProjectContents, fetchProjectContents } from '../../../../actions/projects'
import Main from './ProjectTab.style'
import ProjectTable from '../ProjectsTable/ProjectsTable'

class ProjectTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: null,
    }
  }
  fetchProjectContent = async (id) => {
    await fetchProjectContents(id)
  }
  componentDidMount = () => {
    const { selectedProject, projectsData } = this.props
    if (projectsData.length !== 0) {
      if (selectedProject) {
        this.fetchProjectContent(selectedProject)
      } else {
        this.fetchProjectContent(projectsData[0].id)
      }
    }
  }
  componentDidUpdate = (prevProps) => {
    const { selectedProject } = this.props
    if ((prevProps.selectedProject !== selectedProject) && selectedProject) {
      this.fetchProjectContent(selectedProject)
    }
    if (prevProps.projectContents !== this.props.projectContents) {
      this.setState({
        content: this.props.projectContents && this.props.projectContents.toJS().content,
      })
    }
  }
  addProjectContentToContents = (cnt) => {
    this.setState({ content: [...this.state.content, cnt] })
  }
  editProjectContentFromContents = (cnt) => {
    const exist = this.state.content.find(({ id }) => id === cnt.id)
    if (exist) {
      const newContent = this.state.content.filter(({ id }) => exist.id !== id)
      this.setState({ content: [...newContent, cnt] })
    }
  }
  deleteProjectContentFromContents = (cnt) => {
    this.setState({
      content: this.state.content.filter(({ id }) => id !== cnt.id)
    })
  }
  editProjectContentsOrder = async (input) => {
    const hideLoading = message.loading('Shuffling Messages', 0)
    const { updateProjectContents: data } = await editProjectContents(input)
    if (data && data.length) {
      hideLoading()
      message.success('Contents reordered')
      this.setState({ content: data })
    } else {
      hideLoading()
      message.error('Unexpected error')
    }
  }
  render() {
    const { topicId, stickerEmojis, selectedProject, projectsData, selectProject } = this.props
    const { content } = this.state
    return (
      <Main>
        <SplitScreen {...this.props} mobileBreak={717}>
          <ProjectTable
            projectsData={projectsData}
            selectProject={selectProject}
            selectedProject={selectedProject}
            {...this.props}
          />
          <ProjectForm
            stickerEmojis={stickerEmojis}
            selectedProject={selectedProject}
            topicId={topicId}
            projectsData={projectsData}
            content={sortBy(content, 'order')}
            fetchProjectContent={this.fetchProjectContent}
            addProjectContentToContents={this.addProjectContentToContents}
            deleteProjectContentFromContents={this.deleteProjectContentFromContents}
            editProjectContentFromContents={this.editProjectContentFromContents}
            editProjectContentsOrder={this.editProjectContentsOrder}
            {...this.props}
          />
        </SplitScreen>
      </Main>
    )
  }
}

export default ProjectTab
