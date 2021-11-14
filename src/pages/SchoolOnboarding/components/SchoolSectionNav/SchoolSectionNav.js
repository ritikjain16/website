import { Radio } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'
import Main from './SchoolSection.style'

const SchoolSectionNav = ({ activeTab, changeTab }) => (
  <Main>
    <Main.RadioGroup
      defaultValue={activeTab}
      value={activeTab}
      buttonStyle='solid'
      onChange={(e) => changeTab(e.target.value)}
    >
      <Radio.Button value='/sms/school-dashboard/:schoolId/grade'>Grades</Radio.Button>
      <Radio.Button value='/sms/school-dashboard/:schoolId/students'>Students</Radio.Button>
      <Radio.Button value='/sms/school-dashboard/:schoolId/campaigns'>Campaigns</Radio.Button>
      <Radio.Button value='/sms/school-dashboard/:schoolId/batches'>Batches</Radio.Button>
    </Main.RadioGroup>
  </Main>
)

SchoolSectionNav.propTypes = {
  activeTab: PropTypes.string.isRequired,
  changeTab: PropTypes.func.isRequired,
}

export default SchoolSectionNav
