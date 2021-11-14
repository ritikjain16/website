import { get } from 'lodash'
import React from 'react'
import MainModal from '../../../../components/MainModal'

const SchoolDetails = ({ visible, onClose, data }) => (
  <MainModal
    visible={visible}
    onCancel={onClose}
    title='School Details'
    maskClosable={false}
    width='568px'
    centered
    destroyOnClose
    footer={null}
  >
    {data && data.length > 0 ? data.map(({ id, name, email, phone, username }) => (
      <>
        <div key={id}>
          <h3>Name : {!name ? '' : name}</h3>
          <h3>Email : {!email ? '' : email}</h3>
          <h3>Phone : {!phone ? '' : `${get(phone, 'countryCode', '')}${get(phone, 'number', '')}`}</h3>
          <h3>Username : {!username ? '' : username}</h3>
        </div>
      </>
    )) : (
      <>
        <h1>No Data Available</h1>
      </>
    )}
  </MainModal>
)

export default SchoolDetails
