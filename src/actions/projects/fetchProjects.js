import gql from 'graphql-tag'
import duck from '../../duck'

const FETCH_PROJECTS = (topicId) => gql`
{
  projects(filter: { topics_some: { id: "${topicId}" } }) {
    id
    title
    createdAt
    status
    order
    topics {
      id
    }
  }
  projectsMeta(filter: { topics_some: { id: "${topicId}" } }) {
    count
  }
}
`
function fetchProjects(topicId) {
  return duck.query({
    query: FETCH_PROJECTS(topicId),
    type: 'projects/fetch',
    key: 'projects',
    changeExtractedData: (originalData, extractedData) => {
      const project = []
      if (originalData && originalData.projects && originalData.projects.length > 0) {
        const { projects } = originalData
        projects.forEach((data) => {
          if (data.topic.id === topicId) {
            project.push(data)
          }
        })
      }
      extractedData.projects = project
      return { ...extractedData }
    }
  })
}

export default fetchProjects
