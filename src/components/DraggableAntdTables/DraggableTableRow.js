import React from 'react'
import { Draggable } from 'react-beautiful-dnd'

const DraggableTableRow = ({ index, record, tasks, rowId, activeReorderType, ...props }) => {
  if (activeReorderType && activeReorderType === rowId) {
    return (
      <Draggable
        key={props['data-row-key']}
        draggableId={props['data-row-key'].toString()}
        index={index}
      >
        {(provided, snapshot) => (
          <tr
            ref={provided.innerRef}
            {...props}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`row-item ${snapshot.isDragging ? 'row-dragging' : ''}`}
          />
        )}
      </Draggable>
    )
  }
  return <tr {...props} />
}

export default DraggableTableRow
