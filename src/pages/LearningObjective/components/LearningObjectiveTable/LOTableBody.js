import React from 'react'
import { Icon, Spin } from 'antd'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'
import LOTableRow from './LOTableRow'
import MainTable from '../../../../components/MainTable'
import { getOrdersInUse } from '../../../../utils/data-utils'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const getItemStyle = (isDragging, draggableStyle, noBorder) => ({
  paddingBottom: (!noBorder && isDragging) ? '-10px' : '0x',
  border: isDragging ? '1px solid #bdbdbd' : 'none',
  background: 'white',
  // styles we need to apply on draggables
  ...draggableStyle,
  boxSizing: 'content-box',
})

const LOTableBody = ({
  learningObjectives,
  deletedLearningobjectiveId,
  columnsTemplate,
  minWidth,
  isFetchingLearningobjective,
  hasLearningObjectivesFetched,
  fetchingLearningobjectivesError,
  ...rest
}) => {
  if (isFetchingLearningobjective) {
    const loadingIcon = <Icon type='loading' style={{ fontSize: 24 }} spin />
    return (
      <div style={{ width: '100%', padding: '15px' }}>
        <Spin indicator={loadingIcon} />
      </div>
    )
  }

  if (hasLearningObjectivesFetched && learningObjectives.length === 0) {
    const emptyText = 'Chapters is empty. Click on \'Add Chapters\' button to add chapters.'
    return (
      <MainTable.EmptyTable>
        {emptyText}
      </MainTable.EmptyTable>
    )
  }

  if (fetchingLearningobjectivesError !== null) {
    const emptyText = `Error: ${fetchingLearningobjectivesError}`
    return (
      <MainTable.EmptyTable>
        {emptyText}
      </MainTable.EmptyTable>
    )
  }

  const onDragEnd = result => {
    if (!result.destination) return
    const reorderedLO = reorder(
      learningObjectives,
      result.source.index,
      result.destination.index
    )
    rest.setLearningObjectives(reorderedLO)
  }

  const lastLearingObjectiveIndex = learningObjectives.length - 1
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable' isDropDisabled={!rest.isReOrdering}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {learningObjectives.map((learningObjective, i) => (
              <Draggable
                key={learningObjective.id}
                draggableId={learningObjective.id}
                index={i}
                isDragDisabled={!rest.isReOrdering}
              >{(providedDrag, snapshotDrag) => (
                <div
                  ref={providedDrag.innerRef}
                  {...providedDrag.draggableProps}
                  {...providedDrag.dragHandleProps}
                  style={getItemStyle(
                    snapshotDrag.isDragging,
                    providedDrag.draggableProps.style,
                    i === lastLearingObjectiveIndex
                  )}
                >
                  <LOTableRow
                    {...learningObjective}
                    {...rest}
                    learningObjective={learningObjective}
                    key={learningObjective.id}
                    isDeleting={learningObjective.id === deletedLearningobjectiveId}
                    columnsTemplate={columnsTemplate}
                    minWidth={minWidth}
                    noBorder={i === lastLearingObjectiveIndex}
                    ordersInUse={getOrdersInUse(learningObjectives)}
                    deletedLearningobjectiveId={rest.deletedLearningobjectiveId}
                  />
                </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

LOTableBody.propTypes = {
  learningObjectives: PropTypes.arrayOf({}).isRequired,
  deletedLearningobjectiveId: PropTypes.string.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  isFetchingLearningobjective: PropTypes.bool.isRequired,
  hasLearningObjectivesFetched: PropTypes.bool.isRequired,
  fetchingLearningobjectivesError: PropTypes.string.isRequired,
}
export default LOTableBody
