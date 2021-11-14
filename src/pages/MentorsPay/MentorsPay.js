import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import withNav from '../../components/withNav'
import { Table } from '../../components/StyledComponents'
import MainTable from '../../components/MainTable'
import Calculator from './components/Calculator'
import fetchMentorPayData from '../../actions/mentorPayCalculator/fetchMentorPayData'

const columnsTemplate = 'repeat(6, 0.16fr) repeat(2, 0.09fr)'
const minWidth = '750px'

class MentorsPay extends Component {
  async componentDidMount() {
    await fetchMentorPayData()
  }
  renderTableHead = () => (
    <Table.Row
      columnsTemplate={columnsTemplate}
      minWidth={minWidth}
      style={{ background: '#eee' }}
    >
      <Table.Item>
        <MainTable.Title>Class Type</MainTable.Title>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>Students</MainTable.Title>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>Total Class</MainTable.Title>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>Price/Class</MainTable.Title>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>Classes Pay</MainTable.Title>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>Bonus/Student</MainTable.Title>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>Total Bonus</MainTable.Title>
      </Table.Item>
      <Table.Item>
        <MainTable.Title>Total Amount</MainTable.Title>
      </Table.Item>
    </Table.Row>
  )
  renderTableBody = () =>
    this.props.mentorPricings.toJS().map((pricing) => {
      const formatedData = () => {
        let classType = {
          type: '',
          students: 0,
        }
        if (pricing.modelType === 'oneToOne') {
          classType = {
            type: '1:1',
            students: 1,
          }
        } else if (pricing.modelType === 'oneToTwo') {
          classType = {
            type: '1:2',
            students: 2,
          }
        } else if (pricing.modelType === 'oneToThree') {
          classType = {
            type: '1:3',
            students: 3,
          }
        }
        return classType
      }
      return (
        <>
          <Table.Row
            minWidth={minWidth}
            style={{ background: '#eee' }}
            columnsTemplate={columnsTemplate}
          >
            <Table.Item style={{ fontSize: 14 }}>
              {formatedData().type}
            </Table.Item>
            <Table.Item style={{ fontSize: 14 }}>
              {formatedData().students}
            </Table.Item>
            <Table.Item style={{ fontSize: 14 }}>
              {this.props.topicsMeta.toJS().count}
            </Table.Item>
            <Table.Item style={{ fontSize: 14 }}>
              {pricing.sessionPrice.amount}
            </Table.Item>
            <Table.Item style={{ fontSize: 14 }}>
              {this.props.topicsMeta.toJS().count * pricing.sessionPrice.amount}
            </Table.Item>
            <Table.Item style={{ fontSize: 14 }}>
              {pricing.bonusAmount.amount}
            </Table.Item>
            <Table.Item style={{ fontSize: 14 }}>
              {pricing.bonusAmount.amount}
            </Table.Item>
            <Table.Item style={{ fontSize: 14 }}>
              {this.props.topicsMeta.toJS().count *
                pricing.sessionPrice.amount +
                pricing.bonusAmount.amount}
            </Table.Item>
          </Table.Row>
        </>
      )
    })

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ marginBottom: '30px' }}>Price Chart</h1>
          <Table>
            {this.renderTableHead()}
            {this.renderTableBody()}
          </Table>
        </div>
        <div style={{ height: 'auto', border: '1px solid grey' }} />
        <Calculator
          mentorPricings={this.props.mentorPricings.toJS()}
          topicsMeta={this.props.topicsMeta.toJS()}
        />
      </div>
    )
  }
}

export default withRouter(
  withNav(MentorsPay)({
    title: 'Mentors Pay',
    activeNavItem: 'Mentors Pay',
    showUMSNavigation: true,
  })
)
