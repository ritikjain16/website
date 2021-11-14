import { get } from 'lodash'
import React from 'react'
import {
  FlexContainer, WhiteBox
} from '../SchoolOnBoarding.style'

const DashboardCounts = ({ dashboardCount }) => (
  <FlexContainer justify='space-around' WhiteBoxes noPadding >
    <WhiteBox>
      <h1>{get(dashboardCount, 'studentsMeta', 0)}</h1><span>Students</span>
    </WhiteBox>
    <WhiteBox>
      <h1>{get(dashboardCount, 'gradeMeta', 0)}</h1><span>Grades</span>
    </WhiteBox>
    <WhiteBox>
      <h1>{get(dashboardCount, 'campaignsMeta', 0)}</h1><span>Campaigns</span>
    </WhiteBox>
    <WhiteBox>
      <h1>{get(dashboardCount, 'batchesMeta', 0)}</h1><span>Batches</span>
    </WhiteBox>
  </FlexContainer>
)

export default DashboardCounts
