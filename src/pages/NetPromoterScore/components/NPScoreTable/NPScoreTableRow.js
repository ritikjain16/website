import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from 'antd'
import MainTable from '../../../../components/MainTable'
import { Table } from '../../../../components/StyledComponents'

class NPScoreTableRow extends Component {
  static propTypes = {
    studentName: PropTypes.string.isRequired,
    parentName: PropTypes.string.isRequired,
    phoneNo: PropTypes.string.isRequired,
    score: PropTypes.string.isRequired,
    mentorName: PropTypes.string.isRequired,
    rating: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired
  }

  getNpsScorePercentageColor = () => {
    const { score } = this.props
    if (score > 8) {
      return '#00a64d'
    } else if (score > 6) {
      return '#eed307'
    }
    return '#c80202'
  }

  render() {
    const {
      columnsTemplate,
      noBorder,
      minWidth,
      studentName,
      parentName,
      phoneNo,
      score,
      mentorName,
      rating,
      comment
    } = this.props
    return (
      <MainTable.Row
        columnsTemplate={columnsTemplate}
        noBorder={noBorder}
        minWidth={minWidth}
      >
        <Table.Item>
          <MainTable.Item>{studentName}</MainTable.Item>
        </Table.Item>
        <Table.Item>
          <MainTable.Item>{parentName}</MainTable.Item>
        </Table.Item>
        <Table.Item>
          <MainTable.Item>
            {phoneNo}
          </MainTable.Item>
        </Table.Item>
        <Table.Item>
          <MainTable.Item style={{ color: this.getNpsScorePercentageColor(), fontWeight: 'bold' }} >{score}</MainTable.Item>
        </Table.Item>
        <Table.Item>
          <MainTable.Item>{mentorName}</MainTable.Item>
        </Table.Item>
        <Table.Item>
          <MainTable.Item>{rating}</MainTable.Item>
        </Table.Item>
        <Table.Item>
          {
            comment !== '-'
              ? (
                <Tooltip title={comment} placement='left'>
                  <MainTable.Item
                    overFlowY
                  >
                    {comment && comment.length > 40 ? `${comment.substring(0, 40).trim()}.....` : comment}
                  </MainTable.Item>
                </Tooltip>
              )
              : (
                <MainTable.Item
                  overFlowY
                >
                  {comment}
                </MainTable.Item>
              )
          }
        </Table.Item>
      </MainTable.Row>
    )
  }
}

NPScoreTableRow.propTypes = {
  session: PropTypes.shape({}).isRequired,
  order: PropTypes.number.isRequired,
  columnsTemplate: PropTypes.string.isRequired,
  minWidth: PropTypes.string.isRequired,
  noBorder: PropTypes.bool.isRequired,
  users: PropTypes.shape([]).isRequired,
  menteeSessions: PropTypes.shape([]).isRequired,
  mentorId: PropTypes.number.isRequired,
}

export default NPScoreTableRow
