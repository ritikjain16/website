import { notification, Popconfirm } from 'antd'
import { get } from 'lodash'
import React, { useState } from 'react'
import {
  deleteSchoolClasses, fetchBatchesForClass
} from '../../../../actions/SchoolOnboarding'
import MainTable from '../../../../components/MainTable'

const DeleteGrade = (props) => {
  const [showPopup, setShowPopup] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { sections, studentCount } = props
  const deleteAction = async () => {
    const classesIdsArray = sections.map(({ id }) => id)
    await fetchBatchesForClass(classesIdsArray).then(async res => {
      if (get(res, 'batches', []).length > 0 && get(res, 'batchesMeta.count') > 0) {
        notification.error({
          message: `Cannot delete this grade as batch 
          ${get(res, 'batches', []).map(batch => `${get(batch, 'code')}`)} are already present.`
        })
      } else {
        setIsSubmitting(true)
        setShowPopup(true)
        const { deleteSchoolClasse: data } = await deleteSchoolClasses(classesIdsArray)
        if (data && data.length > 0) {
          setIsSubmitting(false)
          setShowPopup(false)
        } else {
          setIsSubmitting(false)
          setShowPopup(false)
        }
      }
    })
  }
  return (
    <MainTable.ActionItem.IconWrapper style={{ marginLeft: '10px' }}>
      <Popconfirm
        title={studentCount > 0 ?
          'Can not delete grade as student is already present in this grade.'
          : 'Do you want to delete this Grade ?'}
        placement='top'
        visible={showPopup}
        onConfirm={() => studentCount > 0 ? setShowPopup(!showPopup) : deleteAction()}
        onCancel={() => setShowPopup(!showPopup)}
        okText={studentCount > 0 ? 'Close' : 'Yes'}
        cancelText='Cancel'
        key='delete'
        okButtonProps={{ loading: isSubmitting }}
        overlayClassName='popconfirm-overlay-primary'
      >
        <MainTable.ActionItem.DeleteIcon onClick={() => setShowPopup(!showPopup)} />
      </Popconfirm>
    </MainTable.ActionItem.IconWrapper>
  )
}

export default DeleteGrade
