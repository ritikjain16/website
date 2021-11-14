import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import Main from './ProjectForm.style'
import ProjectForm from './ProjectForm'
import { getOrderAutoComplete, getOrdersInUse } from '../../../../utils/data-utils'
import colors from '../../../../constants/colors'
import ProjectCardContent from './ProjectCardContent'

const ProjectContentFormWrapper = (props) => {
  const { selectedProject, content, editProjectContentsOrder } = props
  const orders = getOrdersInUse(content || [])
  const orderAutoComplete = getOrderAutoComplete(orders)
  const [isDisabled, setIsDisabled] = useState(true)
  const [contentData, setContent] = useState([])
  useEffect(() => {
    setContent(content)
  }, [content])
  useEffect(() => {
    setTimeout(() => {
      if (document.getElementById('addForm')) {
        document.getElementById('addForm').scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 1000)
  }, [selectedProject])
  const onCancel = () => {
    setIsDisabled(true)
    setContent(content)
  }
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    return result
  }
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }
    const data = [...contentData]
    const draggedContent = reorder(
      data,
      result.source.index,
      result.destination.index
    )
    setContent(draggedContent)
  }
  const onSave = async () => {
    const input = contentData.map((msg, index) => ({
      id: msg.id,
      fields: {
        order: index + 1
      }
    }))
    if (input.length > 0) {
      await editProjectContentsOrder(input)
      setIsDisabled(true)
    } else {
      setIsDisabled(true)
    }
  }
  const rowStyle = (isDragging, dragglePropsStyle) => (
    {
      maxWidth: '450px',
      margin: '0 auto',
      border: isDragging ? `1px solid ${colors.loPage.tableBorder}` : '',
      background: isDragging ? 'lightgray' : 'white',
      ...dragglePropsStyle
    }
  )
  return (
    <Main id='tech-talk-form-wrapper'>
      <div
        style={{
          position: 'sticky',
          top: '5px',
          width: '100%',
          textAlign: 'right',
          zIndex: 10
        }}
      >{
          isDisabled ? (
            <Button type='primary' onClick={() => setIsDisabled(false)} >Re-order</Button>
          ) : (
            <>
              <Button type='dashed' style={{ marginRight: '10px' }} onClick={onCancel} >Cancel</Button>
              <Button type='primary' onClick={onSave} >Save</Button>
            </>
          )
      }
      </div>
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId='droppable' isDropDisabled={isDisabled} >
          {provided => (
            <div ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ width: '100%', height: 'max-content' }}
            >
              {
                contentData.map(({ id, ...projectContent }, i) => (
                  <Draggable index={i}
                    draggableId={id}
                    key={id}
                    isDragDisabled={isDisabled}
                  >
                    {
                      (provid, snapshot) => (
                        <div
                          ref={provid.innerRef}
                          {...provid.draggableProps}
                          {...provid.dragHandleProps}
                          style={rowStyle(snapshot.isDragging,
                            provid.draggableProps.style)}
                        >
                          {
                            isDisabled ? (
                              <ProjectForm {...props}
                                order={projectContent.order}
                                projectContent={projectContent}
                                projectContentId={id}
                                formType='edit'
                                formId={projectContent.id}
                                selectedProject={selectedProject}
                                key={id}
                                i={i}
                              />
                            ) : (
                              <ProjectCardContent
                                {...props}
                                order={projectContent.order}
                                projectContent={projectContent}
                                projectContentId={id}
                                formType='edit'
                                formId={projectContent.id}
                                selectedProject={selectedProject}
                                key={id}
                                i={i}
                              />
                            )
                          }
                        </div>
                      )
                    }
                  </Draggable>
                ))
              }
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div style={{ maxWidth: '450px', margin: '0 auto', width: '100%' }} >
        <ProjectForm {...props}
          formType='add'
          formId='addForm'
          i='add'
          selectedProject={selectedProject}
          order={orderAutoComplete}
        />
      </div>
    </Main>
  )
}

export default ProjectContentFormWrapper
