import React from 'react'
import PropTypes from 'prop-types'
import { Table } from '../../../../components/StyledComponents'
import LearningObjectiveHeader from '../LearningObjectiveHeader'
import { Screen } from './LearningObjectiveTable.style'
import TopicNav from '../../../../components/TopicNav'
import topicJourneyRoutes from '../../../../constants/topicJourneyRoutes'
import LOTableBody from './LOTableBody'
import LOTableHeader from './LOTableHeader'
// Total lo count from the data

const columnsTemplate = '58px 140px 190px repeat(2, 80px) 310px repeat(2, 105px) 60px 105px ;'
const minWidth = '792px'
const rowLayoutProps = {
  columnsTemplate,
  minWidth
}
// orders in use in sorted order
const ordersInUse = (data) => {
  const unordered = data.map(row => row.order)
  return unordered.sort((a, b) => a - b)
}
/**
 * responsible for rendering the whole LearningObjectiveTable
 * @returns {React.ReactElement}
 */
const LO = ({ data, isFetchingLearningobjective, ...rest }) => {
  const [isReOrdering, setIsReOrdering] = React.useState(false)
  return (
    <Screen>
      <TopicNav activeTab={topicJourneyRoutes.learningObjectives} />
      <LearningObjectiveHeader
        ordersInUse={ordersInUse(rest.learningObjectives)}
        isFetchingLearningobjective={isFetchingLearningobjective}
        isReOrdering={isReOrdering}
        setIsReOrdering={setIsReOrdering}
        {...rest}
      />
      <Table>
        <LOTableHeader {...rowLayoutProps} />
        <LOTableBody
          {...rest}
          {...rowLayoutProps}
          isFetchingLearningobjective={isFetchingLearningobjective}
          isReOrdering={isReOrdering}
        />
      </Table>
    </Screen>
  )
}

LO.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    /** Title of the Learning Objective */
    title: PropTypes.string.isRequired,
    /** Order of the Learning Objective */
    order: PropTypes.number.isRequired,
    /** Date on which the Learning Objective is created */
    createdAt: PropTypes.string.isRequired,
    /** Date on which the Learning Objective is last modified */
    updatedAt: PropTypes.string.isRequired
  })).isRequired,
  isFetchingLearningobjective: PropTypes.bool.isRequired
}
export default LO
