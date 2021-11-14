import gql from 'graphql-tag'
import duck from '../../../duck'

const removeImageFromLo = async (loId, fileId, thumbnail) => duck.query({
  query: gql`
  mutation {
      ${
  !thumbnail ? `
        removeFromLearningObjectiveThumbnail(learningObjectiveId: "${loId}", fileId: "${fileId}") {
            learningObjective {
            id
            }
        }
        ` : `
        removeFromLearningObjectivePqStoryImage(learningObjectiveId: "${loId}", fileId: "${fileId}") {
            learningObjective {
            id
            }
        }
        `
}
}
  `,
  type: 'learningObjectives/delete',
  key: thumbnail ? 'removeFromLearningObjectiveThumbnail' : 'removeFromLearningObjectivePqStoryImage',
})

export default removeImageFromLo
