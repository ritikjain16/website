import React from 'react'
import { Droppable } from 'react-beautiful-dnd'

const DroppableTableBody = ({ columnId, tasks, activeReorderType, ...props }) => {
  if (activeReorderType && activeReorderType === columnId) {
    return (
      <Droppable
        droppableId={columnId}
      >
        {(provided, snapshot) => (
          <tbody
            ref={provided.innerRef}
            {...props}
            {...provided.droppableProps}
            className={`${props.className} ${
            snapshot.isDraggingOver
                ? 'is-dragging-over'
                : ''
            }`}
          />
        )}
      </Droppable>
    )
  }
  return <tbody {...props} />
}

export default DroppableTableBody
