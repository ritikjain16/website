import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../../../components/StyledComponents'
import LearningObjectiveHead from './LearningObjectiveHead'
import LearningObjectiveBody from './LearningObjectiveBody'
import Screen from './LearningObjectiveTable.style'

const columnsTemplate = '50px minmax(100px, 0.4fr) minmax(100px, 0.4fr) minmax(100px, 0.4fr) 80px 60px;'
const minWidth = '1140px'
const rowLayoutProps = {
  columnsTemplate,
  minWidth,
  isVideoLOMapping: true
}

const LearningObjectiveTable = ({
  isFetching,
  isLOPresent,
  videoPlayer,
  shouldVideo,
  messageLO,
  isMessageLO,
  openEditLOVideoThumbnail,
  openEditStoryVideoThumbnail,
  ...props }) => (
    <Screen>
      <Table>
        <LearningObjectiveHead {...rowLayoutProps} />
        {isMessageLO
                    ? (
                      <LearningObjectiveBody
                        isFetching={isFetching}
                        videoPlayer={videoPlayer}
                        openEditLOVideoThumbnail={openEditLOVideoThumbnail}
                        openEditStoryVideoThumbnail={openEditStoryVideoThumbnail}
                        learningObjectives={props.learningObjectives}
                        {...props}
                        {...rowLayoutProps}
                      />
                    )
                    : (
                      <Screen.LOErrorDiv>
                        {messageLO}
                      </Screen.LOErrorDiv>
                    )}

      </Table>
    </Screen>
)
LearningObjectiveTable.defaultProps = {
  videoPlayer: null,
}
LearningObjectiveTable.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  videoPlayer: PropTypes.shape({}),
  isLOPresent: PropTypes.bool.isRequired,
  shouldVideo: PropTypes.bool.isRequired,
  isMessageLO: PropTypes.bool.isRequired,
  messageLO: PropTypes.string.isRequired,
  openEditLOVideoThumbnail: PropTypes.func.isRequired,
  openEditStoryVideoThumbnail: PropTypes.func.isRequired,
}

export default LearningObjectiveTable
